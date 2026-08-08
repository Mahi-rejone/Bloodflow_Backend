/*
  Warnings:

  - The values [PENDING] on the enum `DonationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `otp` to the `BloodDonationHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otpExpiresAt` to the `BloodDonationHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DonationStatus_new" AS ENUM ('IN_PROGRESS', 'CONFIRMED');
ALTER TABLE "public"."BloodDonationHistory" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BloodDonationHistory" ALTER COLUMN "status" TYPE "DonationStatus_new" USING ("status"::text::"DonationStatus_new");
ALTER TYPE "DonationStatus" RENAME TO "DonationStatus_old";
ALTER TYPE "DonationStatus_new" RENAME TO "DonationStatus";
DROP TYPE "public"."DonationStatus_old";
ALTER TABLE "BloodDonationHistory" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;

-- AlterTable
ALTER TABLE "BloodDonationHistory" ADD COLUMN     "otp" TEXT NOT NULL,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
