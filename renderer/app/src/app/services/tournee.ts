import { inject, Injectable } from '@angular/core';

import type {
  Conduire,
  ConduireComplete,
  CreateConduireData,
} from '../../../types/electron';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})
export class Tournee {
  private electronService = inject(ElectronService);

  getConduites(): Promise<Conduire[]> {
    return this.electronService.getApi().getConduites();
  }

  getConduitesCompletes(): Promise<ConduireComplete[]> {
    return this.electronService.getApi().getConduitesCompletes();
  }

  getConduiteById(id: number): Promise<Conduire | null> {
    return this.electronService.getApi().getConduireById(id);
  }

  addConduire(data: CreateConduireData): Promise<Conduire> {
    return this.electronService.getApi().addConduire(data);
  }

  updateConduireDates(
    id: number,
    dateDebut: string | Date,
    dateFin: string | Date
  ): Promise<Conduire> {
    return this.electronService.getApi().updateConduireDates(
      id,
      dateDebut,
      dateFin
    );
  }

  deleteConduire(id: number): Promise<void> {
    return this.electronService.getApi().deleteConduire(id);
  }
}
