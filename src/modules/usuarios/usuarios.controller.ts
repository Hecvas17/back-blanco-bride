import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateUsuarioDto, UpdateUsuarioActivoDto, UpdateUsuarioDto, UpdateUsuarioPasswordDto, UsuariosQueryDto } from './usuarios.dto';
import { UsuariosService } from './usuarios.service';

type AuthenticatedRequest = Request & { user: { id: string } };

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Get()
  listar(@Query() query: UsuariosQueryDto) { return this.service.listar(query); }

  @Get(':id')
  obtener(@Param('id', ParseUUIDPipe) id: string) { return this.service.obtener(id); }

  @Post()
  crear(@Body() dto: CreateUsuarioDto) { return this.service.crear(dto); }

  @Patch(':id')
  actualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUsuarioDto) { return this.service.actualizar(id, dto); }

  @Patch(':id/activo')
  actualizarActivo(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUsuarioActivoDto, @Req() request: AuthenticatedRequest) { return this.service.actualizarActivo(id, dto.activo, request.user.id); }

  @Patch(':id/password')
  actualizarPassword(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUsuarioPasswordDto) { return this.service.actualizarPassword(id, dto.password); }
}
