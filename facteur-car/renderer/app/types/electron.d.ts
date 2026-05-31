// Re-export depuis shared/ — source de vérité unique
// Ce fichier évite les chemins relatifs profonds dans les composants Angular
export type {ElectronAPI, Facteur, Vehicule, Conduire } from '../../../../../shared/database';

// Extension de Window — nécessaire pour que Angular reconnaisse window.api
declare global {
    interface Window {
        api?: import('../../../../../shared/database').ElectronAPI;
    }
}
