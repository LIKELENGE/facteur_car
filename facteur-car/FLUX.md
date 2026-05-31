# Flux complet — electron-todo-angular-prisma

Ce document explique, fichier par fichier et ligne par ligne, ce qui se passe
quand un utilisateur interagit avec l'application.  
Il couvre **3 flux** : ajouter une tâche, cocher/décocher une tâche, tout cocher/décocher (transaction).

---

## Architecture en couches

Avant de rentrer dans les flux, voici les 4 couches traversées à chaque interaction :

```
┌───────────────────────────────────────────────────────────────────────┐
│  RENDERER (Angular) — processus isolé, pas d'accès Node.js direct     │
│                                                                       │
│   Template HTML  →  Composant App  →  TodoService  →  ElectronService │
└──────────────────────────────┬────────────────────────────────────────┘
                               │ window.api  (contextBridge)
┌──────────────────────────────▼──────────────────────────────────────┐
│  PRELOAD — pont sécurisé, seul fichier qui voit les deux mondes     │
│  Expose window.api via contextBridge.exposeInMainWorld              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ ipcRenderer.invoke(canal, ...args)
                               │ ipcMain.handle(canal, handler)
┌──────────────────────────────▼──────────────────────────────────────┐
│  MAIN PROCESS (Node.js) — handlers IPC → todo.repository.ts         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ prisma.todo.*()
┌──────────────────────────────▼──────────────────────────────────────┐
│  SQLITE — fichier prisma/todo.db                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## FLUX 1 — Ajouter une tâche (bouton "Ajouter")

### Étape 1 — Le bouton dans le template

**Fichier :** `renderer/app/src/app/app.html`, ligne 12

```html
<button (click)="add()">Ajouter</button>
```

`(click)="add()"` est la syntaxe Angular pour écouter l'événement DOM `click`.
Quand l'utilisateur clique, Angular appelle la méthode `add()` du composant `App`.

L'input juste au-dessus (ligne 9) maintient le texte tapé dans un **signal** :

```html
<input [value]="newText()"
       (input)="newText.set($any($event.target).value)"
       (keydown.enter)="add()">
```

- `[value]="newText()"` : binding unidirectionnel — Angular affiche la valeur du signal dans le champ
- `(input)="newText.set(...)"` : à chaque frappe, le signal `newText` est mis à jour
- `(keydown.enter)="add()"` : appuyer sur Entrée déclenche aussi `add()`

---

### Étape 2 — La méthode add() dans le composant

**Fichier :** `renderer/app/src/app/app.ts`, lignes 27-32

```typescript
async add(): Promise<void> {
    if (this.newText() === '') return;       // garde : ne rien faire si vide
    await this.TodoService.addTodo(this.newText());
    this.newText.set('');                    // vider le champ
    await this.load();                       // recharger la liste depuis la DB
}
```

- `this.newText()` : lecture du signal (les signaux s'appellent comme des fonctions)
- `this.TodoService` : service injecté par le constructeur (injection de dépendances Angular)
- Après l'ajout, `load()` est appelé pour recharger la liste complète depuis SQLite

---

### Étape 3 — TodoService

**Fichier :** `renderer/app/src/app/services/todo.service.ts`, lignes 17-20

```typescript
addTodo(text: string): Promise<Todo> {
    return this.electronService.getApi().addTodo(text);
}
```

`TodoService` ne fait pas la communication IPC lui-même.
Il délègue à `ElectronService` qui fournit l'accès à `window.api`.

---

### Étape 4 — ElectronService

**Fichier :** `renderer/app/src/app/services/electron.service.ts`, lignes 8-17

```typescript
isElectron(): boolean {
    return !!(window && window.api);  // vérifie qu'on est bien dans Electron
}

getApi(): ElectronAPI {
    if (!this.isElectron()) throw new Error('Not running in Electron environment');
    return window.api;                // retourne le pont exposé par le preload
}
```

`window.api` n'est **pas** un objet natif du navigateur.
C'est un objet injecté par le preload via `contextBridge`.
`ElectronService` vérifie qu'il existe avant de l'utiliser.

Le type `ElectronAPI` vient de **`shared/todo.ts`** — source de vérité unique partagée entre
Main Process, Preload et Angular.

---

### Étape 5 — Le Preload (pont sécurisé)

**Fichier :** `src/preload.ts`, lignes 4-12

```typescript
const api: ElectronAPI = {
    addTodo: (text) => ipcRenderer.invoke('add-todo', text),
    // ...
};

contextBridge.exposeInMainWorld('api', api);
```

`contextBridge.exposeInMainWorld('api', api)` place l'objet `api` sur `window.api`
dans le Renderer — mais de façon **isolée et sécurisée** : Angular ne peut appeler
que les méthodes explicitement listées ici. Il n'a aucun accès à Node.js directement.

`ipcRenderer.invoke('add-todo', text)` envoie un message au Main Process
via le canal nommé `'add-todo'`, avec `text` comme argument.
La méthode retourne une `Promise` qui se résoudra quand le Main Process aura répondu.

Le type `ElectronAPI` est importé depuis `../shared/todo.js` — même source de vérité.

---

### Étape 6 — Le Main Process reçoit le message IPC

**Fichier :** `src/main.ts`, ligne 37

```typescript
ipcMain.handle('add-todo', (_e, text: string) => db.addTodo(text));
```

`ipcMain.handle(canal, handler)` enregistre un handler pour le canal `'add-todo'`.
Quand un `invoke('add-todo', text)` arrive du Renderer, ce handler est exécuté.

- `_e` : l'événement IPC (non utilisé ici, d'où le `_`)
- `text` : le texte envoyé par Angular
- `db` : le module `todo.repository.ts` importé en `import * as db`

---

### Étape 7 — Le Repository Prisma

**Fichier :** `src/repository/todo.repository.ts`, lignes 18-22

```typescript
export async function addTodo(text: string): Promise<Todo> {
    return prisma.todo.create({
        data: { text, done: false },
    });
}
```

`prisma.todo.create()` génère et exécute le SQL suivant :

```sql
INSERT INTO "Todo" ("text", "done") VALUES ('Acheter du lait', false);
```

Prisma retourne un objet `Todo` **typé** — TypeScript sait que `id`, `text` et `done`
existent et ont les bons types. Pas de cast manuel, pas de `as { id: number }`.

---

### Étape 8 — Retour jusqu'au Renderer

La valeur remonte en sens inverse :

```
prisma.todo.create()  →  addTodo()  →  ipcMain.handle()
    →  ipcRenderer.invoke() (Promise résolue)
    →  window.api.addTodo()
    →  ElectronService.getApi().addTodo()
    →  TodoService.addTodo()
    →  App.add()  →  App.load()  →  todos.set([...])
    →  Angular re-rend la liste
```

`todos` est un **signal Angular** (`signal<Todo[]>([])`). Quand `todos.set(...)` est
appelé, Angular détecte le changement et met à jour uniquement les éléments du DOM
qui dépendent de ce signal — sans recharger toute la page.

