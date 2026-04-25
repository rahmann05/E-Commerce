-- AlterEnum: Change PENDING to AWAITING_PAYMENT in OrderStatus
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'AWAITING_PAYMENT';

-- Update existing rows from PENDING to AWAITING_PAYMENT
UPDATE "Order" SET "status" = 'AWAITING_PAYMENT' WHERE "status" = 'PENDING';

-- AlterTable: Add missing columns to Address
ALTER TABLE "Address" ADD COLUMN IF NOT EXISTS "district" TEXT;
ALTER TABLE "Address" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION;
ALTER TABLE "Address" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;

-- AlterTable: Add missing column to PaymentMethod
ALTER TABLE "PaymentMethod" ADD COLUMN IF NOT EXISTS "accountNumber" TEXT;

-- AlterTable: Update default value for Order.status
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';
