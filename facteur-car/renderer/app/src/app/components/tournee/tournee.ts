import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import type { Facteur, Vehicule } from '../../../../types/electron';

import { FacteurService } from '../../services/facteur';
import { Vehicule as VehiculeService } from '../../services/vehicule';

@Component({
  selector: 'app-tournee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tournee.html',
  styleUrl: './tournee.css',
})
export class Tournee implements OnInit {
  private facteurService = inject(FacteurService);
  private vehiculeService = inject(VehiculeService);
  private cdr = inject(ChangeDetectorRef);

  facteurs: Facteur[] = [];
  vehicules: Vehicule[] = [];

  facteurSelectionne: Facteur | null = null;
  vehiculeSelectionne: Vehicule | null = null;

  rechercheFacteur = '';
  rechercheVehicule = '';

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const facteurs = await this.facteurService.getFacteurs();
      const vehicules = await this.vehiculeService.getVehicules();

      this.facteurs = facteurs;
      this.vehicules = vehicules;
    } catch (error) {
      console.error('Erreur chargement tournée :', error);

      this.errorMessage =
        'Impossible de charger les facteurs ou les véhicules.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get facteursFiltres(): Facteur[] {
    const recherche = this.rechercheFacteur.toLowerCase().trim();

    if (!recherche) {
      return this.facteurs;
    }

    return this.facteurs.filter(facteur =>
      facteur.nom.toLowerCase().includes(recherche) ||
      facteur.prenom.toLowerCase().includes(recherche) ||
      facteur.telephone.toLowerCase().includes(recherche) ||
      facteur.mail.toLowerCase().includes(recherche)
    );
  }

  get vehiculesFiltres(): Vehicule[] {
    const recherche = this.rechercheVehicule.toLowerCase().trim();

    if (!recherche) {
      return this.vehicules;
    }

    return this.vehicules.filter(vehicule =>
      vehicule.matricule.toLowerCase().includes(recherche) ||
      vehicule.numChassis.toLowerCase().includes(recherche) ||
      String(vehicule.nombrePorte).toLowerCase().includes(recherche) ||
      String(vehicule.idType).toLowerCase().includes(recherche)
    );
  }

  choisirFacteur(facteur: Facteur): void {
    this.facteurSelectionne = facteur;
  }

  choisirVehicule(vehicule: Vehicule): void {
    this.vehiculeSelectionne = vehicule;
  }

  enregistrerTournee(): void {
    if (!this.facteurSelectionne || !this.vehiculeSelectionne) {
      this.errorMessage = 'Veuillez choisir un facteur et un véhicule.';
      return;
    }

    const data = {
      idFacteur: this.facteurSelectionne.idFacteur,
      matricule: this.vehiculeSelectionne.matricule,
    };

    console.log('Tournée à enregistrer :', data);

    // Ici tu appelleras plus tard ton service tournée
    // await this.tourneeService.addTournee(data);
  }
}
