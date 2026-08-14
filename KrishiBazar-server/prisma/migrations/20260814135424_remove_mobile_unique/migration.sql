/*
  Warnings:

  - You are about to drop the column `farmerId` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_mobile_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "farmerId";
