import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto, ProveedoresQueryDto, UpdateProveedorDto } from './proveedores.dto';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly service: ProveedoresService) {}
  @Get() listar(@Query() q: ProveedoresQueryDto) { return this.service.listar(q); }
  @Get(':id') uno(@Param('id', ParseUUIDPipe) id: string) { return this.service.uno(id); }
  @Post() crear(@Body() dto: CreateProveedorDto) { return this.service.crear(dto); }
  @Patch(':id') actualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProveedorDto) { return this.service.actualizar(id, dto); }
  @Patch(':id/activo') activo(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { activo: boolean }) { return this.service.actualizar(id, dto); }
}
