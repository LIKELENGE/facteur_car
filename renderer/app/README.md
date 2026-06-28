# Facteur Car

**Facteur Car** est une application de bureau de gestion de parc automobile développée avec **Angular**, **Electron**, **Prisma**, **SQLite** et **Bootstrap**.

L’application permet de gérer les **facteurs**, les **véhicules**, les **tournées**, les **dégâts**, les **interventions** et les **pièces justificatives** liées aux véhicules.

---

## Présentation de l’application

Facteur Car a pour objectif de faciliter le suivi de l’utilisation des véhicules par les facteurs.

Elle permet de savoir :

- quels facteurs sont enregistrés ;
- quels véhicules sont disponibles dans le parc automobile ;
- quel facteur utilise quel véhicule ;
- à quelle période un véhicule est utilisé ;
- quels dégâts ont été constatés pendant une tournée ;
- quelles interventions ont été réalisées sur un véhicule ;
- quelles pièces justificatives sont associées aux interventions.

Dans cette application, une **tournée** correspond à une conduite.

Autrement dit :

```txt
Une tournée = un facteur + un véhicule + une date de début + une date de fin
```

La tournée est représentée dans la base de données par le modèle `Conduire`.

---

## Fonctionnalités principales

### Page d’accueil

La page d’accueil permet d’accéder rapidement aux différentes parties de l’application :

- liste des facteurs ;
- liste des véhicules ;
- création d’une tournée ;
- liste des tournées.

---

### Gestion des facteurs

L’application permet de :

- afficher la liste des facteurs ;
- ajouter un facteur ;
- modifier un facteur ;
- supprimer un facteur.

Un facteur contient les informations suivantes :

- nom ;
- prénom ;
- date de naissance ;
- téléphone ;
- adresse email ;
- date d’obtention du permis B ;
- sexe.

---

### Gestion des véhicules

L’application permet de :

- afficher la liste des véhicules ;
- ajouter un véhicule ;
- modifier un véhicule ;
- supprimer un véhicule ;
- afficher le type du véhicule.

Un véhicule contient les informations suivantes :

- matricule ;
- nombre de portes ;
- numéro de châssis ;
- type de véhicule.

Le champ `matricule` est l’identifiant principal d’un véhicule.

---

### Gestion des tournées

L’application permet de :

- créer une tournée ;
- choisir un facteur ;
- choisir un véhicule ;
- définir une date de début ;
- définir une date de fin ;
- afficher la liste des tournées ;
- modifier les dates d’une tournée ;
- supprimer une tournée.

Une tournée est enregistrée dans la table `conduire`.

---

### Gestion des dégâts

Une tournée peut avoir plusieurs dégâts.

Exemple :

```txt
Tournée 1
├── Dégât 1 : Pare-chocs avant endommagé
├── Dégât 2 : Rétroviseur gauche cassé
└── Dégât 3 : Rayure sur la portière droite
```

Un dégât appartient à une seule tournée.

La relation est donc :

```txt
Conduire 1 ---- plusieurs Degat
Degat 1 ---- une seule Conduire
```

---

### Gestion des interventions

L’application permet de gérer les interventions effectuées sur les véhicules.

Une intervention peut correspondre à :

- une réparation mécanique ;
- une réparation de carrosserie ;
- un entretien général ;
- un remplacement de pièce.

Une intervention est liée à :

- un type d’intervention ;
- un facteur ;
- un ou plusieurs véhicules via la table `Subir` ;
- des pièces justificatives.

---

## Technologies utilisées

Le projet utilise les technologies suivantes :

- **Angular** : interface utilisateur ;
- **Electron** : création de l’application de bureau ;
- **TypeScript** : langage principal ;
- **Prisma** : ORM pour communiquer avec la base de données ;
- **SQLite** : base de données locale ;
- **Bootstrap** : design de l’interface ;
- **Node.js** : environnement d’exécution ;
- **npm** : gestionnaire de dépendances.

---

## Prérequis

Avant de lancer l’application, il faut installer :

- Node.js ;
- npm ;
- Git.

Pour vérifier que ces outils sont installés, utilisez les commandes suivantes :

```bash
node -v
npm -v
git --version
```

Si chaque commande affiche une version, l’environnement est prêt.

---

## Installation après téléchargement depuis GitHub

Cloner le projet depuis GitHub :

```bash
git clone https://github.com/votre-utilisateur/facteur-car.git
```

Entrer dans le dossier du projet :

```bash
cd facteur-car
```

Installer les dépendances :

```bash
npm install
```

---

## Configuration de la base de données

L’application utilise une base de données SQLite avec Prisma.

Créer un fichier `.env` à la racine du projet si celui-ci n’existe pas encore.

Contenu du fichier `.env` :

```env
DATABASE_URL="file:./prisma/facteur_car.db"
```

Générer le client Prisma :

```bash
npx prisma generate
```

Appliquer les migrations :

```bash
npx prisma migrate dev
```

Ajouter les données de test :

```bash
npx prisma db seed
```

---

## Lancement de l’application

Pour lancer l’application :

```bash
npm start
```

L’application doit être lancée avec Electron.

Il ne faut pas lancer uniquement Angular avec :

```bash
ng serve
```

Certaines fonctionnalités dépendent d’Electron, notamment l’accès à la base de données via le fichier `preload.ts`.

---

## Routes principales de l’application

Les routes utilisées dans l’application sont :

```txt
/                           Page d’accueil

/facteurs                   Liste des facteurs
/facteur/ajouter            Ajouter un facteur
/facteur/modifier/:id       Modifier un facteur

/vehicules                  Liste des véhicules
/vehicule/ajouter           Ajouter un véhicule
/vehicule/modifier/:matricule
                            Modifier un véhicule

/tournees                   Liste des tournées
/tournee/ajouter            Ajouter une tournée
/tournee/modifier/:id       Modifier une tournée
```

---

# Schéma de base de données

La base de données contient plusieurs tables liées entre elles.

Les principaux modèles sont :

- `Type`
- `Vehicule`
- `Facteur`
- `Conduire`
- `Degat`
- `Intervention`
- `TypeIntervention`
- `PieceJustificative`
- `TypePieceJustificative`
- `Subir`

---

## Modèle `Type`

Le modèle `Type` représente le type d’un véhicule.

Exemples :

- voiture ;
- camionnette ;
- moto ;
- camion.

Champs :

```txt
idType
nomType
```

Relation :

```txt
Un Type possède plusieurs Vehicules.
Un Vehicule appartient à un Type.
```

Exemple :

```txt
Type 1 : Voiture
Type 2 : Camionnette
```

---

## Modèle `Vehicule`

Le modèle `Vehicule` représente un véhicule du parc automobile.

Champs :

```txt
matricule
nombrePorte
numChassis
idType
```

Le champ `matricule` est la clé primaire.

Relation :

```txt
Un Vehicule appartient à un Type.
Un Vehicule peut être utilisé dans plusieurs tournées.
Un Vehicule peut subir plusieurs interventions.
```

Exemple :

```txt
matricule : ABC-001
nombrePorte : 4
numChassis : CHS-0001
idType : 1
```

---

## Modèle `Facteur`

Le modèle `Facteur` représente un facteur ou conducteur.

Champs :

```txt
idFacteur
nom
prenom
dateNaiss
telephone
mail
dateObtentionPermisB
sexe
```

Relation :

```txt
Un Facteur peut avoir plusieurs tournées.
Un Facteur peut être lié à plusieurs interventions.
```

Exemple :

```txt
idFacteur : 1
nom : Kalala
prenom : Moïse
telephone : +243810000001
```

---

## Modèle `Conduire`

Le modèle `Conduire` représente une tournée.

Champs :

```txt
idConduire
matricule
idFacteur
dateDebut
dateFin
```

Relation :

```txt
Une tournée appartient à un Vehicule.
Une tournée appartient à un Facteur.
Une tournée peut avoir plusieurs Degats.
```

Cela signifie qu’une tournée est créée lorsqu’un facteur utilise un véhicule pendant une période donnée.

Exemple :

```txt
idConduire : 1
matricule : ABC-001
idFacteur : 1
dateDebut : 2025-01-10
dateFin : 2025-01-12
```

---

## Modèle `Degat`

Le modèle `Degat` représente un dégât constaté pendant une tournée.

Champs :

```txt
idDegat
description
dateConstat
lienImage
idConduire
```

Relation :

```txt
Un Degat appartient à une seule tournée.
Une tournée peut avoir plusieurs Degats.
```

Exemple :

```txt
idDegat : 1
description : Pare-chocs avant endommagé
dateConstat : 2025-01-12
lienImage : images/degats/pare-chocs.jpg
idConduire : 1
```

---

## Modèle `TypeIntervention`

Le modèle `TypeIntervention` représente le type d’intervention effectué.

Exemples :

- réparation mécanique ;
- réparation carrosserie ;
- entretien général ;
- remplacement de pièce.

Champs :

```txt
idTypeIntervention
libelle
```

Relation :

```txt
Un TypeIntervention peut être utilisé par plusieurs Interventions.
Une Intervention appartient à un TypeIntervention.
```

---

## Modèle `Intervention`

Le modèle `Intervention` représente une intervention ou une réparation.

Champs :

```txt
idIntervention
heureDebut
heureFin
fraisIntervention
idTypeIntervention
idFacteur
```

Relation :

```txt
Une Intervention appartient à un TypeIntervention.
Une Intervention est liée à un Facteur.
Une Intervention peut être associée à plusieurs Vehicules via Subir.
Une Intervention peut avoir plusieurs PiecesJustificatives.
```

Exemple :

```txt
idIntervention : 1
heureDebut : 2025-01-13 08:00
heureFin : 2025-01-13 11:30
fraisIntervention : 150.50
idTypeIntervention : 2
idFacteur : 1
```

---

## Modèle `Subir`

Le modèle `Subir` est une table de liaison entre `Vehicule` et `Intervention`.

Champs :

```txt
matricule
idIntervention
```

Relation :

```txt
Un Vehicule peut subir plusieurs Interventions.
Une Intervention peut concerner plusieurs Vehicules.
```

La clé primaire est composée de :

```txt
matricule + idIntervention
```

---

## Modèle `TypePieceJustificative`

Le modèle `TypePieceJustificative` représente le type d’un document justificatif.

Exemples :

- facture ;
- photo ;
- rapport technique ;
- reçu de paiement.

Champs :

```txt
idTypePieceJustificative
libelle
```

Relation :

```txt
Un TypePieceJustificative peut être utilisé par plusieurs PiecesJustificatives.
```

---

## Modèle `PieceJustificative`

Le modèle `PieceJustificative` représente un document lié à une intervention.

Champs :

```txt
idPieceJustificative
lien
idTypePieceJustificative
idIntervention
```

Relation :

```txt
Une PieceJustificative appartient à une Intervention.
Une PieceJustificative peut avoir un TypePieceJustificative.
```

Exemple :

```txt
idPieceJustificative : 1
lien : documents/facture-001.pdf
idTypePieceJustificative : 1
idIntervention : 1
```

---

# Relations principales

Résumé des relations :

```txt
Type 1 ---- plusieurs Vehicule

Facteur 1 ---- plusieurs Conduire
Vehicule 1 ---- plusieurs Conduire

Conduire 1 ---- plusieurs Degat

Facteur 1 ---- plusieurs Intervention
TypeIntervention 1 ---- plusieurs Intervention

Vehicule plusieurs ---- plusieurs Intervention
via Subir

Intervention 1 ---- plusieurs PieceJustificative

TypePieceJustificative 1 ---- plusieurs PieceJustificative
```

---

## Schéma simplifié

```txt
Type
  └── Vehicule
        ├── Conduire
        │     ├── Facteur
        │     └── Degat
        │
        └── Subir
              └── Intervention
                    ├── Facteur
                    ├── TypeIntervention
                    └── PieceJustificative
                          └── TypePieceJustificative
```

---

# Architecture de l’application

L’application suit cette logique :

```txt
Angular
  ↓
Service Angular
  ↓
Electron preload
  ↓
ipcRenderer.invoke(...)
  ↓
ipcMain.handle(...)
  ↓
Repository
  ↓
Prisma
  ↓
SQLite
```

Exemple pour afficher les véhicules :

```txt
Composant Vehicules
  ↓
VehiculeService.getVehiculesAvecType()
  ↓
window.api.getVehiculesAvecType()
  ↓
ipcRenderer.invoke('get-vehicules-avec-type')
  ↓
ipcMain.handle('get-vehicules-avec-type')
  ↓
db.getVehiculesAvecType()
  ↓
prisma.vehicule.findMany({ include: { type: true } })
  ↓
Base SQLite
```

---

# Logique d’enregistrement

## Ajouter un facteur

L’utilisateur remplit le formulaire d’ajout.

Les données sont envoyées vers :

```txt
Angular -> Service Facteur -> Electron -> Repository -> Prisma -> SQLite
```

---

## Ajouter un véhicule

L’utilisateur remplit :

```txt
matricule
nombrePorte
numChassis
idType
```

Le véhicule est enregistré avec le matricule comme identifiant.

---

## Ajouter une tournée

L’utilisateur choisit :

- un facteur ;
- un véhicule ;
- une date de début ;
- une date de fin.

Les données envoyées sont :

```ts
{
  matricule: string,
  idFacteur: number,
  dateDebut: Date,
  dateFin: Date
}
```

Ces données créent une ligne dans la table `conduire`.

---

## Modifier une tournée

La modification d’une tournée se fait avec `idConduire`.

La logique actuelle modifie les dates :

```ts
updateConduireDates(idConduire, dateDebut, dateFin)
```

---

## Supprimer une tournée

La suppression se fait avec :

```ts
deleteConduire(idConduire)
```

Si la tournée contient des dégâts, ceux-ci doivent être supprimés avant la tournée ou dans une transaction.

---

# Commandes utiles

Installer les dépendances :

```bash
npm install
```

Générer Prisma :

```bash
npx prisma generate
```

Créer ou appliquer une migration :

```bash
npx prisma migrate dev
```

Lancer le seed :

```bash
npx prisma db seed
```

Réinitialiser la base de données :

```bash
npx prisma migrate reset
```

Lancer l’application :

```bash
npm start
```

---

# Après modification du schéma Prisma

Après chaque modification de `schema.prisma`, il faut exécuter :

```bash
npx prisma generate
```

Si la structure de la base change, exécuter aussi :

```bash
npx prisma migrate dev
```

Puis relancer l’application :

```bash
npm start
```

---

# Problèmes fréquents

## Erreur : Not running in Electron environment

Cette erreur signifie que l’application n’a pas été lancée avec Electron.

Solution :

```bash
npm start
```

Ne pas lancer uniquement :

```bash
ng serve
```

---

## Les données ne s’affichent pas

Vérifier que Prisma est généré :

```bash
npx prisma generate
```

Vérifier que les migrations sont appliquées :

```bash
npx prisma migrate dev
```

Vérifier que les données de test sont présentes :

```bash
npx prisma db seed
```

---

## Erreur avec `idConduire`

Si TypeScript indique que `idConduire` n’existe pas, Prisma utilise probablement encore l’ancien modèle.

Solution :

```bash
npx prisma generate
```

Puis redémarrer l’éditeur ou le serveur TypeScript.

---

## Erreur avec `ngModel`

Si Angular affiche une erreur avec `ngModel`, il faut importer `FormsModule`.

Exemple :

```ts
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
})
```

---

## Erreur avec `routerLink`

Si Angular ne reconnaît pas `routerLink`, il faut importer `RouterLink`.

Exemple :

```ts
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
})
```

---

# Structure du projet

```txt
facteur-car/
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── facteur_car.db
│
├── src/
│   ├── main/
│   │   ├── main.ts
│   │   ├── preload.ts
│   │   └── repository/
│   │       └── repository.ts
│   │
│   ├── shared/
│   │   └── database.ts
│   │
│   └── renderer/
│       └── app/
│           └── src/
│               └── app/
│                   ├── components/
│                   │   ├── accueil/
│                   │   ├── facteurs/
│                   │   ├── facteur/
│                   │   ├── vehicules/
│                   │   ├── vehicule/
│                   │   ├── tournees/
│                   │   └── tournee/
│                   │
│                   ├── services/
│                   │   ├── facteur.ts
│                   │   ├── vehicule.ts
│                   │   ├── tournee.ts
│                   │   └── electron.service.ts
│                   │
│                   └── app.routes.ts
```

---

# Git

Il est conseillé d’ignorer les fichiers suivants dans `.gitignore` :

```gitignore
node_modules/
dist/
.angular/
.env
*.db
*.db-journal
coverage/
.vscode/
.idea/
```

Le fichier `package-lock.json` peut être gardé dans Git afin que les autres utilisateurs installent exactement les mêmes versions de dépendances.

---

# Auteur

Projet réalisé dans le cadre du cours de SGBD.

Nom du projet : **Facteur Car**
