import { Routes } from '@angular/router';

import { Facteurs } from './components/facteurs/facteurs';
import { FacteurComponent } from './components/facteur/facteur';
import { Vehicules } from './components/vehicules/vehicules';
import { VehiculeComponent } from './components/vehicule/vehicule';
import { Tournee } from './components/tournee/tournee';
import { Tournees } from './components/tournees/tournees';
import { Accueil } from './components/accueil/accueil';

export const routes: Routes = [
  {
    path: '',
    component: Accueil,
  },
  {
    path: 'facteurs',
    component: Facteurs,
  },
  {
    path: 'facteur/ajouter',
    component: FacteurComponent,
  },
  {
    path: 'facteur/modifier/:id',
    component: FacteurComponent,
  },
  {
    path: 'vehicules',
    component: Vehicules,
  },
  {
    path: 'vehicule/ajouter',
    component: VehiculeComponent,
  },
  {
    path: 'vehicule/modifier/:matricule',
    component: VehiculeComponent,
  },
  {
    path:'tournee/ajouter',
    component: Tournee,
  },
  {
    path:'tournee/modifier/:id',
    component: Tournee,
  },
  {
    path:'tournees',
    component: Tournees,
  }
];
