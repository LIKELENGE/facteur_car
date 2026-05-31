import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Vehicule as VehiculeService } from '../../services/vehicule';

@Component({
  selector: 'app-vehicules',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicules.html',
  styleUrl: './vehicules.css',
})
export class Vehicules implements OnInit {
  private vehiculeService = inject(VehiculeService);
  private cdr = inject(ChangeDetectorRef);

  vehicules: any[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadVehicules();
  }

  async loadVehicules(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const data = await this.vehiculeService.getVehiculesAvecType();

      console.log('Véhicules avec type reçus :', data);

      this.vehicules = data;
    } catch (error) {
      console.error('Erreur chargement véhicules :', error);

      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('Not running in Electron environment')) {
        this.errorMessage =
          "L'application doit être lancée via Electron : exécutez `npm start` depuis le dossier `facteur-car`.";
      } else {
        this.errorMessage = 'Impossible de charger les véhicules.';
      }
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async deleteVehicule(matricule: string): Promise<void> {
    if (!confirm('Voulez-vous vraiment supprimer ce véhicule ?')) {
      return;
    }

    try {
      await this.vehiculeService.deleteVehicule(matricule);

      this.vehicules = this.vehicules.filter(
        vehicule => vehicule.matricule !== matricule
      );

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erreur suppression véhicule :', error);

      this.errorMessage =
        'Impossible de supprimer le véhicule. Il est peut-être lié à une conduite ou une intervention.';

      this.cdr.detectChanges();
    }
  }
}
