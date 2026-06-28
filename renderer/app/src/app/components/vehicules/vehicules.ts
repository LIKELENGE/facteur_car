import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { VehiculeAvecType } from '../../../../types/electron';
import { VehiculeLigne } from '../vehicule-ligne/vehicule-ligne';
import { Vehicule as VehiculeService } from '../../services/vehicule';

@Component({
  selector: 'app-vehicules',
  standalone: true,
  imports: [CommonModule, RouterLink, VehiculeLigne],
  templateUrl: './vehicules.html',
  styleUrl: './vehicules.css',
})
export class Vehicules implements OnInit {
  private vehiculeService = inject(VehiculeService);

  vehicules = signal<VehiculeAvecType[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  nombreVehicules = computed(() => this.vehicules().length);

  ngOnInit(): void {
    void this.loadVehicules();
  }

  async loadVehicules(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const data = await this.vehiculeService.getVehiculesAvecType();
      this.vehicules.set(data);
    } catch (error) {
      console.error('Erreur chargement véhicules :', error);

      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('Not running in Electron environment')) {
        this.errorMessage.set(
          "L'application doit être lancée via Electron : exécutez `npm run start` depuis le dossier `facteur-car`."
        );
      } else {
        this.errorMessage.set('Impossible de charger les véhicules.');
      }
    } finally {
      this.loading.set(false);
    }
  }

  async deleteVehicule(matricule: string): Promise<void> {
    if (!confirm('Voulez-vous vraiment supprimer ce véhicule ?')) {
      return;
    }

    try {
      await this.vehiculeService.deleteVehicule(matricule);

      this.vehicules.update(vehicules =>
        vehicules.filter(vehicule => vehicule.matricule !== matricule)
      );
    } catch (error) {
      console.error('Erreur suppression véhicule :', error);

      this.errorMessage.set(
        'Impossible de supprimer le véhicule. Il est peut-être lié à une conduite ou une intervention.'
      );
    }
  }
}
