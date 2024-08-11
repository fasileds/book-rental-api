/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isChecked` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isChecked` on the `Owner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Owner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "isAdmin",
DROP COLUMN "isChecked",
ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "isAproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRented" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "isChecked",
ADD COLUMN     "isAproved" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Book_id_key" ON "Book"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_id_key" ON "Owner"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
