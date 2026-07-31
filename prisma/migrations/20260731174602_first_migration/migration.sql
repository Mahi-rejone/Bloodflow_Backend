-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'BLOOD_BANK_MANAGER', 'HOSPITAL_REPRESENTATIVE', 'DONOR_RECIPIENT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCK');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- CreateTable
CREATE TABLE "BloodRequests" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "unitsNeeded" INTEGER NOT NULL,
    "hospital" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "neededAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodDonationHistory" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unitDonated" INTEGER NOT NULL,
    "reqId" TEXT NOT NULL,

    CONSTRAINT "BloodDonationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coverImage" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "organizerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfiles" (
    "id" TEXT NOT NULL,
    "img" TEXT,
    "bloodGroup" "BloodGroup" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "guardianNumber" TEXT,
    "numberOfDonation" INTEGER NOT NULL DEFAULT 0,
    "stateProvince" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "UserProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blogs_slug_key" ON "Blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_profileId_key" ON "Users"("profileId");

-- AddForeignKey
ALTER TABLE "BloodRequests" ADD CONSTRAINT "BloodRequests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodDonationHistory" ADD CONSTRAINT "BloodDonationHistory_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodDonationHistory" ADD CONSTRAINT "BloodDonationHistory_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodDonationHistory" ADD CONSTRAINT "BloodDonationHistory_reqId_fkey" FOREIGN KEY ("reqId") REFERENCES "BloodRequests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
