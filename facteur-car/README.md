# electron-todo-angular-prisma

Application de gestion de **Todo List** construite avec Electron, Angular et Prisma (SQLite).  
Ce projet est la version finale (S08) — elle reprend le renderer Angular de la V1 (JSON) et remplace la persistance par une base de données SQLite gérée via l'ORM Prisma.

---

## Architecture générale

```
electron-todo-angular-prisma/
├── src/
│   ├── main.ts                       # Main Process Electron — fenêtre + IPC handlers
│   ├── preload.ts                    # Pont sécurisé contextBridge vers Angular
│   └── repository/
│       └── todo.repository.ts        # Toutes les requêtes Prisma (pattern Repository)
├── renderer/
│   └── app/                          # Application Angular (renderer)
│       └── src/app/
│           ├── app.ts                # Composant racine — logique principale
│           ├── services/
│           │   ├── electron.service.ts   # Accès à window.api
│           │   └── todo.service.ts       # Appels IPC via ElectronService
│           └── component/
│               └── todo-item/            # Composant d'affichage d'une tâche
├── prisma/
│   └── schema.prisma                 # Schéma de la base de données
├── .env                              # DATABASE_URL pour la CLI Prisma
├── package.json
└── tsconfig.json
```

---

## Flux de communication

```
Angular (Renderer)       Preload              Main Process         SQLite
       │                    │                      │                  │
  add('Acheter du lait')    │                      │                  │
       │──TodoService──────►│                      │                  │
       │                    │──invoke('add-todo')─►│                  │
       │                    │                      │──prisma.create()►│
       │                    │                      │◄──── Todo ───────│
       │                    │◄───── Todo ──────────│                  │
       │◄── todos.set() ────│                      │                  │
```

Les **3 processus** ne se connaissent pas directement :
- **Angular** appelle `TodoService` → `ElectronService` → `window.api`
- **Preload** expose `window.api` via `contextBridge` (pont sécurisé)
- **Main Process** reçoit les événements IPC et délègue au **repository Prisma**

---

## Schéma de base de données

Le schéma ci-dessous représente la base de données complète de l'application Todo List.  
Dans ce projet, **seule la table `taches` est implémentée** via Prisma (modèle `Todo`).  
Les tables `listes`, `etiquettes` et `tache_etiquette` représentent une évolution possible du schéma.

```
Schéma — TodoList
─────────────────────────────────────────────────────────────────────────────

 ┌──────────────────────┐           ┌──────────────────────────────────────┐
 │        listes        │           │               taches                 │
 ├──────────────────────┤           ├──────────────────────────────────────┤
 │ 🔑 id  : INTEGER PK  │  0,N  1,1 │ 🔑 id           : INTEGER PK         │
 │  titre : TEXT        │──────────►│  titre          : TEXT NOT NULL      │
 └──────────────────────┘           │  description    : TEXT               │
                                    │  statut         : TEXT DEFAULT 'à faire' │
                                    │  priorite       : INTEGER DEFAULT 2  │
                                    │  date_echeance  : TEXT               │
                                    │ 🔗 liste_id      : INTEGER NOT NULL  │
                                    └───────────────────┬──────────────────┘
                                                    0,N │
                                                        │ 1,1
                                    ┌───────────────────▼──────────────────┐
                                    │        tache_etiquette (N:N)         │
                                    ├──────────────────────────────────────┤
                                    │ 🔗 tache_id     : INTEGER NOT NULL   │
                                    │ 🔗 etiquette_id : INTEGER NOT NULL   │
                                    │  PK (tache_id, etiquette_id)         │
                                    └───────────────────┬──────────────────┘
                                                    1,1 │
                                                        │ 0,N
                                    ┌───────────────────▼──────────────────┐
                                    │            etiquettes                │
                                    ├──────────────────────────────────────┤
                                    │ 🔑 id      : INTEGER PK              │
                                    │  nom       : TEXT NOT NULL UNIQUE    │
                                    │  couleur   : TEXT DEFAULT '#cccccc'  │
                                    └──────────────────────────────────────┘

🔑 Clé primaire (PK)   🔗 Clé étrangère FK   Cardinalités Merise : min,max de chaque côté
```

### Explication du schéma

| Table | Rôle |
|---|---|
| `listes` | Une liste regroupe plusieurs tâches (ex : "Travail", "Maison") |
| `taches` | Une tâche appartient à une liste. Elle a un titre, une description, un statut, une priorité et une date d'échéance |
| `etiquettes` | Un tag réutilisable (ex : "urgent", "en cours") avec une couleur |
| `tache_etiquette` | Table de jonction — une tâche peut avoir plusieurs étiquettes, une étiquette peut être sur plusieurs tâches (relation N:N) |

**Cardinalités (notation Merise) :**
- `listes` → `taches` : une liste peut avoir **0 ou N** tâches (0,N) ; une tâche appartient à **exactement 1** liste (1,1)
- `taches` → `tache_etiquette` : une tâche peut avoir **0 ou N** étiquettes (0,N)
- `etiquettes` → `tache_etiquette` : une étiquette peut être sur **0 ou N** tâches (0,N)

### Modèle Prisma actuel (`prisma/schema.prisma`)

```prisma
model Todo {
  id   Int     @id @default(autoincrement())
  text String
  done Boolean @default(false)
}
```

Ce modèle correspond à une version simplifiée de la table `taches` — juste un texte et un état fait/pas fait — suffisant pour l'application de base.

---

## Pattern Repository

Le code suit le **pattern Repository** : toutes les requêtes Prisma sont isolées dans un fichier dédié. `main.ts` ne contient aucune requête SQL directe.

```
src/
├── main.ts                    ← fenêtre + IPC handlers (aucune requête Prisma)
└── repository/
    └── todo.repository.ts     ← toutes les requêtes Prisma
```

`main.ts` appelle simplement :
```typescript
ipcMain.handle('get-todos',   ()                => db.getTodos());
ipcMain.handle('add-todo',    (_e, text: string) => db.addTodo(text));
ipcMain.handle('toggle-todo', (_e, id: number)   => db.toggleTodo(id));
ipcMain.handle('delete-todo', (_e, id: number)   => db.deleteTodo(id));
```

---

## Point important — `DATABASE_URL` dans Electron

Prisma lit normalement `DATABASE_URL` depuis `.env`. Mais après compilation, `main.js` se trouve dans `dist/` — le chemin relatif ne pointe plus au bon endroit.

**Solution :** définir la variable **programmatiquement** dans `main.ts`, avant l'import de PrismaClient :

```typescript
// DOIT être avant l'import de PrismaClient
process.env['DATABASE_URL'] = 'file:' + path.join(__dirname, '..', 'prisma', 'todo.db');

import * as db from './repository/todo.repository';
```

`__dirname` vaut `dist/` après compilation → `..` remonte à la racine du projet, puis `prisma/` où se trouve `todo.db`.

Le fichier `.env` reste utile pour les outils CLI (`prisma migrate`, `prisma studio`) qui s'exécutent depuis la racine.

---

## Installation et démarrage

### Prérequis

- Node.js >= 18
- npm
- Angular CLI : `npm install -g @angular/cli`

### 1. Installer les dépendances Electron

```bash
npm install
```

### 2. Installer les dépendances Angular

```bash
cd renderer/app
npm install
cd ../..
```

### 3. Créer la base de données et générer le client Prisma

```bash
npm run prisma:migrate
```

Cette commande :
1. Lit `prisma/schema.prisma`
2. Génère le SQL de migration dans `prisma/migrations/`
3. Crée le fichier `todo.db` dans le dossier `prisma/`
4. Génère le Prisma Client TypeScript dans `node_modules/@prisma/client`

### 4. Lancer l'application

```bash
npm run start
```

Cette commande enchaîne :
1. `tsc` → compile `src/main.ts` et `src/preload.ts` vers `dist/`
2. `ng build` → compile Angular vers `renderer/app/dist/`
3. `npx electron .` → lance l'application

---

## Scripts disponibles

| Script | Commande | Description |
|---|---|---|
| `npm run start` | build complet + electron | Compiler tout et lancer |
| `npm run start:dev` | `npx electron .` | Lancer sans recompiler (si déjà compilé) |
| `npm run build` | electron + angular | Build complet sans lancer |
| `npm run build:electron` | `tsc` | Compiler uniquement le Main Process |
| `npm run build:angular` | `ng build` | Compiler uniquement Angular |
| `npm run prisma:migrate` | `prisma migrate dev` | Créer/appliquer les migrations |
| `npm run prisma:generate` | `prisma generate` | Régénérer le client TypeScript |
| `npm run prisma:studio` | `prisma studio` | Interface visuelle de `todo.db` |

---

## Vérifier la persistance

Après avoir ajouté des tâches et relancé l'application :

1. Ouvrir `todo.db` dans VS Code (extension **SQLite Viewer**)
2. La table `Todo` doit contenir les tâches ajoutées
3. Fermer et relancer → les tâches sont toujours présentes

Ou via Prisma Studio :
```bash
npm run prisma:studio
# Ouvre http://localhost:5555
```

---

## Technologies utilisées

| Technologie | Rôle |
|---|---|
| **Electron** | Fenêtre native desktop, Main Process |
| **Angular** | Interface utilisateur (Renderer) |
| **Prisma** | ORM — accès à SQLite avec typage TypeScript |
| **SQLite** | Base de données locale dans un fichier `.db` |
| **TypeScript** | Langage principal (Main + Renderer) |
| **IPC** | Communication sécurisée entre Main et Renderer |
