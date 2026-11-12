-- Add urgency flag to orders. Existing orders default to false.
ALTER TABLE "pedidos"
ADD COLUMN "es_urgente" BOOLEAN NOT NULL DEFAULT false;
