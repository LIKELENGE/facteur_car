// src/shared/global.d.ts

import type { ElectronAPI } from './database.js';

declare global {
    interface Window {
        api: ElectronAPI;
    }
}

export {};