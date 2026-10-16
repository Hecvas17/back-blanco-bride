# Backend Demo

Base de backend en NestJS, TypeScript y Prisma para desarrollo local. Esta etapa no incluye autenticación ni modelos de negocio.

## Requisitos

- Node.js 20 o superior
- npm
- PostgreSQL local

## Instalación

```bash
npm install
```

## Configuración

Edita `.env` y sustituye los valores de `DATABASE_URL`:

```env
DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/BD?schema=public"
```

También puedes ajustar `PORT` (por defecto `3000`) y `FRONTEND_URL` (por defecto `http://localhost:4200`). No guardes credenciales reales en Git: `.env` está ignorado y `.env.example` solo contiene placeholders.

## Crear la base de datos

Créala manualmente en PostgreSQL, por ejemplo:

```sql
CREATE DATABASE nombre_bd;
```

O desde la terminal:

```bash
createdb nombre_bd
```

No es necesario crear tablas en esta primera etapa.

## Prisma

```bash
npx prisma validate
npx prisma generate
```

Todavía no se crea una migración porque no hay modelos de negocio. Cuando se agreguen modelos, usa migraciones Prisma como estrategia principal.

## Ejecutar

```bash
npm run start:dev
```

Endpoints disponibles:

- `GET http://localhost:3000/api/health`
- `GET http://localhost:3000/api/health/db`

El segundo endpoint requiere que `DATABASE_URL` apunte a una base PostgreSQL accesible.
