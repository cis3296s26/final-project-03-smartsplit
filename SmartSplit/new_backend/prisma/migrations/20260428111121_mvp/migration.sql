/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Household` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roommateCount` to the `Household` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Household" ADD COLUMN     "roommateCount" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Roommate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "householdId" INTEGER,

    CONSTRAINT "Roommate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "total" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "householdId" INTEGER,
    "roommateId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Household_key_key" ON "Household"("key");

-- AddForeignKey
ALTER TABLE "Roommate" ADD CONSTRAINT "Roommate_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_roommateId_fkey" FOREIGN KEY ("roommateId") REFERENCES "Roommate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;
