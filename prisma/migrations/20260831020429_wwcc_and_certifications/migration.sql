-- AlterTable
ALTER TABLE "SitterProfile" ADD COLUMN     "firstAidCertified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otherCertifications" TEXT,
ADD COLUMN     "wwccConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wwccExpiry" TIMESTAMP(3),
ADD COLUMN     "wwccNumber" TEXT;
