/*
  Warnings:

  - The primary key for the `conduire` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id_degat` on the `conduire` table. All the data in the column will be lost.
  - Added the required column `Id_conduire` to the `conduire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id_conduire` to the `degat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_conduire" (
    "Id_conduire" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matricule" TEXT NOT NULL,
    "Id_facteur" INTEGER NOT NULL,
    "date_debut" DATETIME NOT NULL,
    "date_fin" DATETIME NOT NULL,
    CONSTRAINT "conduire_matricule_fkey" FOREIGN KEY ("matricule") REFERENCES "vehicule" ("matricule") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "conduire_Id_facteur_fkey" FOREIGN KEY ("Id_facteur") REFERENCES "facteur" ("Id_facteur") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_conduire" ("Id_facteur", "date_debut", "date_fin", "matricule") SELECT "Id_facteur", "date_debut", "date_fin", "matricule" FROM "conduire";
DROP TABLE "conduire";
ALTER TABLE "new_conduire" RENAME TO "conduire";
CREATE TABLE "new_degat" (
    "Id_degat" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "date_constat" DATETIME NOT NULL,
    "lien_image" TEXT NOT NULL,
    "Id_conduire" INTEGER NOT NULL,
    CONSTRAINT "degat_Id_conduire_fkey" FOREIGN KEY ("Id_conduire") REFERENCES "conduire" ("Id_conduire") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_degat" ("Id_degat", "date_constat", "description", "lien_image") SELECT "Id_degat", "date_constat", "description", "lien_image" FROM "degat";
DROP TABLE "degat";
ALTER TABLE "new_degat" RENAME TO "degat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
