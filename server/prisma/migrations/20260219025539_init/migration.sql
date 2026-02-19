-- CreateEnum
CREATE TYPE "Service" AS ENUM ('delivery', 'pick_up', 'payment');

-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadService" (
    "id" SERIAL NOT NULL,
    "leadId" INTEGER NOT NULL,
    "service" "Service" NOT NULL,

    CONSTRAINT "LeadService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeadService" ADD CONSTRAINT "LeadService_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
