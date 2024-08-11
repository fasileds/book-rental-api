/*
  Warnings:

  - You are about to drop the column `isAproved` on the `Owner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Owner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addrasse` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNo` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "isAproved",
ADD COLUMN     "addrasse" TEXT NOT NULL,
ADD COLUMN     "isChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNo" TEXT NOT NULL,
ALTER COLUMN "balance" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");
