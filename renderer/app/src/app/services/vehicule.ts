import { inject, Injectable } from '@angular/core';

import type {
  CreateVehiculeData,
  Vehicule as VehiculeType,
  VehiculeAvecType,
} from '../../../types/electron';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})
export class Vehicule {
  private electronService = inject(ElectronService);

  getVehicules(): Promise<VehiculeType[]> {
    return this.electronService.getApi().getVehicules();
  }

  getVehiculesAvecType(): Promise<VehiculeAvecType[]> {
    return this.electronService.getApi().getVehiculesAvecType();
  }

  getVehiculeById(matricule: string): Promise<VehiculeType | null> {
    return this.electronService.getApi().getVehiculeByMatricule(matricule);
  }

  addVehicule(data: CreateVehiculeData): Promise<VehiculeType> {
    return this.electronService.getApi().addVehicule(data);
  }

  updateVehicule(
    matricule: string,
    data: Partial<Omit<CreateVehiculeData, 'matricule'>>
  ): Promise<VehiculeType> {
    return this.electronService.getApi().updateVehicule(matricule, data);
  }

  deleteVehicule(matricule: string): Promise<void> {
    return this.electronService.getApi().deleteVehicule(matricule);
  }
}
