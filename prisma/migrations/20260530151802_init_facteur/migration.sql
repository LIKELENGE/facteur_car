-- CreateTable
CREATE TABLE "type" (
    "Id_type" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom_type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "facteur" (
    "Id_facteur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "date_naiss" DATETIME NOT NULL,
    "telephone" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "date_optention_permis_b" DATETIME NOT NULL,
    "sexe" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "degat" (
    "Id_degat" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "date_constat" DATETIME NOT NULL,
    "lien_image" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "type_intervention" (
    "Id_type_intervention" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "type_piece_justificative" (
    "Id_type_piece_justificative" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "vehicule" (
    "matricule" TEXT NOT NULL PRIMARY KEY,
    "nombre_porte" TEXT NOT NULL,
    "num_chassis" TEXT NOT NULL,
    "Id_type" INTEGER NOT NULL,
    CONSTRAINT "vehicule_Id_type_fkey" FOREIGN KEY ("Id_type") REFERENCES "type" ("Id_type") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "intervention" (
    "Id_intervention" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heure_debut" DATETIME NOT NULL,
    "heure_fin" DATETIME NOT NULL,
    "frais_intervention" DECIMAL NOT NULL,
    "Id_type_intervention" INTEGER NOT NULL,
    "Id_facteur" INTEGER NOT NULL,
    CONSTRAINT "intervention_Id_type_intervention_fkey" FOREIGN KEY ("Id_type_intervention") REFERENCES "type_intervention" ("Id_type_intervention") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "intervention_Id_facteur_fkey" FOREIGN KEY ("Id_facteur") REFERENCES "facteur" ("Id_facteur") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "piece_justificative" (
    "Id_piece_justificative" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lien" TEXT NOT NULL,
    "Id_type_piece_justificative" INTEGER,
    "Id_intervention" INTEGER NOT NULL,
    CONSTRAINT "piece_justificative_Id_type_piece_justificative_fkey" FOREIGN KEY ("Id_type_piece_justificative") REFERENCES "type_piece_justificative" ("Id_type_piece_justificative") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "piece_justificative_Id_intervention_fkey" FOREIGN KEY ("Id_intervention") REFERENCES "intervention" ("Id_intervention") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conduire" (
    "matricule" TEXT NOT NULL,
    "Id_facteur" INTEGER NOT NULL,
    "Id_degat" INTEGER NOT NULL,
    "date_debut" DATETIME NOT NULL,
    "date_fin" DATETIME NOT NULL,

    PRIMARY KEY ("matricule", "Id_facteur", "Id_degat"),
    CONSTRAINT "conduire_matricule_fkey" FOREIGN KEY ("matricule") REFERENCES "vehicule" ("matricule") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "conduire_Id_facteur_fkey" FOREIGN KEY ("Id_facteur") REFERENCES "facteur" ("Id_facteur") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "conduire_Id_degat_fkey" FOREIGN KEY ("Id_degat") REFERENCES "degat" ("Id_degat") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subir" (
    "matricule" TEXT NOT NULL,
    "Id_intervention" INTEGER NOT NULL,

    PRIMARY KEY ("matricule", "Id_intervention"),
    CONSTRAINT "subir_matricule_fkey" FOREIGN KEY ("matricule") REFERENCES "vehicule" ("matricule") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "subir_Id_intervention_fkey" FOREIGN KEY ("Id_intervention") REFERENCES "intervention" ("Id_intervention") ON DELETE RESTRICT ON UPDATE CASCADE
);
