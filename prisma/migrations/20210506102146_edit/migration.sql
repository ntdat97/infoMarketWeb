-- CreateEnum
CREATE TYPE "PaymentState" AS ENUM ('LIVE', 'DELETED');

-- AlterTable
ALTER TABLE "UserPaymentMethod" ADD COLUMN     "paymentState" "PaymentState" NOT NULL DEFAULT E'LIVE';
