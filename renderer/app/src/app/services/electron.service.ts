import { Injectable } from '@angular/core';
import type { ElectronAPI } from '../../../types/electron';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  isElectron(): boolean {
    return !!window.api;
  }

  getApi(): ElectronAPI {
    const api = window.api;

    if (!api) {
      throw new Error(
        'Not running in Electron environment. Start the app via Electron (run npm run start from facteur-car) instead of the browser dev server.'
      );
    }

    return api;
  }
}
