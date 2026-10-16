import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './auth.dto';

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  activo: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    const validPassword = usuario ? await bcrypt.compare(dto.password, usuario.passwordHash) : false;

    if (!usuario || !usuario.activo || !validPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const user = this.toPublicUser(usuario);
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { access_token: accessToken, usuario: user };
  }

  toPublicUser(usuario: AuthUser): AuthUser {
    return { id: usuario.id, email: usuario.email, nombre: usuario.nombre, activo: usuario.activo };
  }

  async me(userId: string): Promise<AuthUser> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!usuario || !usuario.activo) throw new UnauthorizedException('Credenciales inválidas');
    return this.toPublicUser(usuario);
  }
}
