-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_degat" (
    "Id_degat" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "date_constat" DATETIME NOT NULL,
    "lien_image" TEXT NOT NULL,
    "Id_conduire" INTEGER NOT NULL,
    CONSTRAINT "degat_Id_conduire_fkey" FOREIGN KEY ("Id_conduire") REFERENCES "conduire" ("Id_conduire") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_degat" ("Id_conduire", "Id_degat", "date_constat", "description", "lien_image")
SELECT "Id_conduire", "Id_degat", "date_constat", "description", "lien_image" FROM "degat";
DROP TABLE "degat";
ALTER TABLE "new_degat" RENAME TO "degat";

CREATE TABLE "new_piece_justificative" (
    "Id_piece_justificative" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lien" TEXT NOT NULL,
    "Id_type_piece_justificative" INTEGER,
    "Id_intervention" INTEGER NOT NULL,
    CONSTRAINT "piece_justificative_Id_type_piece_justificative_fkey" FOREIGN KEY ("Id_type_piece_justificative") REFERENCES "type_piece_justificative" ("Id_type_piece_justificative") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "piece_justificative_Id_intervention_fkey" FOREIGN KEY ("Id_intervention") REFERENCES "intervention" ("Id_intervention") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_piece_justificative" ("Id_intervention", "Id_piece_justificative", "Id_type_piece_justificative", "lien")
SELECT "Id_intervention", "Id_piece_justificative", "Id_type_piece_justificative", "lien" FROM "piece_justificative";
DROP TABLE "piece_justificative";
ALTER TABLE "new_piece_justificative" RENAME TO "piece_justificative";

CREATE TABLE "new_subir" (
    "matricule" TEXT NOT NULL,
    "Id_intervention" INTEGER NOT NULL,

    PRIMARY KEY ("matricule", "Id_intervention"),
    CONSTRAINT "subir_matricule_fkey" FOREIGN KEY ("matricule") REFERENCES "vehicule" ("matricule") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subir_Id_intervention_fkey" FOREIGN KEY ("Id_intervention") REFERENCES "intervention" ("Id_intervention") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subir" ("Id_intervention", "matricule")
SELECT "Id_intervention", "matricule" FROM "subir";
DROP TABLE "subir";
ALTER TABLE "new_subir" RENAME TO "subir";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
