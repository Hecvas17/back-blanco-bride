import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { booleanQuery } from '../../common/api';
import { CreateUsuarioDto, UpdateUsuarioDto, UsuariosQueryDto } from './usuarios.dto';

type PublicUsuario = {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
};

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  private publicUser(user: PublicUsuario): PublicUsuario {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      activo: user.activo,
      creadoEn: user.creadoEn,
      actualizadoEn: user.actualizadoEn,
    };
  }

  async listar(query: UsuariosQueryDto): Promise<PublicUsuario[]> {
    const users = await this.prisma.usuario.findMany({
      where: {
        activo: booleanQuery(query.activo),
        OR: query.buscar ? [
          { nombre: { contains: query.buscar, mode: 'insensitive' } },
          { email: { contains: query.buscar, mode: 'insensitive' } },
        ] : undefined,
      },
      orderBy: { nombre: 'asc' },
    });
    return users.map((user) => this.publicUser(user));
  }

  async obtener(id: string): Promise<PublicUsuario> {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.publicUser(user);
  }

  async crear(dto: CreateUsuarioDto): Promise<PublicUsuario> {
    const email = dto.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(dto.password, 12);
    try {
      const user = await this.prisma.usuario.create({
        data: { nombre: dto.nombre.trim(), email, passwordHash, activo: dto.activo ?? true },
      });
      return this.publicUser(user);
    } catch (error) {
      this.handleEmailConflict(error);
    }
  }

  async actualizar(id: string, dto: UpdateUsuarioDto): Promise<PublicUsuario> {
    const data: Prisma.UsuarioUpdateInput = {
      nombre: dto.nombre?.trim(),
      email: dto.email?.trim().toLowerCase(),
    };
    try {
      const user = await this.prisma.usuario.update({ where: { id }, data });
      return this.publicUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Usuario no encontrado');
      }
      this.handleEmailConflict(error);
    }
  }

  async actualizarActivo(id: string, activo: boolean, currentUserId: string): Promise<PublicUsuario> {
    if (id === currentUserId && !activo) throw new BadRequestException('Tu usuario no puede desactivarse a sí mismo');
    try {
      const user = await this.prisma.usuario.update({ where: { id }, data: { activo } });
      return this.publicUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw error;
    }
  }

  async actualizarPassword(id: string, password: string): Promise<PublicUsuario> {
    const passwordHash = await bcrypt.hash(password, 12);
    try {
      const user = await this.prisma.usuario.update({ where: { id }, data: { passwordHash } });
      return this.publicUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw error;
    }
  }

  private handleEmailConflict(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('El correo ya está registrado');
    }
    throw error;
  }
}
