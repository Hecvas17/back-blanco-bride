import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { booleanQuery, handlePrismaError } from '../../common/api';
import { CreateClienteDto, UpdateClienteDto } from './clientes.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}
  listar(query: { activo?: boolean; buscar?: string }) { return this.prisma.cliente.findMany({ where: { activo: booleanQuery(query.activo), OR: query.buscar ? [{ nombre: { contains: query.buscar, mode: 'insensitive' } }, { telefono: { contains: query.buscar, mode: 'insensitive' } }, { correo: { contains: query.buscar, mode: 'insensitive' } }] : undefined }, orderBy: { nombre: 'asc' } }); }
  async uno(id: string) { const row = await this.prisma.cliente.findUnique({ where: { id } }); if (!row) throw new NotFoundException('Cliente no encontrado'); return row; }
  async crear(dto: CreateClienteDto) { try { return await this.prisma.cliente.create({ data: dto }); } catch (e) { return handlePrismaError(e, 'cliente'); } }
  async actualizar(id: string, dto: UpdateClienteDto) { try { return await this.prisma.cliente.update({ where: { id }, data: dto }); } catch (e) { return handlePrismaError(e, 'cliente'); } }
}
