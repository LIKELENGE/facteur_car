import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import type {
  CreateVehiculeData,
  Vehicule as VehiculeType,
} from '../../../../types/electron';
import { Vehicule as VehiculeService } from '../../services/vehicule';

@Component({
  selector: 'app-vehicule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicule.html',
  styleUrl: './vehicule.css',
})
export class VehiculeComponent implements OnInit {
  private vehiculeService = inject(VehiculeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  vehicule = signal<VehiculeType | null>(null);
  loading = signal(false);
  errorMessage = signal('');
  modeModification = false;

  formVehicule = this.fb.nonNullable.group({
    matricule: ['', Validators.required],
    nombrePorte: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    numChassis: ['', Validators.required],
    idType: [1, [Validators.required, Validators.min(1)]],
  });

  async ngOnInit(): Promise<void> {
    const matricule = this.route.snapshot.paramMap.get('matricule');

    if (!matricule) {
      return;
    }

    this.modeModification = true;

    const vehiculeDepuisNavigation = history.state.vehicule as
      | VehiculeType
      | undefined;

    if (vehiculeDepuisNavigation?.matricule) {
      this.vehicule.set(vehiculeDepuisNavigation);
      this.remplirFormulaire(vehiculeDepuisNavigation);
      return;
    }

    await this.chargerVehiculeDepuisListe(matricule);
  }

  async chargerVehiculeDepuisListe(matricule: string): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const vehicules = await this.vehiculeService.getVehicules();
      const vehiculeTrouve = vehicules.find(
        vehicule => vehicule.matricule === matricule
      );

      if (!vehiculeTrouve) {
        this.errorMessage.set('Véhicule introuvable.');
        return;
      }

      this.vehicule.set(vehiculeTrouve);
      this.remplirFormulaire(vehiculeTrouve);
    } catch (error) {
      console.error('Erreur chargement véhicule :', error);
      this.errorMessage.set('Impossible de charger le véhicule.');
    } finally {
      this.loading.set(false);
    }
  }

  async enregistrerVehicule(): Promise<void> {
    this.errorMessage.set('');

    if (this.formVehicule.invalid) {
      this.formVehicule.markAllAsTouched();
      this.errorMessage.set('Veuillez compléter correctement le formulaire.');
      return;
    }

    const valeurFormulaire = this.formVehicule.getRawValue();
    const data: CreateVehiculeData = {
      matricule: String(valeurFormulaire.matricule).trim(),
      nombrePorte: String(valeurFormulaire.nombrePorte).trim(),
      numChassis: String(valeurFormulaire.numChassis).trim(),
      idType: Number(valeurFormulaire.idType),
    };

    try {
      const vehiculeCourant = this.vehicule();

      if (this.modeModification && vehiculeCourant) {
        await this.vehiculeService.updateVehicule(
          vehiculeCourant.matricule,
          {
            nombrePorte: data.nombrePorte,
            numChassis: data.numChassis,
            idType: data.idType,
          }
        );
      } else {
        await this.vehiculeService.addVehicule(data);
      }

      await this.router.navigate(['/vehicules']);
    } catch (error) {
      console.error('Erreur enregistrement véhicule :', error);

      this.errorMessage.set(
        this.modeModification
          ? 'Impossible de modifier le véhicule.'
          : "Impossible d'ajouter le véhicule."
      );
    }
  }

  remplirFormulaire(vehicule: VehiculeType): void {
    this.formVehicule.setValue({
      matricule: vehicule.matricule,
      nombrePorte: vehicule.nombrePorte,
      numChassis: vehicule.numChassis,
      idType: Number(vehicule.idType),
    });
  }
}
