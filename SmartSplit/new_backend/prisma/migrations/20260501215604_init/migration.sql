/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Household` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Roommate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[householdId,name]` on the table `Roommate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "total" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "householdId" INTEGER,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Expense_id_key" ON "Expense"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Household_id_key" ON "Household"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Roommate_id_key" ON "Roommate"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Roommate_householdId_name_key" ON "Roommate"("householdId", "name");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;
