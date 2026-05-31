import { Injectable } from '@angular/core';
import { Facteur } from '../../../types/electron';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})
export class FacteurService {

  constructor(private electronService: ElectronService) { }

  // Lecture
  getFacteurs(): Promise<Facteur[]> {
    return this.electronService.getApi().getFacteurs();
  }

  // Lecture par ID
  getFacteurById(id: number): Promise<Facteur> {
    return this.electronService.getApi().getFacteurById(id);
  }

  // Création
  addFacteur(data: Partial<Facteur>): Promise<Facteur> {
    return this.electronService.getApi().addFacteur(data);
  }

  // Modification
  updateFacteur(id: number, data: Partial<Facteur>): Promise<Facteur> {
    return this.electronService.getApi().updateFacteur(id, data);
  }

  // Suppression
  deleteFacteur(id: number): Promise<void> {
    return this.electronService.getApi().deleteFacteur(id);
  }
}
