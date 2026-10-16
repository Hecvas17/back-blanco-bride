import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class UsuariosQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsString()
  buscar?: string;
}

export class CreateUsuarioDto {
  @IsString()
  @MaxLength(150)
  nombre!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 128)
  password!: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  @IsEmail()
  email?: string;
}

export class UpdateUsuarioActivoDto {
  @IsBoolean()
  activo!: boolean;
}

export class UpdateUsuarioPasswordDto {
  @IsString()
  @Length(8, 128)
  password!: string;
}
