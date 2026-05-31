// src/shared/database.ts

export type DateInput = string | Date;
export type DecimalInput = string | number;

export interface Type {
  idType: number;
  nomType: string;
}

export interface Facteur {
  idFacteur: number;
  nom: string;
  prenom: string;
  dateNaiss: DateInput;
  telephone: string;
  mail: string;
  dateObtentionPermisB: DateInput;
  sexe: string;
}

export interface Conduire {
  idConduire: number;
  matricule: string;
  idFacteur: number;
  dateDebut: DateInput;
  dateFin: DateInput;
}

export interface Degat {
  idDegat: number;
  description: string;
  dateConstat: DateInput;
  lienImage: string;
  idConduire: number;
}

export interface TypeIntervention {
  idTypeIntervention: number;
  libelle: string;
}

export interface TypePieceJustificative {
  idTypePieceJustificative: number;
  libelle: string;
}

export interface Vehicule {
  matricule: string;
  nombrePorte: string;
  numChassis: string;
  idType: number;
}

export interface VehiculeAvecType extends Vehicule {
  type: Type;
}

export interface Intervention {
  idIntervention: number;
  heureDebut: DateInput;
  heureFin: DateInput;
  fraisIntervention: DecimalInput;
  idTypeIntervention: number;
  idFacteur: number;
}

export interface PieceJustificative {
  idPieceJustificative: number;
  lien: string;
  idTypePieceJustificative: number | null;
  idIntervention: number;
}

export interface Subir {
  matricule: string;
  idIntervention: number;
}

export interface ConduireComplete extends Conduire {
  facteur: Facteur;
  vehicule: Vehicule;
  degats: Degat[];
}

export type CreateFacteurData = Omit<Facteur, 'idFacteur'>;

export type CreateConduireData = Omit<Conduire, 'idConduire'>;

export type CreateDegatData = Omit<Degat, 'idDegat'>;

export type CreateVehiculeData = Vehicule;

export type CreateInterventionData = Omit<Intervention, 'idIntervention'>;

export type CreatePieceJustificativeData = Omit<
  PieceJustificative,
  'idPieceJustificative'
>;

export type CreateSubirData = Subir;

export interface ElectronAPI {
  getTypes: () => Promise<Type[]>;
  addType: (nomType: string) => Promise<Type>;
  updateType: (idType: number, nomType: string) => Promise<Type>;
  deleteType: (idType: number) => Promise<void>;

  getFacteurs: () => Promise<Facteur[]>;
  getFacteurById: (idFacteur: number) => Promise<Facteur | null>;
  addFacteur: (data: CreateFacteurData) => Promise<Facteur>;
  updateFacteur: (
    idFacteur: number,
    data: Partial<CreateFacteurData>
  ) => Promise<Facteur>;
  deleteFacteur: (idFacteur: number) => Promise<void>;

  getVehicules: () => Promise<Vehicule[]>;
  getVehiculesAvecType: () => Promise<VehiculeAvecType[]>;
  getVehiculeByMatricule: (
    matricule: string
  ) => Promise<Vehicule | null>;
  addVehicule: (data: CreateVehiculeData) => Promise<Vehicule>;
  updateVehicule: (
    matricule: string,
    data: Partial<Omit<CreateVehiculeData, 'matricule'>>
  ) => Promise<Vehicule>;
  deleteVehicule: (matricule: string) => Promise<void>;

  getConduites: () => Promise<Conduire[]>;
  getConduitesCompletes: () => Promise<ConduireComplete[]>;
  getConduireById: (idConduire: number) => Promise<Conduire | null>;
  addConduire: (data: CreateConduireData) => Promise<Conduire>;
  updateConduireDates: (
    idConduire: number,
    dateDebut: DateInput,
    dateFin: DateInput
  ) => Promise<Conduire>;
  deleteConduire: (idConduire: number) => Promise<void>;

  getDegats: () => Promise<Degat[]>;
  getDegatById: (idDegat: number) => Promise<Degat | null>;
  addDegat: (data: CreateDegatData) => Promise<Degat>;
  updateDegat: (
    idDegat: number,
    data: Partial<CreateDegatData>
  ) => Promise<Degat>;
  deleteDegat: (idDegat: number) => Promise<void>;

  getTypesIntervention: () => Promise<TypeIntervention[]>;
  addTypeIntervention: (libelle: string) => Promise<TypeIntervention>;
  updateTypeIntervention: (
    idTypeIntervention: number,
    libelle: string
  ) => Promise<TypeIntervention>;
  deleteTypeIntervention: (idTypeIntervention: number) => Promise<void>;

  getTypesPieceJustificative: () => Promise<TypePieceJustificative[]>;
  addTypePieceJustificative: (
    libelle: string
  ) => Promise<TypePieceJustificative>;
  updateTypePieceJustificative: (
    idTypePieceJustificative: number,
    libelle: string
  ) => Promise<TypePieceJustificative>;
  deleteTypePieceJustificative: (
    idTypePieceJustificative: number
  ) => Promise<void>;

  getInterventions: () => Promise<Intervention[]>;
  getInterventionsCompletes: () => Promise<any[]>;
  getInterventionById: (
    idIntervention: number
  ) => Promise<Intervention | null>;
  addIntervention: (
    data: CreateInterventionData
  ) => Promise<Intervention>;
  updateIntervention: (
    idIntervention: number,
    data: Partial<CreateInterventionData>
  ) => Promise<Intervention>;
  deleteIntervention: (idIntervention: number) => Promise<void>;
  addInterventionAvecVehicule: (
    interventionData: CreateInterventionData,
    matricule: string
  ) => Promise<Intervention>;

  getPiecesJustificatives: () => Promise<PieceJustificative[]>;
  getPieceJustificativeById: (
    idPieceJustificative: number
  ) => Promise<PieceJustificative | null>;
  addPieceJustificative: (
    data: CreatePieceJustificativeData
  ) => Promise<PieceJustificative>;
  updatePieceJustificative: (
    idPieceJustificative: number,
    data: Partial<CreatePieceJustificativeData>
  ) => Promise<PieceJustificative>;
  deletePieceJustificative: (
    idPieceJustificative: number
  ) => Promise<void>;

  getSubirs: () => Promise<Subir[]>;
  addSubir: (data: CreateSubirData) => Promise<Subir>;
  deleteSubir: (
    matricule: string,
    idIntervention: number
  ) => Promise<void>;

  getFacteursComplets: () => Promise<any[]>;
}