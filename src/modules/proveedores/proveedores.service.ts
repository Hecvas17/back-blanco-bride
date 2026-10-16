import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { booleanQuery, handlePrismaError } from '../../common/api';
import { CreateProveedorDto, UpdateProveedorDto } from './proveedores.dto';

@Injectable()
export class ProveedoresService {
  constructor(private readonly prisma: PrismaService) {}
  listar(query: { activo?: boolean; buscar?: string }) { return this.prisma.proveedor.findMany({ where: { activo: booleanQuery(query.activo), nombre: query.buscar ? { contains: query.buscar, mode: 'insensitive' } : undefined }, orderBy: { nombre: 'asc' } }); }
  async uno(id: string) { const row = await this.prisma.proveedor.findUnique({ where: { id } }); if (!row) throw new NotFoundException('Proveedor no encontrado'); return row; }
  async crear(dto: CreateProveedorDto) { try { return await this.prisma.proveedor.create({ data: dto }); } catch (e) { return handlePrismaError(e, 'proveedor'); } }
  async actualizar(id: string, dto: UpdateProveedorDto) { try { return await this.prisma.proveedor.update({ where: { id }, data: dto }); } catch (e) { return handlePrismaError(e, 'proveedor'); } }
}
