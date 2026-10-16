import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogosModule } from './modules/catalogos/catalogos.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ProveedoresModule } from './modules/proveedores/proveedores.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { BatasEncajeModule } from './modules/batas-encaje/batas-encaje.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsuariosModule } from './modules/usuarios/usuarios.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, HealthModule, CatalogosModule, ClientesModule, ProveedoresModule, PedidosModule, BatasEncajeModule, UsuariosModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
