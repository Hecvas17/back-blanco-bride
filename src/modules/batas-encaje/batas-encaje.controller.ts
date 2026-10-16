import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query } from '@nestjs/common';
import { BatasEncajeQueryDto, EstatusBataDto, TipoEncajeDto } from './batas-encaje.dto';
import { BatasEncajeService } from './batas-encaje.service';

@Controller('batas-encaje')
export class BatasEncajeController {
  constructor(private readonly service: BatasEncajeService) {}
  @Get() listar(@Query() q: BatasEncajeQueryDto) { return this.service.listar(q); }
  @Patch(':productoId/estatus') estatus(@Param('productoId', ParseUUIDPipe) id: string, @Body() dto: EstatusBataDto) { return this.service.estatus(id, dto.estatusBataEncaje); }
  @Patch(':productoId/tipo-encaje') tipoEncaje(@Param('productoId', ParseUUIDPipe) id: string, @Body() dto: TipoEncajeDto) { return this.service.tipoEncaje(id, dto.tipoEncajeId); }
}
