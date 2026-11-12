-- Add a nullable backend-generated grouping identifier for physical product pieces.
ALTER TABLE "pedido_productos"
ADD COLUMN "grupo_producto_id" UUID;

CREATE INDEX "pedido_productos_grupo_producto_id_idx"
ON "pedido_productos"("grupo_producto_id");
