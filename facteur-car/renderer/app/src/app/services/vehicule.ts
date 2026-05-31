import { inject, Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
@Injectable({
  providedIn: 'root',
})
export class Vehicule {
  electronService = inject(ElectronService);
  getVehicules() {
    return this.electronService.getApi().getVehicules();
  }

  getVehiculesAvecType() {
    return this.electronService.getApi().getVehiculesAvecType();
  }
  getVehiculeById(matricule: string) {
    return this.electronService.getApi().getVehiculeById(matricule);
  }

  addVehicule(data: any) {
    return this.electronService.getApi().addVehicule(data);
  }

  updateVehicule(matricule: string, data: any) {
    return this.electronService.getApi().updateVehicule(matricule, data);
  }

  deleteVehicule(matricule: string) {
    return this.electronService.getApi().deleteVehicule(matricule);
  }
}
