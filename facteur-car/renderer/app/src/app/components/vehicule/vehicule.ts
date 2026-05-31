import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import type { Vehicule as VehiculeType } from '../../../../types/electron';
import { Vehicule as VehiculeService } from '../../services/vehicule';

@Component({
  selector: 'app-vehicule',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vehicule.html',
  styleUrl: './vehicule.css',
})
export class VehiculeComponent implements OnInit {
  private vehiculeService = inject(VehiculeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  vehicule: VehiculeType | null = null;

  modeModification = false;
  loading = false;
  errorMessage = '';

  formVehicule = {
    matricule: '',
    nombrePorte: '',
    numChassis: '',
    idType: '',
  };

  async ngOnInit(): Promise<void> {
    const matricule = this.route.snapshot.paramMap.get('matricule');

    if (matricule) {
      this.modeModification = true;

      const vehiculeDepuisNavigation = history.state.vehicule as
        | VehiculeType
        | undefined;

      if (
        vehiculeDepuisNavigation &&
        vehiculeDepuisNavigation.matricule
      ) {
        this.vehicule = vehiculeDepuisNavigation;
        this.remplirFormulaire(vehiculeDepuisNavigation);
      } else {
        await this.chargerVehiculeDepuisListe(matricule);
      }
    }
  }

  async chargerVehiculeDepuisListe(matricule: string): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const vehicules = await this.vehiculeService.getVehicules();

      const vehiculeTrouve = vehicules.find(
        (vehicule: VehiculeType) => vehicule.matricule === matricule
      );

      if (!vehiculeTrouve) {
        this.errorMessage = 'Véhicule introuvable.';
        return;
      }

      this.vehicule = vehiculeTrouve;
      this.remplirFormulaire(vehiculeTrouve);
    } catch (error) {
      console.error('Erreur chargement véhicule :', error);
      this.errorMessage = 'Impossible de charger le véhicule.';
    } finally {
      this.loading = false;
    }
  }

  async enregistrerVehicule(): Promise<void> {
    this.errorMessage = '';

    const data = {
      matricule: this.formVehicule.matricule,
      nombrePorte: this.formVehicule.nombrePorte,
      numChassis: this.formVehicule.numChassis,
      idType: Number(this.formVehicule.idType),
    };

    try {
      if (this.modeModification && this.vehicule) {
        await this.vehiculeService.updateVehicule(
          this.vehicule.matricule,
          data
        );
      } else {
        await this.vehiculeService.addVehicule(data);
      }

      await this.router.navigate(['/vehicules']);
    } catch (error) {
      console.error('Erreur enregistrement véhicule :', error);

      this.errorMessage = this.modeModification
        ? 'Impossible de modifier le véhicule.'
        : 'Impossible d’ajouter le véhicule.';
    }
  }

  remplirFormulaire(vehicule: VehiculeType): void {
    this.formVehicule = {
      matricule: vehicule.matricule,
      nombrePorte: vehicule.nombrePorte,
      numChassis: vehicule.numChassis,
      idType: String(vehicule.idType),
    };
  }
}
