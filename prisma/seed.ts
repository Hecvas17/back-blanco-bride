import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const proveedores = [
  'Proveedor de Batas',
  'Proveedor de Pañuelos',
  'Proveedor de Playeras',
  'Proveedor General',
];

const tipografias = [
  'Ninguna Tipografía',
  'Moderna',
  'Dulce',
  'Sherline',
  'Bailarina',
  'Amelia',
  'Clásica',
  'Juvenil',
];

const tiposEncaje = [
  'Manga de encaje',
  'Manga de holanes',
  'Manga de encaje largo',
  'Manga de encaje 2',
];

const tallas = ['XS', 'CH', 'M', 'G', 'Unitalla', 'XL', '2XL', '3XL', '4XL', '5XL'];

const coloresProducto = [
  'Verde Olivo',
  'Rojo',
  'Azul petróleo',
  'Chedrón',
  'Azul plumbago',
  'Vino',
  'Azul marino',
  'Bugambilia',
  'Negro',
  'Celeste',
  'Turquesa',
  'Fuchsia',
  'Rosa Gaby',
  'Verde botella',
  'Ivory',
  'Rosa 1',
  'Beige',
  'Palo de rosa',
  'Rosa 2',
  'Blanco',
  'Lila',
  'Menta',
  'Morado',
  'Dorado',
  'Plateado',
  'Baby Pink',
  'Mostaza',
  'Cemento',
  'Azul rey',
  'Verde jade',
  'Hueso',
];

const coloresBordado = [
  'Ninguno',
  'Dorado',
  'Rosa 1',
  'Palo de rosa',
  'Negro',
  'Fuchsia',
  'Morado',
  'Lila',
  'Celeste',
  'Azul rey',
  'Beige',
  'Café',
  'Gris rata',
  'Guinda',
  'Plata',
  'Rosa 2',
  'Arena',
  'Hueso',
  'Ivory',
  'Rosa Gaby',
  'Blanco',
  'Rojo',
  'Vino',
  'Menta',
  'Cemento',
  'Azul marino',
  'Azul plumbago',
  'Verde jade',
  'Baby Pink',
];

async function main(): Promise<void> {
  for (const [orden, nombre] of proveedores.entries()) {
    await prisma.proveedor.upsert({
      where: { nombre },
      update: { activo: true },
      create: { nombre, activo: true },
    });
  }

  for (const [orden, nombre] of tipografias.entries()) {
    await prisma.tipografia.upsert({
      where: { nombre },
      update: { activo: true, orden },
      create: { nombre, activo: true, orden },
    });
  }

  for (const [orden, nombre] of tiposEncaje.entries()) {
    await prisma.tipoEncaje.upsert({
      where: { nombre },
      update: { activo: true, orden },
      create: { nombre, activo: true, orden },
    });
  }

  for (const [orden, nombre] of tallas.entries()) {
    await prisma.talla.upsert({
      where: { nombre },
      update: { activo: true, orden },
      create: { nombre, activo: true, orden },
    });
  }

  const nombresColores = new Set([...coloresProducto, ...coloresBordado]);
  for (const [orden, nombre] of [...nombresColores].entries()) {
    await prisma.color.upsert({
      where: { nombre },
      update: {
        activo: true,
        orden,
        disponibleProducto: coloresProducto.includes(nombre),
        disponibleBordado: coloresBordado.includes(nombre),
      },
      create: {
        nombre,
        activo: true,
        orden,
        disponibleProducto: coloresProducto.includes(nombre),
        disponibleBordado: coloresBordado.includes(nombre),
      },
    });
  }

  const email = process.env.DEMO_USER_EMAIL?.trim().toLowerCase();
  const password = process.env.DEMO_USER_PASSWORD;
  const nombre = process.env.DEMO_USER_NAME?.trim();
  if (!email || !password || !nombre) throw new Error('DEMO_USER_EMAIL, DEMO_USER_PASSWORD y DEMO_USER_NAME son obligatorios para el seed');
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.usuario.upsert({
    where: { email },
    update: { nombre, passwordHash, activo: true },
    create: { email, nombre, passwordHash, activo: true },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
