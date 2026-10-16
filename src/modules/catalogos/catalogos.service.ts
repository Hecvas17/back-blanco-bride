import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { booleanQuery, handlePrismaError } from '../../common/api';
import { CreateCatalogoDto, CreateColorDto, UpdateCatalogoDto, UpdateColorDto } from './catalogos.dto';

@Injectable()
export class CatalogosService {
  constructor(private readonly prisma: PrismaService) {}

  async colores(query: { activo?: string | boolean; disponibleProducto?: string | boolean; disponibleBordado?: string | boolean; buscar?: string }) {
    return this.prisma.color.findMany({
      where: {
        activo: booleanQuery(query.activo),
        disponibleProducto: booleanQuery(query.disponibleProducto),
        disponibleBordado: booleanQuery(query.disponibleBordado),
        nombre: query.buscar ? { contains: query.buscar, mode: 'insensitive' } : undefined,
      }, orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
    });
  }
  async crearColor(dto: CreateColorDto) { try { return await this.prisma.color.create({ data: dto }); } catch (e) { return handlePrismaError(e, 'color'); } }
  async actualizarColor(id: string, dto: UpdateColorDto) { try { return await this.prisma.color.update({ where: { id }, data: dto }); } catch (e) { return handlePrismaError(e, 'color'); } }
  async activarColor(id: string, activo: boolean) { return this.actualizarColor(id, { activo }); }

  async tallas(query: { activo?: string | boolean; buscar?: string }) { return this.prisma.talla.findMany({ where: { activo: booleanQuery(query.activo), nombre: query.buscar ? { contains: query.buscar, mode: 'insensitive' } : undefined }, orderBy: [{ orden: 'asc' }, { nombre: 'asc' }] }); }
  async crearTalla(dto: CreateCatalogoDto) { try { return await this.prisma.talla.create({ data: { nombre: dto.nombre, orden: dto.orden, activo: dto.activo } }); } catch (e) { return handlePrismaError(e, 'talla'); } }
  async actualizarTalla(id: string, dto: UpdateCatalogoDto) { try { return await this.prisma.talla.update({ where: { id }, data: { nombre: dto.nombre, orden: dto.orden, activo: dto.activo } }); } catch (e) { return handlePrismaError(e, 'talla'); } }

  async tipografias(query: { activo?: string | boolean; buscar?: string }) { return this.prisma.tipografia.findMany({ where: { activo: booleanQuery(query.activo), nombre: query.buscar ? { contains: query.buscar, mode: 'insensitive' } : undefined }, orderBy: [{ orden: 'asc' }, { nombre: 'asc' }] }); }
  async crearTipografia(dto: CreateCatalogoDto) { try { return await this.prisma.tipografia.create({ data: dto }); } catch (e) { return handlePrismaError(e, 'tipografía'); } }
  async actualizarTipografia(id: string, dto: UpdateCatalogoDto) { try { return await this.prisma.tipografia.update({ where: { id }, data: dto }); } catch (e) { return handlePrismaError(e, 'tipografía'); } }

  async tiposEncaje(query: { activo?: string | boolean; buscar?: string }) { return this.prisma.tipoEncaje.findMany({ where: { activo: booleanQuery(query.activo), nombre: query.buscar ? { contains: query.buscar, mode: 'insensitive' } : undefined }, orderBy: [{ orden: 'asc' }, { nombre: 'asc' }] }); }
  async crearTipoEncaje(dto: CreateCatalogoDto) { try { return await this.prisma.tipoEncaje.create({ data: { nombre: dto.nombre, orden: dto.orden, activo: dto.activo } }); } catch (e) { return handlePrismaError(e, 'tipo de encaje'); } }
  async actualizarTipoEncaje(id: string, dto: UpdateCatalogoDto) { try { return await this.prisma.tipoEncaje.update({ where: { id }, data: { nombre: dto.nombre, orden: dto.orden, activo: dto.activo } }); } catch (e) { return handlePrismaError(e, 'tipo de encaje'); } }
}
