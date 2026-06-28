import { inject, Injectable } from '@angular/core';

import type {
  CreateFacteurData,
  Facteur,
} from '../../../types/electron';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})
export class FacteurService {
  private electronService = inject(ElectronService);

  getFacteurs(): Promise<Facteur[]> {
    return this.electronService.getApi().getFacteurs();
  }

  getFacteurById(id: number): Promise<Facteur | null> {
    return this.electronService.getApi().getFacteurById(id);
  }

  addFacteur(data: CreateFacteurData): Promise<Facteur> {
    return this.electronService.getApi().addFacteur(data);
  }

  updateFacteur(
    id: number,
    data: Partial<CreateFacteurData>
  ): Promise<Facteur> {
    return this.electronService.getApi().updateFacteur(id, data);
  }

  deleteFacteur(id: number): Promise<void> {
    return this.electronService.getApi().deleteFacteur(id);
  }
}
