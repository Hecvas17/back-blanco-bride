import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function enumFromApi<T extends string>(value: T | string): T {
  return value.toUpperCase() as T;
}

export function enumToApi(value: string | null | undefined): string | null {
  return value ? value.toLowerCase() : null;
}

export function decimalToNumber(value: Prisma.Decimal | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

export function dateToApi(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function parseDateOnly(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('La fecha debe tener formato YYYY-MM-DD');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error('La fecha no es válida');
  }
  return date;
}

export function handlePrismaError(error: unknown, entity: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') throw new ConflictException(`Ya existe ${entity} con ese nombre o folio`);
    if (error.code === 'P2025') throw new NotFoundException(`${entity} no encontrado`);
    if (error.code === 'P2003') throw new ConflictException(`No se puede modificar ${entity} porque tiene relaciones activas`);
  }
  throw error;
}

export function booleanQuery(value: string | boolean | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  return value === 'true' ? true : value === 'false' ? false : undefined;
}
