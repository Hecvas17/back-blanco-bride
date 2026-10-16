import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesQueryDto, CreateClienteDto, UpdateClienteDto } from './clientes.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly service: ClientesService) {}
  @Get() listar(@Query() q: ClientesQueryDto) { return this.service.listar(q); }
  @Get(':id') uno(@Param('id', ParseUUIDPipe) id: string) { return this.service.uno(id); }
  @Post() crear(@Body() dto: CreateClienteDto) { return this.service.crear(dto); }
  @Patch(':id') actualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClienteDto) { return this.service.actualizar(id, dto); }
  @Patch(':id/activo') activo(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { activo: boolean }) { return this.service.actualizar(id, dto); }
}
