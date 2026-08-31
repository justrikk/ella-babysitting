-- AlterTable
ALTER TABLE "SitterProfile" ADD COLUMN     "bestWithAgeMax" INTEGER,
ADD COLUMN     "bestWithAgeMin" INTEGER,
ADD COLUMN     "offersEveningCare" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "offersSchoolPickup" BOOLEAN NOT NULL DEFAULT false;
