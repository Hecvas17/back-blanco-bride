import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CatalogoQueryDto {
  @IsOptional() @IsString() buscar?: string;
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() activo?: boolean;
}

export class ColorQueryDto extends CatalogoQueryDto {
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() disponibleProducto?: boolean;
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() disponibleBordado?: boolean;
}

export class CreateColorDto {
  @IsString() @MaxLength(100) nombre!: string;
  @IsBoolean() disponibleProducto!: boolean;
  @IsBoolean() disponibleBordado!: boolean;
  @IsOptional() @IsBoolean() activo?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) orden?: number;
}

export class UpdateColorDto {
  @IsOptional() @IsString() @MaxLength(100) nombre?: string;
  @IsOptional() @IsBoolean() disponibleProducto?: boolean;
  @IsOptional() @IsBoolean() disponibleBordado?: boolean;
  @IsOptional() @IsBoolean() activo?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) orden?: number;
}

export class CreateCatalogoDto {
  @IsString() @MaxLength(100) nombre!: string;
  @IsOptional() @IsString() @MaxLength(255) muestra?: string;
  @IsOptional() @IsInt() @Type(() => Number) @Min(0) orden?: number;
  @IsOptional() @IsBoolean() activo?: boolean;
}

export class UpdateCatalogoDto {
  @IsOptional() @IsString() @MaxLength(100) nombre?: string;
  @IsOptional() @IsString() @MaxLength(255) muestra?: string;
  @IsOptional() @IsInt() @Type(() => Number) @Min(0) orden?: number;
  @IsOptional() @IsBoolean() activo?: boolean;
}

export class ActivoDto {
  @IsBoolean() activo!: boolean;
}
