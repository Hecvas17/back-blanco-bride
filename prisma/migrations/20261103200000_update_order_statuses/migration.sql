-- Replace order and lace status enums while preserving existing records.
BEGIN;

CREATE TYPE "EstatusPedido_new" AS ENUM (
  'EN_PRODUCCION',
  'SALIO_DE_PRODUCCION',
  'POR_LIQUIDAR',
  'GENERAR_GUIA',
  'EN_TRANSITO',
  'ENTREGADO',
  'SITUACION'
);

CREATE TYPE "EstatusBataEncaje_new" AS ENUM (
  'SIN_SOLICITAR',
  'SOLICITADA',
  'YA_LLEGO',
  'EN_PRODUCCION',
  'LISTA'
);

CREATE TYPE "EstatusPedidoEncaje" AS ENUM (
  'EN_PRODUCCION',
  'BATAS_NORMALES_LISTAS'
);

ALTER TABLE "pedidos"
  ADD COLUMN "estatus_pedido_encaje" "EstatusPedidoEncaje",
  ADD COLUMN "observaciones" TEXT;

ALTER TABLE "pedidos" ALTER COLUMN "estatus" DROP DEFAULT;
ALTER TABLE "pedidos"
  ALTER COLUMN "estatus" TYPE "EstatusPedido_new"
  USING (
    CASE "estatus"::text
      WHEN 'BORRADOR' THEN 'EN_PRODUCCION'
      WHEN 'CONFIRMADO' THEN 'EN_PRODUCCION'
      WHEN 'EN_PROCESO' THEN 'EN_PRODUCCION'
      WHEN 'LISTO' THEN 'SALIO_DE_PRODUCCION'
      WHEN 'ENTREGADO' THEN 'ENTREGADO'
      WHEN 'CANCELADO' THEN 'SITUACION'
      ELSE 'EN_PRODUCCION'
    END
  )::"EstatusPedido_new";

DROP TYPE "EstatusPedido";
ALTER TYPE "EstatusPedido_new" RENAME TO "EstatusPedido";
ALTER TABLE "pedidos" ALTER COLUMN "estatus" SET DEFAULT 'EN_PRODUCCION';

ALTER TABLE "pedido_productos" ALTER COLUMN "estatus_bata_encaje" DROP DEFAULT;
ALTER TABLE "pedido_productos"
  ALTER COLUMN "estatus_bata_encaje" TYPE "EstatusBataEncaje_new"
  USING ("estatus_bata_encaje"::text)::"EstatusBataEncaje_new";

DROP TYPE "EstatusBataEncaje";
ALTER TYPE "EstatusBataEncaje_new" RENAME TO "EstatusBataEncaje";

COMMIT;
