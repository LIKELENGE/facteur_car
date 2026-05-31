import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

// DATABASE_URL AVANT l'import de PrismaClient
process.env['DATABASE_URL'] =
    'file:' + path.join(__dirname, '..', '..', 'prisma', 'facteur_car.db');

import * as db from './repository/repository';

// ─── Fenêtre ───────────────────────────────────────────────────

function createWindow(): void {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });

    win.loadFile(
        path.join(__dirname, '..', '..', 'renderer/app/dist/app/browser/index.html')
    );
}

app.whenReady().then(async () => {
    createWindow();
});

app.on('before-quit', async () => {
    await db.closeDb();
});

// ─── Helpers ───────────────────────────────────────────────────

function toDate(value: string | Date): Date {
    return value instanceof Date ? value : new Date(value);
}

// ─── IPC : Types véhicules ─────────────────────────────────────

ipcMain.handle('get-types', () => db.getTypes());

ipcMain.handle('add-type', (_e, nomType: string) => {
    return db.addType(nomType);
});

ipcMain.handle('update-type', (_e, idType: number, nomType: string) => {
    return db.updateType(idType, nomType);
});

ipcMain.handle('delete-type', (_e, idType: number) => {
    return db.deleteType(idType);
});

// ─── IPC : Facteurs ────────────────────────────────────────────

ipcMain.handle('get-facteurs', () => db.getFacteurs());

ipcMain.handle('get-facteur-by-id', (_e, idFacteur: number) => {
    return db.getFacteurById(idFacteur);
});

ipcMain.handle('add-facteur', (_e, data) => {
    return db.addFacteur({
        nom: data.nom,
        prenom: data.prenom,
        dateNaiss: toDate(data.dateNaiss),
        telephone: data.telephone,
        mail: data.mail,
        dateObtentionPermisB: toDate(data.dateObtentionPermisB),
        sexe: data.sexe,
    });
});

ipcMain.handle('update-facteur', (_e, idFacteur: number, data) => {
    return db.updateFacteur(idFacteur, {
        ...data,
        dateNaiss: data.dateNaiss ? toDate(data.dateNaiss) : undefined,
        dateObtentionPermisB: data.dateObtentionPermisB
            ? toDate(data.dateObtentionPermisB)
            : undefined,
    });
});

ipcMain.handle('delete-facteur', (_e, idFacteur: number) => {
    return db.deleteFacteur(idFacteur);
});

// ─── IPC : Dégâts ──────────────────────────────────────────────

ipcMain.handle('get-degats', () => db.getDegats());

ipcMain.handle('get-degat-by-id', (_e, idDegat: number) => {
    return db.getDegatById(idDegat);
});

ipcMain.handle('add-degat', (_e, data) => {
    return db.addDegat({
        description: data.description,
        dateConstat: toDate(data.dateConstat),
        lienImage: data.lienImage,
    });
});

ipcMain.handle('update-degat', (_e, idDegat: number, data) => {
    return db.updateDegat(idDegat, {
        ...data,
        dateConstat: data.dateConstat ? toDate(data.dateConstat) : undefined,
    });
});

ipcMain.handle('delete-degat', (_e, idDegat: number) => {
    return db.deleteDegat(idDegat);
});

// ─── IPC : Types d'intervention ────────────────────────────────

ipcMain.handle('get-types-intervention', () => db.getTypesIntervention());

ipcMain.handle('add-type-intervention', (_e, libelle: string) => {
    return db.addTypeIntervention(libelle);
});

ipcMain.handle(
    'update-type-intervention',
    (_e, idTypeIntervention: number, libelle: string) => {
        return db.updateTypeIntervention(idTypeIntervention, libelle);
    }
);

ipcMain.handle('delete-type-intervention', (_e, idTypeIntervention: number) => {
    return db.deleteTypeIntervention(idTypeIntervention);
});

// ─── IPC : Types de pièces justificatives ──────────────────────

ipcMain.handle('get-types-piece-justificative', () => {
    return db.getTypesPieceJustificative();
});

ipcMain.handle('add-type-piece-justificative', (_e, libelle: string) => {
    return db.addTypePieceJustificative(libelle);
});

ipcMain.handle(
    'update-type-piece-justificative',
    (_e, idTypePieceJustificative: number, libelle: string) => {
        return db.updateTypePieceJustificative(idTypePieceJustificative, libelle);
    }
);

ipcMain.handle(
    'delete-type-piece-justificative',
    (_e, idTypePieceJustificative: number) => {
        return db.deleteTypePieceJustificative(idTypePieceJustificative);
    }
);

// ─── IPC : Véhicules ───────────────────────────────────────────

ipcMain.handle('get-vehicules', () => db.getVehicules());

ipcMain.handle('get-vehicules-avec-type', () => {
    return db.getVehiculesAvecType();
});

ipcMain.handle('get-vehicule-by-matricule', (_e, matricule: string) => {
    return db.getVehiculeByMatricule(matricule);
});

ipcMain.handle('add-vehicule', (_e, data) => {
    return db.addVehicule({
        matricule: data.matricule,
        nombrePorte: data.nombrePorte,
        numChassis: data.numChassis,
        idType: data.idType,
    });
});

ipcMain.handle('update-vehicule', (_e, matricule: string, data) => {
    return db.updateVehicule(matricule, data);
});

ipcMain.handle('delete-vehicule', (_e, matricule: string) => {
    return db.deleteVehicule(matricule);
});

// ─── IPC : Interventions ───────────────────────────────────────

ipcMain.handle('get-interventions', () => db.getInterventions());

ipcMain.handle('get-interventions-completes', () => {
    return db.getInterventionsCompletes();
});

ipcMain.handle('get-intervention-by-id', (_e, idIntervention: number) => {
    return db.getInterventionById(idIntervention);
});

ipcMain.handle('add-intervention', (_e, data) => {
    return db.addIntervention({
        heureDebut: toDate(data.heureDebut),
        heureFin: toDate(data.heureFin),
        fraisIntervention: data.fraisIntervention,
        idTypeIntervention: data.idTypeIntervention,
        idFacteur: data.idFacteur,
    });
});

ipcMain.handle('update-intervention', (_e, idIntervention: number, data) => {
    return db.updateIntervention(idIntervention, {
        ...data,
        heureDebut: data.heureDebut ? toDate(data.heureDebut) : undefined,
        heureFin: data.heureFin ? toDate(data.heureFin) : undefined,
    });
});

ipcMain.handle('delete-intervention', (_e, idIntervention: number) => {
    return db.deleteIntervention(idIntervention);
});

ipcMain.handle(
    'add-intervention-avec-vehicule',
    (_e, interventionData, matricule: string) => {
        return db.addInterventionAvecVehicule(
            {
                heureDebut: toDate(interventionData.heureDebut),
                heureFin: toDate(interventionData.heureFin),
                fraisIntervention: interventionData.fraisIntervention,
                idTypeIntervention: interventionData.idTypeIntervention,
                idFacteur: interventionData.idFacteur,
            },
            matricule
        );
    }
);

// ─── IPC : Pièces justificatives ───────────────────────────────

ipcMain.handle('get-pieces-justificatives', () => {
    return db.getPiecesJustificatives();
});

ipcMain.handle(
    'get-piece-justificative-by-id',
    (_e, idPieceJustificative: number) => {
        return db.getPieceJustificativeById(idPieceJustificative);
    }
);

ipcMain.handle('add-piece-justificative', (_e, data) => {
    return db.addPieceJustificative({
        lien: data.lien,
        idTypePieceJustificative: data.idTypePieceJustificative ?? null,
        idIntervention: data.idIntervention,
    });
});

ipcMain.handle(
    'update-piece-justificative',
    (_e, idPieceJustificative: number, data) => {
        return db.updatePieceJustificative(idPieceJustificative, data);
    }
);

ipcMain.handle(
    'delete-piece-justificative',
    (_e, idPieceJustificative: number) => {
        return db.deletePieceJustificative(idPieceJustificative);
    }
);

// ─── IPC : Conduire ────────────────────────────────────────────

ipcMain.handle('get-conduites', () => db.getConduites());

ipcMain.handle('add-conduire', (_e, data) => {
    return db.addConduire({
        matricule: data.matricule,
        idFacteur: data.idFacteur,
        idDegat: data.idDegat,
        dateDebut: toDate(data.dateDebut),
        dateFin: toDate(data.dateFin),
    });
});

ipcMain.handle(
    'update-conduire-dates',
    (
        _e,
        matricule: string,
        idFacteur: number,
        idDegat: number,
        dateDebut: string | Date,
        dateFin: string | Date
    ) => {
        return db.updateConduireDates(
            matricule,
            idFacteur,
            idDegat,
            toDate(dateDebut),
            toDate(dateFin)
        );
    }
);

ipcMain.handle(
    'delete-conduire',
    (_e, matricule: string, idFacteur: number, idDegat: number) => {
        return db.deleteConduire(matricule, idFacteur, idDegat);
    }
);

// ─── IPC : Subir ───────────────────────────────────────────────

ipcMain.handle('get-subirs', () => db.getSubirs());

ipcMain.handle('add-subir', (_e, data) => {
    return db.addSubir({
        matricule: data.matricule,
        idIntervention: data.idIntervention,
    });
});

ipcMain.handle(
    'delete-subir',
    (_e, matricule: string, idIntervention: number) => {
        return db.deleteSubir(matricule, idIntervention);
    }
);

// ─── IPC : Lectures complètes ──────────────────────────────────

ipcMain.handle('get-facteurs-complets', () => {
    return db.getFacteursComplets();
});