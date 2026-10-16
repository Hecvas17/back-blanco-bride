-- CreateEnum
CREATE TYPE "EstatusPedido" AS ENUM ('BORRADOR', 'CONFIRMADO', 'EN_PROCESO', 'LISTO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('NOVIA', 'QUINCEANERA', 'NEGOCIO', 'OTRO');

-- CreateEnum
CREATE TYPE "DualTexto" AS ENUM ('DUAL_CENTRADO', 'DUAL_LADO', 'NINGUNO');

-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('BATA_NORMAL', 'BATA_INFANTIL', 'BATA_ENCAJE', 'PANTALON', 'TOALLA', 'PANUELO', 'PANUELO_MASCOTA', 'PANTUFLAS', 'PLAYERA_HOMBRE');

-- CreateEnum
CREATE TYPE "EstatusProveedor" AS ENUM ('PENDIENTE', 'POR_SOLICITAR', 'SOLICITADO', 'EN_PRODUCCION', 'LISTO_PROVEEDOR', 'RECIBIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstatusBataEncaje" AS ENUM ('SOLICITADA', 'YA_LLEGO', 'LISTA');

-- CreateEnum
CREATE TYPE "TallaMascota" AS ENUM ('CHICA', 'MEDIANA', 'GRANDE');

-- CreateEnum
CREATE TYPE "OpcionPantufla" AS ENUM ('XV_BORDADO_PLATA', 'XV_BORDADO_DORADO', 'BRIDE_BORDADO', 'SIN_BORDADO');

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "correo" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "observaciones" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colores" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "disponible_producto" BOOLEAN NOT NULL DEFAULT false,
    "disponible_bordado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tallas" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tallas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipografias" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "muestra" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipografias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_encaje" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_encaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" UUID NOT NULL,
    "folio" TEXT NOT NULL,
    "cliente_id" UUID,
    "cliente_nombre" TEXT NOT NULL,
    "fecha_evento" DATE NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "terminacion_contacto" TEXT NOT NULL,
    "tipo_cliente" "TipoCliente" NOT NULL,
    "tipo_cliente_otro" TEXT,
    "anticipo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tipografia_id" UUID NOT NULL,
    "dual_texto" "DualTexto" NOT NULL DEFAULT 'NINGUNO',
    "estatus" "EstatusPedido" NOT NULL DEFAULT 'BORRADOR',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_adicionales" (
    "id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "folio" TEXT NOT NULL,
    "observaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedido_adicionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_productos" (
    "id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "adicional_id" UUID,
    "tipo" "TipoProducto" NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "proveedor_id" UUID,
    "estatus_proveedor" "EstatusProveedor" NOT NULL DEFAULT 'PENDIENTE',
    "color_id" UUID,
    "color_texto_id" UUID,
    "talla_id" UUID,
    "texto" TEXT,
    "bordado_frontal" TEXT,
    "bordado_posterior" TEXT,
    "observaciones" TEXT,
    "tipo_encaje_id" UUID,
    "estatus_bata_encaje" "EstatusBataEncaje",
    "talla_mascota" "TallaMascota",
    "opcion_pantufla" "OpcionPantufla",
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedido_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_referencias" (
    "id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "nombre_archivo" TEXT NOT NULL,
    "tipo_mime" TEXT,
    "ruta_archivo" TEXT,
    "tamano_bytes" INTEGER,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedido_referencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_nombre_key" ON "clientes"("nombre");

-- CreateIndex
CREATE INDEX "clientes_nombre_idx" ON "clientes"("nombre");

-- CreateIndex
CREATE INDEX "clientes_activo_idx" ON "clientes"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "proveedores_nombre_key" ON "proveedores"("nombre");

-- CreateIndex
CREATE INDEX "proveedores_activo_idx" ON "proveedores"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "colores_nombre_key" ON "colores"("nombre");

-- CreateIndex
CREATE INDEX "colores_activo_idx" ON "colores"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "tallas_nombre_key" ON "tallas"("nombre");

-- CreateIndex
CREATE INDEX "tallas_activo_idx" ON "tallas"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "tipografias_nombre_key" ON "tipografias"("nombre");

-- CreateIndex
CREATE INDEX "tipografias_activo_idx" ON "tipografias"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_encaje_nombre_key" ON "tipos_encaje"("nombre");

-- CreateIndex
CREATE INDEX "tipos_encaje_activo_idx" ON "tipos_encaje"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_folio_key" ON "pedidos"("folio");

-- CreateIndex
CREATE INDEX "pedidos_folio_idx" ON "pedidos"("folio");

-- CreateIndex
CREATE INDEX "pedidos_fecha_evento_idx" ON "pedidos"("fecha_evento");

-- CreateIndex
CREATE INDEX "pedidos_estatus_idx" ON "pedidos"("estatus");

-- CreateIndex
CREATE INDEX "pedidos_cliente_id_idx" ON "pedidos"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_adicionales_folio_key" ON "pedido_adicionales"("folio");

-- CreateIndex
CREATE INDEX "pedido_adicionales_pedido_id_idx" ON "pedido_adicionales"("pedido_id");

-- CreateIndex
CREATE INDEX "pedido_productos_pedido_id_idx" ON "pedido_productos"("pedido_id");

-- CreateIndex
CREATE INDEX "pedido_productos_adicional_id_idx" ON "pedido_productos"("adicional_id");

-- CreateIndex
CREATE INDEX "pedido_productos_tipo_idx" ON "pedido_productos"("tipo");

-- CreateIndex
CREATE INDEX "pedido_productos_proveedor_id_idx" ON "pedido_productos"("proveedor_id");

-- CreateIndex
CREATE INDEX "pedido_productos_estatus_proveedor_idx" ON "pedido_productos"("estatus_proveedor");

-- CreateIndex
CREATE INDEX "pedido_productos_estatus_bata_encaje_idx" ON "pedido_productos"("estatus_bata_encaje");

-- CreateIndex
CREATE INDEX "pedido_referencias_pedido_id_idx" ON "pedido_referencias"("pedido_id");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_tipografia_id_fkey" FOREIGN KEY ("tipografia_id") REFERENCES "tipografias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_adicionales" ADD CONSTRAINT "pedido_adicionales_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_adicional_id_fkey" FOREIGN KEY ("adicional_id") REFERENCES "pedido_adicionales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_color_texto_id_fkey" FOREIGN KEY ("color_texto_id") REFERENCES "colores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_talla_id_fkey" FOREIGN KEY ("talla_id") REFERENCES "tallas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_tipo_encaje_id_fkey" FOREIGN KEY ("tipo_encaje_id") REFERENCES "tipos_encaje"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_referencias" ADD CONSTRAINT "pedido_referencias_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
