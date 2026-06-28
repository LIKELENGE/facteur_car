import { inject, Injectable } from '@angular/core';

import type { StatistiquesAccueil } from '../../../types/electron';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})
export class StatistiquesService {
  private electronService = inject(ElectronService);

  getStatistiquesAccueil(): Promise<StatistiquesAccueil> {
    return this.electronService.getApi().getStatistiquesAccueil();
  }
}
