/*
  Warnings:

  - You are about to drop the column `email_code` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_code",
ADD COLUMN     "validation_code" TEXT;
