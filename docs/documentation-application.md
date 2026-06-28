# Documentation application - FacteurCar

## Objectif

FacteurCar est une application desktop Electron permettant de gérer une petite flotte de véhicules utilisée par des facteurs.

L'application couvre trois modules principaux :

- gestion des facteurs ;
- gestion des véhicules et de leur type ;
- gestion des tournées, c'est-à-dire l'association d'un facteur avec un véhicule sur une période.

La base SQLite est manipulée avec Prisma. Le renderer Angular ne contacte jamais directement la base : il passe par l'API exposée par `preload.ts`.

## Architecture

```text
src/main.ts                    Processus principal Electron
src/preload.ts                 Pont sécurisé contextBridge
src/repository/repository.ts   Accès Prisma centralisé
shared/database.ts             Types partagés IPC / Angular
renderer/app/src/app           Application Angular standalone
prisma/schema.prisma           Modèle relationnel Prisma
prisma/seed.js                 Données de test
docs/schema-base-donnees.drawio Schéma éditable de la base
```

Flux d'un appel :

```text
Composant Angular
  -> Service Angular
  -> window.api exposé par preload.ts
  -> ipcMain.handle dans main.ts
  -> repository Prisma
  -> SQLite local
```

## Fonctionnalités

### Facteurs

- afficher la liste des facteurs ;
- ajouter un facteur ;
- modifier un facteur ;
- supprimer un facteur si les contraintes relationnelles le permettent.

### Véhicules

- afficher la liste des véhicules avec leur type via `include` Prisma ;
- ajouter un véhicule avec formulaire réactif Angular ;
- modifier un véhicule ;
- supprimer un véhicule si aucune relation bloquante ne l'empêche.

### Tournées

- créer une tournée en choisissant un facteur et un véhicule ;
- modifier les dates de début et de fin ;
- afficher les tournées avec facteur, véhicule, type de véhicule et dégâts associés ;
- supprimer une tournée avec suppression des dégâts liés.

### Accueil

La page d'accueil affiche des statistiques calculées côté Prisma :

- nombre de facteurs ;
- nombre de véhicules ;
- nombre de tournées ;
- nombre de dégâts.

Ces statistiques utilisent `prisma.facteur.count()`, `prisma.vehicule.count()`, `prisma.conduire.count()` et `prisma.degat.count()`.

## Modèle de données

Le schéma contient 10 modèles Prisma :

- `Type`
- `Facteur`
- `Vehicule`
- `Conduire`
- `Degat`
- `TypeIntervention`
- `Intervention`
- `TypePieceJustificative`
- `PieceJustificative`
- `Subir`

Relations principales :

- `Type` 1:N `Vehicule`
- `Vehicule` 1:N `Conduire`
- `Facteur` 1:N `Conduire`
- `Conduire` 1:N `Degat`
- `Facteur` 1:N `Intervention`
- `TypeIntervention` 1:N `Intervention`
- `Intervention` 1:N `PieceJustificative`
- `TypePieceJustificative` 1:N `PieceJustificative`
- `Vehicule` N:M `Intervention` via la table de jonction explicite `Subir`

Les règles `onDelete` sont explicites dans `prisma/schema.prisma`.

## Notions Angular démontrées

- composants standalone : `Accueil`, `Vehicules`, `VehiculeComponent`, `Tournees`, etc. ;
- routes Angular : `app.routes.ts` et `<router-outlet>` ;
- navigation avec `routerLink` ;
- services injectés avec DI : `Vehicule`, `FacteurService`, `Tournee`, `StatistiquesService` ;
- singleton via `providedIn: 'root'` ;
- signals : état local dans `Accueil`, `Vehicules`, `VehiculeComponent` ;
- computed : `Accueil.modules` et `Vehicules.nombreVehicules` ;
- `@if` et `@for` dans les templates ;
- `input.required()` et `output()` dans `VehiculeLigne` ;
- formulaire réactif dans `VehiculeComponent`.

## Notions Prisma / SQL démontrées

- tables avec clés primaires ;
- clés étrangères ;
- relation 1:N ;
- table de jonction N:M explicite avec clé primaire composée dans `Subir` ;
- `onDelete` explicites ;
- lecture avec `include` dans `getVehiculesAvecType()` et `getConduitesCompletes()` ;
- agrégats avec `count()` dans `getStatistiquesAccueil()` ;
- CRUD sur plusieurs entités via le repository.

## Données de test

Le fichier `prisma/seed.js` alimente :

- types de véhicules ;
- facteurs ;
- véhicules ;
- interventions ;
- pièces justificatives ;
- conduites ;
- dégâts ;
- liens véhicule/intervention via `subir`.

Commande :

```bash
npm run prisma:seed
```
