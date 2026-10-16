import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ActivoDto, CatalogoQueryDto, ColorQueryDto, CreateCatalogoDto, CreateColorDto, UpdateCatalogoDto, UpdateColorDto } from './catalogos.dto';
import { CatalogosService } from './catalogos.service';

@Controller('catalogos')
export class CatalogosController {
  constructor(private readonly service: CatalogosService) {}
  @Get('colores') colores(@Query() q: ColorQueryDto) { return this.service.colores(q); }
  @Post('colores') crearColor(@Body() dto: CreateColorDto) { return this.service.crearColor(dto); }
  @Patch('colores/:id') actualizarColor(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateColorDto) { return this.service.actualizarColor(id, dto); }
  @Patch('colores/:id/activo') activoColor(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ActivoDto) { return this.service.activarColor(id, dto.activo); }

  @Get('tallas') tallas(@Query() q: CatalogoQueryDto) { return this.service.tallas(q); }
  @Post('tallas') crearTalla(@Body() dto: CreateCatalogoDto) { return this.service.crearTalla(dto); }
  @Patch('tallas/:id') actualizarTalla(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCatalogoDto) { return this.service.actualizarTalla(id, dto); }
  @Patch('tallas/:id/activo') activoTalla(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ActivoDto) { return this.service.actualizarTalla(id, dto); }

  @Get('tipografias') tipografias(@Query() q: CatalogoQueryDto) { return this.service.tipografias(q); }
  @Post('tipografias') crearTipografia(@Body() dto: CreateCatalogoDto) { return this.service.crearTipografia(dto); }
  @Patch('tipografias/:id') actualizarTipografia(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCatalogoDto) { return this.service.actualizarTipografia(id, dto); }
  @Patch('tipografias/:id/activo') activoTipografia(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ActivoDto) { return this.service.actualizarTipografia(id, dto); }

  @Get('tipos-encaje') tiposEncaje(@Query() q: CatalogoQueryDto) { return this.service.tiposEncaje(q); }
  @Post('tipos-encaje') crearTipoEncaje(@Body() dto: CreateCatalogoDto) { return this.service.crearTipoEncaje(dto); }
  @Patch('tipos-encaje/:id') actualizarTipoEncaje(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCatalogoDto) { return this.service.actualizarTipoEncaje(id, dto); }
  @Patch('tipos-encaje/:id/activo') activoTipoEncaje(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ActivoDto) { return this.service.actualizarTipoEncaje(id, dto); }
}
