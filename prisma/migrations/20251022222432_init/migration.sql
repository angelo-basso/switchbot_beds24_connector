-- CreateTable
CREATE TABLE "AccessCode" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "propertyId" TEXT,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "passcodeEncrypted" TEXT NOT NULL,
    "keypadDeviceId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "switchbotCommandId" TEXT,
    "audit" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessCode_bookingId_key" ON "AccessCode"("bookingId");
