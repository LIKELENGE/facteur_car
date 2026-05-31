const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Début du seed...')

  // Suppression dans le bon ordre à cause des relations
  await prisma.pieceJustificative.deleteMany()
  await prisma.subir.deleteMany()
  await prisma.conduire.deleteMany()
  await prisma.intervention.deleteMany()
  await prisma.vehicule.deleteMany()
  await prisma.facteur.deleteMany()
  await prisma.degat.deleteMany()
  await prisma.typeIntervention.deleteMany()
  await prisma.typePieceJustificative.deleteMany()
  await prisma.type.deleteMany()

  // Types de véhicules
  await prisma.type.createMany({
    data: [
      { idType: 1, nomType: 'Voiture' },
      { idType: 2, nomType: 'Camionnette' },
      { idType: 3, nomType: 'Moto' },
      { idType: 4, nomType: 'Camion' }
    ]
  })

  // Facteurs / conducteurs
  await prisma.facteur.createMany({
    data: [
      {
        idFacteur: 1,
        nom: 'Kalala',
        prenom: 'Moïse',
        dateNaiss: new Date('1998-04-12'),
        telephone: '+243810000001',
        mail: 'moise.kalala@example.com',
        dateObtentionPermisB: new Date('2018-06-10'),
        sexe: 'M'
      },
      {
        idFacteur: 2,
        nom: 'Mbuyi',
        prenom: 'Sarah',
        dateNaiss: new Date('1999-09-22'),
        telephone: '+243810000002',
        mail: 'sarah.mbuyi@example.com',
        dateObtentionPermisB: new Date('2019-03-15'),
        sexe: 'F'
      },
      {
        idFacteur: 3,
        nom: 'Ilunga',
        prenom: 'Daniel',
        dateNaiss: new Date('1995-01-30'),
        telephone: '+243810000003',
        mail: 'daniel.ilunga@example.com',
        dateObtentionPermisB: new Date('2016-11-20'),
        sexe: 'M'
      },
      {
        idFacteur: 4,
        nom: 'Kabongo',
        prenom: 'Grace',
        dateNaiss: new Date('2000-07-18'),
        telephone: '+243810000004',
        mail: 'grace.kabongo@example.com',
        dateObtentionPermisB: new Date('2021-02-05'),
        sexe: 'F'
      }
    ]
  })

  // Dégâts
  await prisma.degat.createMany({
    data: [
      {
        idDegat: 1,
        description: 'Pare-chocs avant endommagé',
        dateConstat: new Date('2025-01-12T09:30:00'),
        lienImage: 'images/degats/pare-chocs.jpg'
      },
      {
        idDegat: 2,
        description: 'Rétroviseur gauche cassé',
        dateConstat: new Date('2025-01-20T14:15:00'),
        lienImage: 'images/degats/retro-gauche.jpg'
      },
      {
        idDegat: 3,
        description: 'Pneu arrière crevé',
        dateConstat: new Date('2025-02-03T08:45:00'),
        lienImage: 'images/degats/pneu-arriere.jpg'
      },
      {
        idDegat: 4,
        description: 'Rayure sur la portière droite',
        dateConstat: new Date('2025-02-18T11:00:00'),
        lienImage: 'images/degats/rayure-portiere.jpg'
      }
    ]
  })

  // Types d'intervention
  await prisma.typeIntervention.createMany({
    data: [
      { idTypeIntervention: 1, libelle: 'Réparation mécanique' },
      { idTypeIntervention: 2, libelle: 'Réparation carrosserie' },
      { idTypeIntervention: 3, libelle: 'Entretien général' },
      { idTypeIntervention: 4, libelle: 'Remplacement pièce' }
    ]
  })

  // Types de pièces justificatives
  await prisma.typePieceJustificative.createMany({
    data: [
      { idTypePieceJustificative: 1, libelle: 'Facture' },
      { idTypePieceJustificative: 2, libelle: 'Photo' },
      { idTypePieceJustificative: 3, libelle: 'Rapport technique' },
      { idTypePieceJustificative: 4, libelle: 'Reçu de paiement' }
    ]
  })

  // Véhicules
  await prisma.vehicule.createMany({
    data: [
      {
        matricule: 'ABC-001',
        nombrePorte: '4',
        numChassis: 'CHS-0001',
        idType: 1
      },
      {
        matricule: 'ABC-002',
        nombrePorte: '5',
        numChassis: 'CHS-0002',
        idType: 2
      },
      {
        matricule: 'ABC-003',
        nombrePorte: '0',
        numChassis: 'CHS-0003',
        idType: 3
      },
      {
        matricule: 'ABC-004',
        nombrePorte: '2',
        numChassis: 'CHS-0004',
        idType: 4
      },
      {
        matricule: 'ABC-005',
        nombrePorte: '4',
        numChassis: 'CHS-0005',
        idType: 1
      }
    ]
  })

  // Interventions
  await prisma.intervention.createMany({
    data: [
      {
        idIntervention: 1,
        heureDebut: new Date('2025-01-13T08:00:00'),
        heureFin: new Date('2025-01-13T11:30:00'),
        fraisIntervention: '150.50',
        idTypeIntervention: 2,
        idFacteur: 1
      },
      {
        idIntervention: 2,
        heureDebut: new Date('2025-01-21T09:00:00'),
        heureFin: new Date('2025-01-21T10:30:00'),
        fraisIntervention: '75.00',
        idTypeIntervention: 4,
        idFacteur: 2
      },
      {
        idIntervention: 3,
        heureDebut: new Date('2025-02-04T10:00:00'),
        heureFin: new Date('2025-02-04T12:00:00'),
        fraisIntervention: '45.25',
        idTypeIntervention: 3,
        idFacteur: 3
      },
      {
        idIntervention: 4,
        heureDebut: new Date('2025-02-19T13:00:00'),
        heureFin: new Date('2025-02-19T16:00:00'),
        fraisIntervention: '200.00',
        idTypeIntervention: 1,
        idFacteur: 4
      }
    ]
  })

  // Pièces justificatives
  await prisma.pieceJustificative.createMany({
    data: [
      {
        idPieceJustificative: 1,
        lien: 'documents/facture-001.pdf',
        idTypePieceJustificative: 1,
        idIntervention: 1
      },
      {
        idPieceJustificative: 2,
        lien: 'documents/photo-degat-001.jpg',
        idTypePieceJustificative: 2,
        idIntervention: 1
      },
      {
        idPieceJustificative: 3,
        lien: 'documents/rapport-002.pdf',
        idTypePieceJustificative: 3,
        idIntervention: 2
      },
      {
        idPieceJustificative: 4,
        lien: 'documents/recu-003.pdf',
        idTypePieceJustificative: 4,
        idIntervention: 3
      },
      {
        idPieceJustificative: 5,
        lien: 'documents/facture-004.pdf',
        idTypePieceJustificative: 1,
        idIntervention: 4
      }
    ]
  })

  // Conduire
  await prisma.conduire.createMany({
    data: [
      {
        matricule: 'ABC-001',
        idFacteur: 1,
        idDegat: 1,
        dateDebut: new Date('2025-01-10T07:30:00'),
        dateFin: new Date('2025-01-12T18:00:00')
      },
      {
        matricule: 'ABC-002',
        idFacteur: 2,
        idDegat: 2,
        dateDebut: new Date('2025-01-18T08:00:00'),
        dateFin: new Date('2025-01-20T17:30:00')
      },
      {
        matricule: 'ABC-003',
        idFacteur: 3,
        idDegat: 3,
        dateDebut: new Date('2025-02-01T09:00:00'),
        dateFin: new Date('2025-02-03T15:00:00')
      },
      {
        matricule: 'ABC-005',
        idFacteur: 4,
        idDegat: 4,
        dateDebut: new Date('2025-02-15T10:00:00'),
        dateFin: new Date('2025-02-18T16:45:00')
      }
    ]
  })

  // Subir : véhicules concernés par les interventions
  await prisma.subir.createMany({
    data: [
      {
        matricule: 'ABC-001',
        idIntervention: 1
      },
      {
        matricule: 'ABC-002',
        idIntervention: 2
      },
      {
        matricule: 'ABC-003',
        idIntervention: 3
      },
      {
        matricule: 'ABC-005',
        idIntervention: 4
      }
    ]
  })

  console.log('Seed terminé avec succès.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })