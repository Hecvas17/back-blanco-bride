import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { AlineacionBordado, DualTexto, EstatusBataEncaje, EstatusPedido, EstatusPedidoEncaje, EstatusProveedor, OpcionPantufla, TallaMascota, TipoCliente, TipoProducto } from '@prisma/client';

const upper = ({ value }: { value: unknown }) => typeof value === 'string' ? value.toUpperCase() : value;

export class CreateProductoDto {
  @Transform(upper) @IsEnum(TipoProducto) tipo!: TipoProducto;
  @Type(() => Number) @IsInt() @Min(1) @Max(100) cantidad!: number;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) precioUnitario!: number;
  @IsOptional() @IsUUID() proveedorId?: string;
  @Transform(upper) @IsOptional() @IsEnum(EstatusProveedor) estatusProveedor?: EstatusProveedor;
  @IsOptional() @IsUUID() colorId?: string;
  @IsOptional() @IsUUID() colorTextoId?: string;
  @IsOptional() @IsUUID() tallaId?: string;
  @IsOptional() @IsString() texto?: string;
  @IsOptional() @IsString() bordadoFrontal?: string;
  @IsOptional() @IsString() bordadoPosterior?: string;
  @Transform(upper) @IsOptional() @IsEnum(AlineacionBordado) alineacionBordado?: AlineacionBordado;
  @IsOptional() @IsString() observaciones?: string;
  @IsOptional() @IsUUID() tipoEncajeId?: string;
  @Transform(upper) @IsOptional() @IsEnum(EstatusBataEncaje) estatusBataEncaje?: EstatusBataEncaje;
  @Transform(upper) @IsOptional() @IsEnum(TallaMascota) tallaMascota?: TallaMascota;
  @Transform(upper) @IsOptional() @IsEnum(OpcionPantufla) opcionPantufla?: OpcionPantufla;
}

export class CreatePedidoDto {
  @IsInt() @Min(1) numeroPedido!: number;
  @IsOptional() @IsUUID() clienteId?: string | null;
  @IsString() clienteNombre!: string;
  @IsDateString() fechaEvento!: string;
  @IsString() ubicacion!: string;
  @IsString() terminacionContacto!: string;
  @Transform(upper) @IsEnum(TipoCliente) tipoCliente!: TipoCliente;
  @IsOptional() @IsString() tipoClienteOtro?: string | null;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) anticipo!: number;
  @IsUUID() tipografiaId!: string;
  @Transform(upper) @IsEnum(DualTexto) dualTexto!: DualTexto;
  @IsOptional() @IsBoolean() esUrgente?: boolean;
  @IsOptional() @Transform(upper) @IsEnum(EstatusPedidoEncaje) estatusPedidoEncaje?: EstatusPedidoEncaje;
  @IsOptional() @IsString() observaciones?: string;
  @ValidateNested({ each: true }) @Type(() => CreateProductoDto) productos!: CreateProductoDto[];
}

export class UpdatePedidoDto {
  @IsOptional() @IsUUID() clienteId?: string | null;
  @IsOptional() @IsString() clienteNombre?: string;
  @IsOptional() @IsDateString() fechaEvento?: string;
  @IsOptional() @IsString() ubicacion?: string;
  @IsOptional() @IsString() terminacionContacto?: string;
  @Transform(upper) @IsOptional() @IsEnum(TipoCliente) tipoCliente?: TipoCliente;
  @IsOptional() @IsString() tipoClienteOtro?: string | null;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) anticipo?: number;
  @IsOptional() @IsUUID() tipografiaId?: string;
  @Transform(upper) @IsOptional() @IsEnum(DualTexto) dualTexto?: DualTexto;
  @IsOptional() @IsBoolean() esUrgente?: boolean;
  @IsOptional() @Transform(upper) @IsEnum(EstatusPedidoEncaje) estatusPedidoEncaje?: EstatusPedidoEncaje;
  @IsOptional() @IsString() observaciones?: string;
}

export class EstatusPedidoDto {
  @Transform(upper) @IsEnum(EstatusPedido) estatus!: EstatusPedido;
  @IsOptional() @Transform(upper) @IsEnum(EstatusPedidoEncaje) estatusPedidoEncaje?: EstatusPedidoEncaje;
  @IsOptional() @IsString() observaciones?: string;
}
export class EstatusProveedorDto { @Transform(upper) @IsEnum(EstatusProveedor) estatusProveedor!: EstatusProveedor; }

export class PedidosQueryDto {
  @IsOptional() @IsString() buscar?: string;
  @Transform(upper) @IsOptional() @IsEnum(EstatusPedido) estatus?: EstatusPedido;
  @Transform(upper) @IsOptional() @IsEnum(EstatusPedidoEncaje) estatusPedidoEncaje?: EstatusPedidoEncaje;
}

export class CreateAdicionalDto {
  @IsOptional() @IsString() observaciones?: string;
  @ValidateNested({ each: true }) @Type(() => CreateProductoDto) productos!: CreateProductoDto[];
}

export class UpdateAdicionalDto {
  @IsOptional() @IsString() observaciones?: string;
  @IsOptional() @ValidateNested({ each: true }) @Type(() => CreateProductoDto) productos?: CreateProductoDto[];
}
