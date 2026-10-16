import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class ClientesQueryDto {
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() activo?: boolean;
  @IsOptional() @IsString() buscar?: string;
}

export class CreateClienteDto {
  @IsString() @MaxLength(150) nombre!: string;
  @IsOptional() @IsString() @MaxLength(40) telefono?: string;
  @IsOptional() @IsEmail() @MaxLength(150) correo?: string;
  @IsOptional() @IsBoolean() activo?: boolean;
}

export class UpdateClienteDto {
  @IsOptional() @IsString() @MaxLength(150) nombre?: string;
  @IsOptional() @IsString() @MaxLength(40) telefono?: string;
  @IsOptional() @IsEmail() @MaxLength(150) correo?: string;
  @IsOptional() @IsBoolean() activo?: boolean;
}
