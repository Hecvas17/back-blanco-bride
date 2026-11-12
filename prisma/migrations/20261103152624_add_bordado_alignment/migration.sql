-- CreateEnum
CREATE TYPE "AlineacionBordado" AS ENUM ('IZQUIERDA', 'CENTRO', 'DERECHA');

-- AlterTable
ALTER TABLE "pedido_productos" ADD COLUMN     "alineacion_bordado" "AlineacionBordado";
