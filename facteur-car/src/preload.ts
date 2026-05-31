import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from '../shared/database';

const api: ElectronAPI = {
    // ─── Types véhicules ───────────────────────────────────────

    getTypes: () => ipcRenderer.invoke('get-types'),
    addType: (nomType) => ipcRenderer.invoke('add-type', nomType),
    updateType: (idType, nomType) =>
        ipcRenderer.invoke('update-type', idType, nomType),
    deleteType: (idType) => ipcRenderer.invoke('delete-type', idType),

    // ─── Facteurs ──────────────────────────────────────────────

    getFacteurs: () => ipcRenderer.invoke('get-facteurs'),
    getFacteurById: (idFacteur) =>
        ipcRenderer.invoke('get-facteur-by-id', idFacteur),
    addFacteur: (data) => ipcRenderer.invoke('add-facteur', data),
    updateFacteur: (idFacteur, data) =>
        ipcRenderer.invoke('update-facteur', idFacteur, data),
    deleteFacteur: (idFacteur) =>
        ipcRenderer.invoke('delete-facteur', idFacteur),

    // ─── Dégâts ────────────────────────────────────────────────

    getDegats: () => ipcRenderer.invoke('get-degats'),
    getDegatById: (idDegat) =>
        ipcRenderer.invoke('get-degat-by-id', idDegat),
    addDegat: (data) => ipcRenderer.invoke('add-degat', data),
    updateDegat: (idDegat, data) =>
        ipcRenderer.invoke('update-degat', idDegat, data),
    deleteDegat: (idDegat) =>
        ipcRenderer.invoke('delete-degat', idDegat),

    // ─── Types d'intervention ──────────────────────────────────

    getTypesIntervention: () =>
        ipcRenderer.invoke('get-types-intervention'),
    addTypeIntervention: (libelle) =>
        ipcRenderer.invoke('add-type-intervention', libelle),
    updateTypeIntervention: (idTypeIntervention, libelle) =>
        ipcRenderer.invoke(
            'update-type-intervention',
            idTypeIntervention,
            libelle
        ),
    deleteTypeIntervention: (idTypeIntervention) =>
        ipcRenderer.invoke('delete-type-intervention', idTypeIntervention),

    // ─── Types de pièces justificatives ────────────────────────

    getTypesPieceJustificative: () =>
        ipcRenderer.invoke('get-types-piece-justificative'),
    addTypePieceJustificative: (libelle) =>
        ipcRenderer.invoke('add-type-piece-justificative', libelle),
    updateTypePieceJustificative: (idTypePieceJustificative, libelle) =>
        ipcRenderer.invoke(
            'update-type-piece-justificative',
            idTypePieceJustificative,
            libelle
        ),
    deleteTypePieceJustificative: (idTypePieceJustificative) =>
        ipcRenderer.invoke(
            'delete-type-piece-justificative',
            idTypePieceJustificative
        ),

    // ─── Véhicules ─────────────────────────────────────────────

    getVehicules: () => ipcRenderer.invoke('get-vehicules'),
    getVehiculesAvecType: () =>
        ipcRenderer.invoke('get-vehicules-avec-type'),
    getVehiculeByMatricule: (matricule) =>
        ipcRenderer.invoke('get-vehicule-by-matricule', matricule),
    addVehicule: (data) => ipcRenderer.invoke('add-vehicule', data),
    updateVehicule: (matricule, data) =>
        ipcRenderer.invoke('update-vehicule', matricule, data),
    deleteVehicule: (matricule) =>
        ipcRenderer.invoke('delete-vehicule', matricule),

    // ─── Interventions ─────────────────────────────────────────

    getInterventions: () => ipcRenderer.invoke('get-interventions'),
    getInterventionsCompletes: () =>
        ipcRenderer.invoke('get-interventions-completes'),
    getInterventionById: (idIntervention) =>
        ipcRenderer.invoke('get-intervention-by-id', idIntervention),
    addIntervention: (data) =>
        ipcRenderer.invoke('add-intervention', data),
    updateIntervention: (idIntervention, data) =>
        ipcRenderer.invoke('update-intervention', idIntervention, data),
    deleteIntervention: (idIntervention) =>
        ipcRenderer.invoke('delete-intervention', idIntervention),
    addInterventionAvecVehicule: (interventionData, matricule) =>
        ipcRenderer.invoke(
            'add-intervention-avec-vehicule',
            interventionData,
            matricule
        ),

    // ─── Pièces justificatives ─────────────────────────────────

    getPiecesJustificatives: () =>
        ipcRenderer.invoke('get-pieces-justificatives'),
    getPieceJustificativeById: (idPieceJustificative) =>
        ipcRenderer.invoke(
            'get-piece-justificative-by-id',
            idPieceJustificative
        ),
    addPieceJustificative: (data) =>
        ipcRenderer.invoke('add-piece-justificative', data),
    updatePieceJustificative: (idPieceJustificative, data) =>
        ipcRenderer.invoke(
            'update-piece-justificative',
            idPieceJustificative,
            data
        ),
    deletePieceJustificative: (idPieceJustificative) =>
        ipcRenderer.invoke(
            'delete-piece-justificative',
            idPieceJustificative
        ),

    // ─── Conduire ──────────────────────────────────────────────

    getConduites: () => ipcRenderer.invoke('get-conduites'),
    addConduire: (data) => ipcRenderer.invoke('add-conduire', data),
    updateConduireDates: (
        matricule,
        idFacteur,
        idDegat,
        dateDebut,
        dateFin
    ) =>
        ipcRenderer.invoke(
            'update-conduire-dates',
            matricule,
            idFacteur,
            idDegat,
            dateDebut,
            dateFin
        ),
    deleteConduire: (matricule, idFacteur, idDegat) =>
        ipcRenderer.invoke(
            'delete-conduire',
            matricule,
            idFacteur,
            idDegat
        ),

    // ─── Subir ─────────────────────────────────────────────────

    getSubirs: () => ipcRenderer.invoke('get-subirs'),
    addSubir: (data) => ipcRenderer.invoke('add-subir', data),
    deleteSubir: (matricule, idIntervention) =>
        ipcRenderer.invoke('delete-subir', matricule, idIntervention),

    // ─── Lectures complètes ────────────────────────────────────

    getFacteursComplets: () =>
        ipcRenderer.invoke('get-facteurs-complets'),
};

contextBridge.exposeInMainWorld('api', api);