import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma, PrismaClient, TipoProducto, EstatusBataEncaje, EstatusPedido, EstatusPedidoEncaje, EstatusProveedor } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { dateToApi, decimalToNumber, enumFromApi, enumToApi, handlePrismaError, parseDateOnly } from '../../common/api';
import { CreateAdicionalDto, CreatePedidoDto, CreateProductoDto, UpdateAdicionalDto, UpdatePedidoDto } from './pedidos.dto';

const productInclude = { proveedor: true, color: true, colorTexto: true, talla: true, tipoEncaje: true, adicional: true } as const;
const pedidoInclude = { cliente: true, tipografia: true, referencias: true, productos: { include: productInclude }, adicionales: { include: { productos: { include: productInclude } } } } as const;
type ProductRow = Prisma.PedidoProductoGetPayload<{ include: typeof productInclude }>;
type PedidoRow = Prisma.PedidoGetPayload<{ include: typeof pedidoInclude }>;
type Tx = Prisma.TransactionClient;

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureRefs(db: PrismaClient | Tx, dto: CreateProductoDto, requireActive = true): Promise<void> {
    const check = async (id: string | undefined, model: 'proveedor' | 'color' | 'talla' | 'tipoEncaje', label: string) => {
      if (!id) return;
      const row = await (db[model] as { findUnique: (args: object) => Promise<{ activo: boolean } | null> }).findUnique({ where: { id }, select: { activo: true } });
      if (!row) throw new BadRequestException(`${label} no encontrado`);
      if (requireActive && !row.activo) throw new BadRequestException(`${label} está inactivo`);
    };
    await check(dto.proveedorId, 'proveedor', 'Proveedor');
    await check(dto.colorId, 'color', 'Color');
    await check(dto.colorTextoId, 'color', 'Color de texto');
    await check(dto.tallaId, 'talla', 'Talla');
    await check(dto.tipoEncajeId, 'tipoEncaje', 'Tipo de encaje');
  }

  private validateProduct(dto: CreateProductoDto): void {
    const required: Partial<Record<TipoProducto, (keyof CreateProductoDto)[]>> = {
      BATA_NORMAL: ['colorId', 'tallaId', 'proveedorId'], BATA_INFANTIL: ['colorId', 'tallaId', 'proveedorId'],
      BATA_ENCAJE: ['colorId', 'tallaId', 'tipoEncajeId', 'proveedorId'], PANTALON: ['colorId', 'tallaId', 'proveedorId'],
      PANUELO: ['colorId', 'colorTextoId', 'texto', 'proveedorId'], PANUELO_MASCOTA: ['colorId', 'colorTextoId', 'texto', 'tallaMascota', 'proveedorId'],
      PANTUFLAS: ['opcionPantufla', 'proveedorId'], PLAYERA_HOMBRE: ['colorId', 'tallaId', 'proveedorId'], TOALLA: ['proveedorId'],
    };
    for (const field of required[dto.tipo] ?? []) if (dto[field] === undefined || dto[field] === null || dto[field] === '') throw new BadRequestException(`${String(field)} es requerido para ${dto.tipo.toLowerCase()}`);
  }

  private async validateProducts(db: PrismaClient | Tx, products: CreateProductoDto[]): Promise<void> {
    if (!products?.length) throw new BadRequestException('El pedido debe incluir al menos un producto');
    for (const product of products) { this.validateProduct(product); await this.ensureRefs(db, product); }
  }

  private productData(dto: CreateProductoDto, pedidoId: string, adicionalId?: string, grupoProductoId?: string, cantidad = dto.cantidad): Prisma.PedidoProductoUncheckedCreateInput {
    return { pedidoId, adicionalId, grupoProductoId, tipo: enumFromApi(dto.tipo), cantidad, precioUnitario: dto.precioUnitario, proveedorId: dto.proveedorId, estatusProveedor: dto.estatusProveedor ? enumFromApi(dto.estatusProveedor) : undefined, colorId: dto.colorId, colorTextoId: dto.colorTextoId, tallaId: dto.tallaId, texto: dto.texto, bordadoFrontal: dto.bordadoFrontal, bordadoPosterior: dto.bordadoPosterior, alineacionBordado: dto.alineacionBordado ? enumFromApi(dto.alineacionBordado) : undefined, observaciones: dto.observaciones, tipoEncajeId: dto.tipoEncajeId, estatusBataEncaje: dto.tipo === TipoProducto.BATA_ENCAJE ? (dto.estatusBataEncaje ?? EstatusBataEncaje.SOLICITADA) : dto.estatusBataEncaje, tallaMascota: dto.tallaMascota ? enumFromApi(dto.tallaMascota) : undefined, opcionPantufla: dto.opcionPantufla ? enumFromApi(dto.opcionPantufla) : undefined };
  }

  private async createProductPieces(db: PrismaClient | Tx, dto: CreateProductoDto, pedidoId: string, adicionalId?: string): Promise<void> {
    const grupoProductoId = randomUUID();
    for (let piece = 0; piece < dto.cantidad; piece++) {
      await db.pedidoProducto.create({ data: this.productData(dto, pedidoId, adicionalId, grupoProductoId, 1) });
    }
  }

  private pedidoFolio(numeroPedido: number): string {
    return `PED-${String(numeroPedido).padStart(4, '0')}`;
  }

  async crear(dto: CreatePedidoDto): Promise<unknown> {
    await this.validateProducts(this.prisma, dto.productos);
    if (dto.clienteId) { const c = await this.prisma.cliente.findUnique({ where: { id: dto.clienteId } }); if (!c) throw new BadRequestException('Cliente no encontrado'); if (!c.activo) throw new BadRequestException('Cliente está inactivo'); }
    const t = await this.prisma.tipografia.findUnique({ where: { id: dto.tipografiaId } }); if (!t) throw new BadRequestException('Tipografía no encontrada'); if (!t.activo) throw new BadRequestException('Tipografía está inactiva');
    const folio = this.pedidoFolio(dto.numeroPedido);
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.pedido.findUnique({ where: { folio }, select: { id: true } });
        if (existing) throw new ConflictException('El número de pedido ya existe.');
        const pedido = await tx.pedido.create({ data: { folio, clienteId: dto.clienteId ?? null, clienteNombre: dto.clienteNombre, fechaEvento: parseDateOnly(dto.fechaEvento), ubicacion: dto.ubicacion, terminacionContacto: dto.terminacionContacto, tipoCliente: enumFromApi(dto.tipoCliente), tipoClienteOtro: dto.tipoClienteOtro, anticipo: dto.anticipo, tipografiaId: dto.tipografiaId, dualTexto: enumFromApi(dto.dualTexto), esUrgente: dto.esUrgente ?? false, estatusPedidoEncaje: dto.estatusPedidoEncaje ? enumFromApi<EstatusPedidoEncaje>(dto.estatusPedidoEncaje) : undefined, observaciones: dto.observaciones } });
        for (const product of dto.productos) await this.createProductPieces(tx, product, pedido.id);
        return tx.pedido.findUniqueOrThrow({ where: { id: pedido.id }, include: pedidoInclude });
      });
      return this.mapPedido(row);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('El número de pedido ya existe.');
      return handlePrismaError(e, 'pedido');
    }
  }

  async listar(query: { buscar?: string; estatus?: string; estatusPedidoEncaje?: string }) {
    const rows = await this.prisma.pedido.findMany({ where: { estatus: query.estatus ? enumFromApi<EstatusPedido>(query.estatus) : undefined, estatusPedidoEncaje: query.estatusPedidoEncaje ? enumFromApi<EstatusPedidoEncaje>(query.estatusPedidoEncaje) : undefined, OR: query.buscar ? [{ folio: { contains: query.buscar, mode: 'insensitive' } }, { clienteNombre: { contains: query.buscar, mode: 'insensitive' } }] : undefined }, include: { productos: true, adicionales: true }, orderBy: { fechaEvento: 'asc' } });
    return rows.map((p) => { const originals = p.productos.filter((x) => !x.adicionalId); const additional = p.productos.filter((x) => !!x.adicionalId); const totalOriginal = originals.reduce((s, x) => s + Number(x.precioUnitario) * x.cantidad, 0); const totalAdicionales = additional.reduce((s, x) => s + Number(x.precioUnitario) * x.cantidad, 0); return { id: p.id, folio: p.folio, clienteId: p.clienteId, clienteNombre: p.clienteNombre, fechaEvento: dateToApi(p.fechaEvento), creadoEn: p.creadoEn, ubicacion: p.ubicacion, terminacionContacto: p.terminacionContacto, tipoCliente: enumToApi(p.tipoCliente), anticipo: decimalToNumber(p.anticipo), estatus: enumToApi(p.estatus), esUrgente: p.esUrgente, estatusPedidoEncaje: enumToApi(p.estatusPedidoEncaje), observaciones: p.observaciones, cantidadProductos: p.productos.reduce((s, x) => s + x.cantidad, 0), cantidadBatas: p.productos.filter((x) => x.tipo === TipoProducto.BATA_NORMAL || x.tipo === TipoProducto.BATA_INFANTIL || x.tipo === TipoProducto.BATA_ENCAJE).reduce((s, x) => s + x.cantidad, 0), cantidadAdicionales: p.adicionales.length, totalOriginal, totalAdicionales, totalConAdicionales: totalOriginal + totalAdicionales, total: totalOriginal, restante: totalOriginal - Number(p.anticipo), restanteOriginal: totalOriginal - Number(p.anticipo) }; });
  }

  async uno(id: string) { const row = await this.prisma.pedido.findUnique({ where: { id }, include: pedidoInclude }); if (!row) throw new NotFoundException('Pedido no encontrado'); return this.mapPedido(row); }
  async actualizar(id: string, dto: UpdatePedidoDto) { const data: Prisma.PedidoUncheckedUpdateInput = { ...dto, fechaEvento: dto.fechaEvento ? parseDateOnly(dto.fechaEvento) : undefined, tipoCliente: dto.tipoCliente ? enumFromApi(dto.tipoCliente) : undefined, dualTexto: dto.dualTexto ? enumFromApi(dto.dualTexto) : undefined, estatusPedidoEncaje: dto.estatusPedidoEncaje ? enumFromApi<EstatusPedidoEncaje>(dto.estatusPedidoEncaje) : undefined }; try { const row = await this.prisma.pedido.update({ where: { id }, data, include: pedidoInclude }); return this.mapPedido(row); } catch (e) { return handlePrismaError(e, 'pedido'); } }
  async estatus(id: string, dto: { estatus: string; estatusPedidoEncaje?: string; observaciones?: string }) {
    const estatus = enumFromApi<EstatusPedido>(dto.estatus);
    const observaciones = dto.observaciones?.trim();

    if (estatus === EstatusPedido.SITUACION && !observaciones) {
      throw new BadRequestException('Debe ingresar el motivo de la situación.');
    }

    try {
      const row = await this.prisma.pedido.update({
        where: { id },
        data: {
          estatus,
          estatusPedidoEncaje: dto.estatusPedidoEncaje ? enumFromApi<EstatusPedidoEncaje>(dto.estatusPedidoEncaje) : undefined,
          observaciones: dto.observaciones === undefined ? undefined : observaciones,
        },
        select: { id: true, folio: true, estatus: true, estatusPedidoEncaje: true, observaciones: true },
      });
      return { ...row, estatus: enumToApi(row.estatus), estatusPedidoEncaje: enumToApi(row.estatusPedidoEncaje) };
    } catch (e) {
      return handlePrismaError(e, 'pedido');
    }
  }

  private mapProduct(p: ProductRow) { return { id: p.id, grupoProductoId: p.grupoProductoId, tipo: enumToApi(p.tipo), cantidad: p.cantidad, precioUnitario: decimalToNumber(p.precioUnitario), proveedorId: p.proveedorId, proveedor: p.proveedor ? { id: p.proveedor.id, nombre: p.proveedor.nombre } : null, estatusProveedor: enumToApi(p.estatusProveedor), colorId: p.colorId, color: p.color ? { id: p.color.id, nombre: p.color.nombre } : null, colorTextoId: p.colorTextoId, colorTexto: p.colorTexto ? { id: p.colorTexto.id, nombre: p.colorTexto.nombre } : null, tallaId: p.tallaId, talla: p.talla ? { id: p.talla.id, nombre: p.talla.nombre } : null, texto: p.texto, bordadoFrontal: p.bordadoFrontal, bordadoPosterior: p.bordadoPosterior, alineacionBordado: enumToApi(p.alineacionBordado), observaciones: p.observaciones, tipoEncajeId: p.tipoEncajeId, tipoEncaje: p.tipoEncaje ? { id: p.tipoEncaje.id, nombre: p.tipoEncaje.nombre } : null, estatusBataEncaje: enumToApi(p.estatusBataEncaje), tallaMascota: enumToApi(p.tallaMascota), opcionPantufla: enumToApi(p.opcionPantufla), adicionalId: p.adicionalId, adicionalFolio: p.adicional?.folio ?? null, subtotal: Number(p.precioUnitario) * p.cantidad }; }
  private mapReference(reference: PedidoRow['referencias'][number]) {
    return {
      id: reference.id,
      pedidoId: reference.pedidoId,
      nombreArchivo: reference.nombreArchivo,
      tipoMime: reference.tipoMime,
      rutaArchivo: reference.rutaArchivo,
      tamanoBytes: reference.tamanoBytes,
      creadoEn: reference.creadoEn,
    };
  }

  private mapPedido(row: PedidoRow) {
    const products = row.productos;
    const allAdditional = row.adicionales.flatMap((a) => a.productos);
    const originals = products.filter((p) => !p.adicionalId);
    const totalOriginal = originals.reduce((s, p) => s + Number(p.precioUnitario) * p.cantidad, 0);
    const totalAdicionales = allAdditional.reduce((s, p) => s + Number(p.precioUnitario) * p.cantidad, 0);
    return {
      id: row.id,
      folio: row.folio,
      clienteId: row.clienteId,
      clienteNombre: row.clienteNombre,
      cliente: row.cliente ? { id: row.cliente.id, nombre: row.cliente.nombre, telefono: row.cliente.telefono, correo: row.cliente.correo, activo: row.cliente.activo } : null,
      fechaEvento: dateToApi(row.fechaEvento),
      creadoEn: row.creadoEn,
      actualizadoEn: row.actualizadoEn,
      ubicacion: row.ubicacion,
      terminacionContacto: row.terminacionContacto,
      tipoCliente: enumToApi(row.tipoCliente),
      tipoClienteOtro: row.tipoClienteOtro,
      anticipo: decimalToNumber(row.anticipo),
      tipografiaId: row.tipografiaId,
      tipografia: { id: row.tipografia.id, nombre: row.tipografia.nombre, muestra: row.tipografia.muestra, orden: row.tipografia.orden, activo: row.tipografia.activo },
      dualTexto: enumToApi(row.dualTexto),
      estatus: enumToApi(row.estatus),
      esUrgente: row.esUrgente,
      estatusPedidoEncaje: enumToApi(row.estatusPedidoEncaje),
      observaciones: row.observaciones,
      productos: originals.map((p) => this.mapProduct(p)),
      adicionales: row.adicionales.map((a) => ({ id: a.id, folio: a.folio, observaciones: a.observaciones, creadoEn: a.creadoEn, actualizadoEn: a.actualizadoEn, productos: a.productos.map((p) => this.mapProduct(p)), total: a.productos.reduce((s, p) => s + Number(p.precioUnitario) * p.cantidad, 0) })),
      referencias: row.referencias.map((reference) => this.mapReference(reference)),
      totalOriginal,
      totalAdicionales,
      totalConAdicionales: totalOriginal + totalAdicionales,
      total: totalOriginal,
      restanteOriginal: totalOriginal - Number(row.anticipo),
      restante: totalOriginal - Number(row.anticipo),
    };
  }

  async agregarProducto(pedidoId: string, dto: CreateProductoDto) { await this.assertPedido(pedidoId); this.validateProduct(dto); await this.ensureRefs(this.prisma, dto); const grupoProductoId = randomUUID(); const rows: ProductRow[] = []; for (let piece = 0; piece < dto.cantidad; piece++) rows.push(await this.prisma.pedidoProducto.create({ data: this.productData(dto, pedidoId, undefined, grupoProductoId, 1), include: productInclude })); return rows.map((p) => this.mapProduct(p)); }
  async actualizarProducto(pedidoId: string, productoId: string, dto: CreateProductoDto) { const current = await this.productoDelPedido(pedidoId, productoId); this.validateProduct(dto); await this.ensureRefs(this.prisma, dto); const p = await this.prisma.pedidoProducto.update({ where: { id: current.id }, data: this.productData(dto, pedidoId, current.adicionalId ?? undefined, current.grupoProductoId ?? undefined, current.grupoProductoId ? 1 : dto.cantidad), include: productInclude }); return this.mapProduct(p); }
  async eliminarProducto(pedidoId: string, productoId: string) { await this.productoDelPedido(pedidoId, productoId); await this.prisma.pedidoProducto.delete({ where: { id: productoId } }); }
  async estatusProveedor(pedidoId: string, productoId: string, value: string) { await this.productoDelPedido(pedidoId, productoId); const row = await this.prisma.pedidoProducto.update({ where: { id: productoId }, data: { estatusProveedor: enumFromApi<EstatusProveedor>(value) }, select: { id: true, estatusProveedor: true } }); return { ...row, estatusProveedor: enumToApi(row.estatusProveedor) }; }
  private async assertPedido(id: string) { const p = await this.prisma.pedido.findUnique({ where: { id }, select: { id: true } }); if (!p) throw new NotFoundException('Pedido no encontrado'); }
  private async productoDelPedido(pedidoId: string, productoId: string) { const p = await this.prisma.pedidoProducto.findFirst({ where: { id: productoId, pedidoId } }); if (!p) throw new NotFoundException('Producto no encontrado'); return p; }

  async adicionales(pedidoId: string) { await this.assertPedido(pedidoId); const rows = await this.prisma.pedidoAdicional.findMany({ where: { pedidoId }, include: { productos: { include: productInclude } }, orderBy: { folio: 'asc' } }); return rows.map((a) => this.mapAdicional(a)); }
  async adicional(pedidoId: string, adicionalId: string) { const row = await this.prisma.pedidoAdicional.findFirst({ where: { id: adicionalId, pedidoId }, include: { productos: { include: productInclude } } }); if (!row) throw new NotFoundException('Adicional no encontrado'); return this.mapAdicional(row); }
  private async nextAdicionalFolio(tx: Tx, pedidoId: string, pedidoFolio: string) { const rows = await tx.pedidoAdicional.findMany({ where: { pedidoId }, select: { folio: true } }); const max = rows.reduce((m, a) => Math.max(m, Number(a.folio.split('-AD')[1] ?? 0)), 0); return `${pedidoFolio}-AD${String(max + 1).padStart(2, '0')}`; }
  async crearAdicional(pedidoId: string, dto: CreateAdicionalDto) { await this.assertPedido(pedidoId); await this.validateProducts(this.prisma, dto.productos); const row = await this.prisma.$transaction(async (tx) => { const pedido = await tx.pedido.findUniqueOrThrow({ where: { id: pedidoId }, select: { folio: true } }); const adicional = await tx.pedidoAdicional.create({ data: { pedidoId, folio: await this.nextAdicionalFolio(tx, pedidoId, pedido.folio), observaciones: dto.observaciones } }); for (const p of dto.productos) await this.createProductPieces(tx, p, pedidoId, adicional.id); return tx.pedidoAdicional.findUniqueOrThrow({ where: { id: adicional.id }, include: { productos: { include: productInclude } } }); }); return this.mapAdicional(row); }
  async actualizarAdicional(pedidoId: string, adicionalId: string, dto: UpdateAdicionalDto) { await this.adicional(pedidoId, adicionalId); if (!dto.productos) return this.prisma.pedidoAdicional.update({ where: { id: adicionalId }, data: { observaciones: dto.observaciones }, include: { productos: { include: productInclude } } }).then((x) => this.mapAdicional(x)); await this.validateProducts(this.prisma, dto.productos); const row = await this.prisma.$transaction(async (tx) => { await tx.pedidoProducto.deleteMany({ where: { adicionalId } }); await tx.pedidoAdicional.update({ where: { id: adicionalId }, data: { observaciones: dto.observaciones } }); for (const p of dto.productos!) await this.createProductPieces(tx, p, pedidoId, adicionalId); return tx.pedidoAdicional.findUniqueOrThrow({ where: { id: adicionalId }, include: { productos: { include: productInclude } } }); }); return this.mapAdicional(row); }
  async eliminarAdicional(pedidoId: string, adicionalId: string) { await this.adicional(pedidoId, adicionalId); await this.prisma.pedidoAdicional.delete({ where: { id: adicionalId } }); }
  private mapAdicional(a: { id: string; folio: string; observaciones: string | null; creadoEn: Date; actualizadoEn: Date; productos: ProductRow[] }) { return { id: a.id, folio: a.folio, observaciones: a.observaciones, creadoEn: a.creadoEn, actualizadoEn: a.actualizadoEn, productos: a.productos.map((p) => this.mapProduct(p)), total: a.productos.reduce((s, p) => s + Number(p.precioUnitario) * p.cantidad, 0) }; }
}
