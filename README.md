# FacteurCar

Application desktop Electron + Angular + Prisma pour gérer une flotte de véhicules utilisée par des facteurs.

Le projet stocke toutes les données en local dans SQLite via Prisma. Il ne dépend d'aucun service cloud.

## Fonctionnalités

- Gestion des facteurs : liste, ajout, modification, suppression.
- Gestion des véhicules : liste avec type, ajout, modification, suppression.
- Gestion des tournées : association d'un facteur et d'un véhicule sur une période.
- Affichage des dégâts liés aux tournées.
- Statistiques d'accueil calculées avec Prisma `count()`.

## Prérequis

- Node.js 18 ou plus récent.
- npm.

L'Angular CLI globale n'est pas obligatoire : le script de build utilise le CLI installé dans `renderer/app`.

## Installation

Depuis la racine du projet :

```bash
npm install
npm run install:renderer
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

La commande `npm run prisma:migrate` crée ou met à jour la base SQLite locale. La commande `npm run prisma:seed` insère des données de test.

Sur Windows, fermez l'application Electron avant `npm run prisma:generate` si Prisma indique qu'il ne peut pas remplacer un fichier dans `node_modules/.prisma/client`.

## Lancement

```bash
npm run start
```

Cette commande :

1. compile le processus principal Electron ;
2. compile l'application Angular ;
3. lance Electron.

## Lancement avec Docker Compose

La seconde session demande un lancement portable. Le projet contient donc une image Docker et un fichier Compose.

```bash
docker compose up --build
```

Docker Desktop doit être démarré avant d'exécuter cette commande.

Quand le conteneur est lancé, ouvrez :

```text
http://localhost:6080/vnc.html
```

L'application Electron s'affiche dans le navigateur via noVNC. Aucun serveur Angular sur `localhost:4200` n'est utilisé : Angular est buildé dans `renderer/app/dist/app/browser/`, puis Electron charge `index.html` avec `loadFile`.

Fichiers concernés :

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `docker/entrypoint.sh`

## Scripts utiles

| Script | Rôle |
|---|---|
| `npm run start` | Build complet puis lancement Electron |
| `npm run start:dev` | Lance Electron sans rebuild |
| `npm run build` | Compile Electron et Angular |
| `npm run build:electron` | Compile seulement `src/main.ts` et `src/preload.ts` |
| `npm run build:angular` | Compile seulement le renderer Angular |
| `npm run install:renderer` | Installe les dépendances Angular |
| `npm run prisma:migrate` | Applique les migrations Prisma |
| `npm run prisma:generate` | Génère le client Prisma |
| `npm run prisma:seed` | Peuple la base avec des données de test |
| `npm run prisma:studio` | Ouvre Prisma Studio |

## Architecture

```text
facteur-car/
├── src/
│   ├── main.ts                    # Processus principal Electron + handlers IPC
│   ├── preload.ts                 # contextBridge exposant window.api
│   └── repository/repository.ts   # Requêtes Prisma centralisées
├── renderer/app/                  # Application Angular standalone
├── shared/database.ts             # Types partagés entre Electron et Angular
├── prisma/
│   ├── schema.prisma              # Modèle relationnel
│   ├── seed.js                    # Données de test
│   └── migrations/                # Migrations SQLite
└── docs/
    ├── documentation-application.md
    └── schema-base-donnees.drawio
```

Flux d'un appel :

```text
Angular -> Service Angular -> window.api -> preload.ts -> main.ts -> repository Prisma -> SQLite
```

## Base de données

La base utilise SQLite avec Prisma :

- fichier local : `prisma/facteur_car.db` ;
- configuration : `.env` avec `DATABASE_URL="file:./facteur_car.db"` ;
- schéma : `prisma/schema.prisma` ;
- schéma visuel éditable : `docs/schema-base-donnees.drawio`.

Le modèle contient les tables `type`, `facteur`, `vehicule`, `conduire`, `degat`, `type_intervention`, `intervention`, `type_piece_justificative`, `piece_justificative` et `subir`.

La table `subir` est une table de jonction N:M entre `vehicule` et `intervention`.

## Notions demandées couvertes

### Angular

- composants standalone ;
- routing avec `app.routes.ts`, `routerLink` et `<router-outlet>` ;
- services injectés avec `providedIn: 'root'` ;
- `signal()` pour l'état local ;
- `computed()` pour les valeurs dérivées ;
- `@if` et `@for` dans les templates ;
- `input.required()` et `output()` dans `VehiculeLigne` ;
- formulaire réactif dans `VehiculeComponent`.

### Prisma / SGBD

- plus de 7 modèles Prisma ;
- clés primaires et clés étrangères ;
- relations 1:N ;
- table de jonction N:M explicite ;
- règles `onDelete` explicites ;
- lectures avec `include` ;
- agrégats avec `count()` affichés sur l'accueil ;
- CRUD via le repository Prisma.

## Documentation

- Documentation applicative : `docs/documentation-application.md`
- Schéma de base de données éditable : `docs/schema-base-donnees.drawio`
- Ancien export image conservé : `schéma base de données.png`
