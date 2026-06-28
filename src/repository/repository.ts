import { PrismaClient } from '@prisma/client';
import type {
    Type,
    Facteur,
    Degat,
    TypeIntervention,
    TypePieceJustificative,
    Vehicule,
    Intervention,
    PieceJustificative,
    Conduire,
    Subir,
    Prisma,
} from '@prisma/client';
import type { StatistiquesAccueil } from '../../shared/database';

export type {
    Type,
    Facteur,
    Degat,
    TypeIntervention,
    TypePieceJustificative,
    Vehicule,
    Intervention,
    PieceJustificative,
    Conduire,
    Subir,
};

const prisma = new PrismaClient();

// ─── Types véhicules ───────────────────────────────────────────

export async function getTypes(): Promise<Type[]> {
    return prisma.type.findMany({
        orderBy: { idType: 'asc' },
    });
}

export async function addType(nomType: string): Promise<Type> {
    return prisma.type.create({
        data: { nomType },
    });
}

export async function updateType(idType: number, nomType: string): Promise<Type> {
    return prisma.type.update({
        where: { idType },
        data: { nomType },
    });
}

export async function deleteType(idType: number): Promise<void> {
    await prisma.type.delete({
        where: { idType },
    });
}

// ─── Facteurs ──────────────────────────────────────────────────

export type CreateFacteurData = {
    nom: string;
    prenom: string;
    dateNaiss: Date;
    telephone: string;
    mail: string;
    dateObtentionPermisB: Date;
    sexe: string;
};

export async function getFacteurs(): Promise<Facteur[]> {
    return prisma.facteur.findMany({
        orderBy: { idFacteur: 'asc' },
    });
}

export async function getFacteurById(idFacteur: number): Promise<Facteur | null> {
    return prisma.facteur.findUnique({
        where: { idFacteur },
    });
}

export async function addFacteur(data: CreateFacteurData): Promise<Facteur> {
    return prisma.facteur.create({
        data,
    });
}

export async function updateFacteur(
    idFacteur: number,
    data: Partial<CreateFacteurData>
): Promise<Facteur> {
    return prisma.facteur.update({
        where: { idFacteur },
        data,
    });
}

export async function deleteFacteur(idFacteur: number): Promise<void> {
    await prisma.facteur.delete({
        where: { idFacteur },
    });
}

// ─── Dégâts ────────────────────────────────────────────────────

export type CreateDegatData = {
    description: string;
    dateConstat: Date;
    lienImage: string;
    idConduire: number;
};

export async function getDegats(): Promise<Degat[]> {
    return prisma.degat.findMany({
        orderBy: { idDegat: 'asc' },
    });
}

export async function getDegatById(idDegat: number): Promise<Degat | null> {
    return prisma.degat.findUnique({
        where: { idDegat },
    });
}

export async function addDegat(data: CreateDegatData): Promise<Degat> {
    return prisma.degat.create({
        data,
    });
}

export async function updateDegat(
    idDegat: number,
    data: Partial<CreateDegatData>
): Promise<Degat> {
    return prisma.degat.update({
        where: { idDegat },
        data,
    });
}

export async function deleteDegat(idDegat: number): Promise<void> {
    await prisma.degat.delete({
        where: { idDegat },
    });
}

// ─── Types d'intervention ──────────────────────────────────────

export async function getTypesIntervention(): Promise<TypeIntervention[]> {
    return prisma.typeIntervention.findMany({
        orderBy: { idTypeIntervention: 'asc' },
    });
}

export async function addTypeIntervention(
    libelle: string
): Promise<TypeIntervention> {
    return prisma.typeIntervention.create({
        data: { libelle },
    });
}

export async function updateTypeIntervention(
    idTypeIntervention: number,
    libelle: string
): Promise<TypeIntervention> {
    return prisma.typeIntervention.update({
        where: { idTypeIntervention },
        data: { libelle },
    });
}

export async function deleteTypeIntervention(
    idTypeIntervention: number
): Promise<void> {
    await prisma.typeIntervention.delete({
        where: { idTypeIntervention },
    });
}

// ─── Types de pièces justificatives ────────────────────────────

export async function getTypesPieceJustificative(): Promise<TypePieceJustificative[]> {
    return prisma.typePieceJustificative.findMany({
        orderBy: { idTypePieceJustificative: 'asc' },
    });
}

export async function addTypePieceJustificative(
    libelle: string
): Promise<TypePieceJustificative> {
    return prisma.typePieceJustificative.create({
        data: { libelle },
    });
}

export async function updateTypePieceJustificative(
    idTypePieceJustificative: number,
    libelle: string
): Promise<TypePieceJustificative> {
    return prisma.typePieceJustificative.update({
        where: { idTypePieceJustificative },
        data: { libelle },
    });
}

export async function deleteTypePieceJustificative(
    idTypePieceJustificative: number
): Promise<void> {
    await prisma.typePieceJustificative.delete({
        where: { idTypePieceJustificative },
    });
}

// ─── Véhicules ─────────────────────────────────────────────────

export type CreateVehiculeData = {
    matricule: string;
    nombrePorte: string;
    numChassis: string;
    idType: number;
};

export async function getVehicules(): Promise<Vehicule[]> {
    return prisma.vehicule.findMany({
        orderBy: { matricule: 'asc' },
    });
}

export async function getVehiculeByMatricule(
    matricule: string
): Promise<Vehicule | null> {
    return prisma.vehicule.findUnique({
        where: { matricule },
    });
}

export async function addVehicule(data: CreateVehiculeData): Promise<Vehicule> {
    return prisma.vehicule.create({
        data,
    });
}

export async function updateVehicule(
    matricule: string,
    data: Partial<Omit<CreateVehiculeData, 'matricule'>>
): Promise<Vehicule> {
    return prisma.vehicule.update({
        where: { matricule },
        data,
    });
}

export async function deleteVehicule(matricule: string): Promise<void> {
    await prisma.vehicule.delete({
        where: { matricule },
    });
}

// ─── Interventions ─────────────────────────────────────────────

export type CreateInterventionData = {
    heureDebut: Date;
    heureFin: Date;
    fraisIntervention: Prisma.Decimal | number | string;
    idTypeIntervention: number;
    idFacteur: number;
};

export async function getInterventions(): Promise<Intervention[]> {
    return prisma.intervention.findMany({
        orderBy: { idIntervention: 'asc' },
    });
}

export async function getInterventionById(
    idIntervention: number
): Promise<Intervention | null> {
    return prisma.intervention.findUnique({
        where: { idIntervention },
    });
}

export async function addIntervention(
    data: CreateInterventionData
): Promise<Intervention> {
    return prisma.intervention.create({
        data,
    });
}

export async function updateIntervention(
    idIntervention: number,
    data: Partial<CreateInterventionData>
): Promise<Intervention> {
    return prisma.intervention.update({
        where: { idIntervention },
        data,
    });
}

export async function deleteIntervention(idIntervention: number): Promise<void> {
    await prisma.intervention.delete({
        where: { idIntervention },
    });
}

// ─── Pièces justificatives ─────────────────────────────────────

export type CreatePieceJustificativeData = {
    lien: string;
    idTypePieceJustificative?: number | null;
    idIntervention: number;
};

export async function getPiecesJustificatives(): Promise<PieceJustificative[]> {
    return prisma.pieceJustificative.findMany({
        orderBy: { idPieceJustificative: 'asc' },
    });
}

export async function getPieceJustificativeById(
    idPieceJustificative: number
): Promise<PieceJustificative | null> {
    return prisma.pieceJustificative.findUnique({
        where: { idPieceJustificative },
    });
}

export async function addPieceJustificative(
    data: CreatePieceJustificativeData
): Promise<PieceJustificative> {
    return prisma.pieceJustificative.create({
        data,
    });
}

export async function updatePieceJustificative(
    idPieceJustificative: number,
    data: Partial<CreatePieceJustificativeData>
): Promise<PieceJustificative> {
    return prisma.pieceJustificative.update({
        where: { idPieceJustificative },
        data,
    });
}

export async function deletePieceJustificative(
    idPieceJustificative: number
): Promise<void> {
    await prisma.pieceJustificative.delete({
        where: { idPieceJustificative },
    });
}

// ─── Conduire ──────────────────────────────────────────────────
// Une conduite appartient à un véhicule et à un facteur.
// Une conduite peut avoir plusieurs dégâts.

export type CreateConduireData = {
    matricule: string;
    idFacteur: number;
    dateDebut: Date;
    dateFin: Date;
};

export async function getConduites(): Promise<Conduire[]> {
    return prisma.conduire.findMany({
        orderBy: { idConduire: 'asc' },
    });
}

export async function getConduireById(
    idConduire: number
): Promise<Conduire | null> {
    return prisma.conduire.findUnique({
        where: { idConduire },
    });
}

export async function getConduitesCompletes() {
    return prisma.conduire.findMany({
        include: {
            vehicule: {
                include: {
                    type: true,
                },
            },
            facteur: true,
            degats: true,
        },
        orderBy: { idConduire: 'asc' },
    });
}

export async function addConduire(
    data: CreateConduireData
): Promise<Conduire> {
    return prisma.conduire.create({
        data,
    });
}

export async function updateConduireDates(
    idConduire: number,
    dateDebut: Date,
    dateFin: Date
): Promise<Conduire> {
    return prisma.conduire.update({
        where: { idConduire },
        data: {
            dateDebut,
            dateFin,
        },
    });
}

export async function deleteConduire(idConduire: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
        await tx.degat.deleteMany({
            where: { idConduire },
        });

        await tx.conduire.delete({
            where: { idConduire },
        });
    });
}

// ─── Subir ─────────────────────────────────────────────────────
// Table de liaison entre véhicule et intervention.
// Clé primaire composée : matricule + idIntervention

export type CreateSubirData = {
    matricule: string;
    idIntervention: number;
};

export async function getSubirs(): Promise<Subir[]> {
    return prisma.subir.findMany({
        orderBy: [
            { matricule: 'asc' },
            { idIntervention: 'asc' },
        ],
    });
}

export async function addSubir(data: CreateSubirData): Promise<Subir> {
    return prisma.subir.create({
        data,
    });
}

export async function deleteSubir(
    matricule: string,
    idIntervention: number
): Promise<void> {
    await prisma.subir.delete({
        where: {
            matricule_idIntervention: {
                matricule,
                idIntervention,
            },
        },
    });
}

// ─── Lectures avec relations ───────────────────────────────────

export async function getVehiculesAvecType() {
    return prisma.vehicule.findMany({
        include: {
            type: true,
        },
        orderBy: { matricule: 'asc' },
    });
}

export async function getInterventionsCompletes() {
    return prisma.intervention.findMany({
        include: {
            typeIntervention: true,
            facteur: true,
            piecesJustificatives: true,
            subirs: {
                include: {
                    vehicule: {
                        include: {
                            type: true,
                        },
                    },
                },
            },
        },
        orderBy: { idIntervention: 'asc' },
    });
}

export async function getFacteursComplets() {
    return prisma.facteur.findMany({
        include: {
            interventions: true,
            conduites: {
                include: {
                    vehicule: {
                        include: {
                            type: true,
                        },
                    },
                    degats: true,
                },
            },
        },
        orderBy: { idFacteur: 'asc' },
    });
}

export async function getStatistiquesAccueil(): Promise<StatistiquesAccueil> {
    const [
        nombreFacteurs,
        nombreVehicules,
        nombreTournees,
        nombreDegats,
    ] = await prisma.$transaction([
        prisma.facteur.count(),
        prisma.vehicule.count(),
        prisma.conduire.count(),
        prisma.degat.count(),
    ]);

    return {
        nombreFacteurs,
        nombreVehicules,
        nombreTournees,
        nombreDegats,
    };
}

// ─── Exemple de transaction ────────────────────────────────────
//
// Créer une intervention puis l'associer directement à un véhicule.
// Si une étape échoue, rien n'est enregistré.

export async function addInterventionAvecVehicule(
    interventionData: CreateInterventionData,
    matricule: string
): Promise<Intervention> {
    return prisma.$transaction(async (tx) => {
        const intervention = await tx.intervention.create({
            data: interventionData,
        });

        await tx.subir.create({
            data: {
                matricule,
                idIntervention: intervention.idIntervention,
            },
        });

        return intervention;
    });
}

// ─── Fermer la connexion ───────────────────────────────────────

export async function closeDb(): Promise<void> {
    await prisma.$disconnect();
}
