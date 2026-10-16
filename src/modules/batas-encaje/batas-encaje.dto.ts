import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { EstatusBataEncaje } from '@prisma/client';

export class BatasEncajeQueryDto { @IsOptional() buscar?: string; @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value) @IsOptional() @IsEnum(EstatusBataEncaje) estatus?: EstatusBataEncaje; @IsOptional() @IsUUID() tipoEncajeId?: string; @IsOptional() @IsUUID() tallaId?: string; @IsOptional() @IsUUID() pedidoId?: string; }
export class EstatusBataDto { @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value) @IsEnum(EstatusBataEncaje) estatusBataEncaje!: EstatusBataEncaje; }
export class TipoEncajeDto { @IsUUID() tipoEncajeId!: string; }
