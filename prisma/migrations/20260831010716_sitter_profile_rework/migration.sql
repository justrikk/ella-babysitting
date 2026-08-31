-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "squarePaymentId" TEXT;

-- AlterTable
ALTER TABLE "SitterProfile" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "emergencyContact1Name" TEXT,
ADD COLUMN     "emergencyContact1Phone" TEXT,
ADD COLUMN     "emergencyContact2Name" TEXT,
ADD COLUMN     "emergencyContact2Phone" TEXT,
ADD COLUMN     "parentGuardianName" TEXT,
ADD COLUMN     "parentGuardianPhone" TEXT,
ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3),
ALTER COLUMN "hourlyRateCents" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SitterAvailability" (
    "id" TEXT NOT NULL,
    "sitterProfileId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SitterAvailability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SitterAvailability" ADD CONSTRAINT "SitterAvailability_sitterProfileId_fkey" FOREIGN KEY ("sitterProfileId") REFERENCES "SitterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
