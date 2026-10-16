import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class ProveedoresQueryDto { @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() activo?: boolean; @IsOptional() @IsString() buscar?: string; }
export class CreateProveedorDto { @IsString() @MaxLength(150) nombre!: string; @IsOptional() @IsString() @MaxLength(500) observaciones?: string; @IsOptional() @IsBoolean() activo?: boolean; }
export class UpdateProveedorDto { @IsOptional() @IsString() @MaxLength(150) nombre?: string; @IsOptional() @IsString() @MaxLength(500) observaciones?: string; @IsOptional() @IsBoolean() activo?: boolean; }
