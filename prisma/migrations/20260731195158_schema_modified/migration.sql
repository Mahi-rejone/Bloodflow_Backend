/*
  Warnings:

  - You are about to drop the column `stateProvince` on the `UserProfiles` table. All the data in the column will be lost.
  - Added the required column `state` to the `BloodRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `UserProfiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BloodRequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETE');

-- AlterTable
ALTER TABLE "BloodRequests" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "status" "BloodRequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "UserProfiles" DROP COLUMN "stateProvince",
ADD COLUMN     "state" TEXT NOT NULL;
