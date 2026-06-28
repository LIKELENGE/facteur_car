import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { VehiculeAvecType } from '../../../../types/electron';

@Component({
  selector: 'tr[app-vehicule-ligne]',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vehicule-ligne.html',
  styleUrl: './vehicule-ligne.css',
})
export class VehiculeLigne {
  vehicule = input.required<VehiculeAvecType>();
  suppressionDemandee = output<string>();

  demanderSuppression(): void {
    this.suppressionDemandee.emit(this.vehicule().matricule);
  }
}
