-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'CONFIRMED');

-- AlterTable
ALTER TABLE "BloodDonationHistory" ADD COLUMN     "status" "DonationStatus" NOT NULL DEFAULT 'PENDING';
