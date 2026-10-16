import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateAdicionalDto, CreatePedidoDto, CreateProductoDto, EstatusPedidoDto, EstatusProveedorDto, PedidosQueryDto, UpdateAdicionalDto, UpdatePedidoDto } from './pedidos.dto';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly service: PedidosService) {}
  @Get() listar(@Query() q: PedidosQueryDto) { return this.service.listar(q); }
  @Get(':id') uno(@Param('id', ParseUUIDPipe) id: string) { return this.service.uno(id); }
  @Post() crear(@Body() dto: CreatePedidoDto) { return this.service.crear(dto); }
  @Patch(':id') actualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePedidoDto) { return this.service.actualizar(id, dto); }
  @Patch(':id/estatus') estatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: EstatusPedidoDto) { return this.service.estatus(id, dto.estatus); }

  @Post(':pedidoId/productos') agregarProducto(@Param('pedidoId', ParseUUIDPipe) pedidoId: string, @Body() dto: CreateProductoDto) { return this.service.agregarProducto(pedidoId, dto); }
  @Patch(':pedidoId/productos/:productoId') actualizarProducto(@Param('pedidoId', ParseUUIDPipe) pedidoId: string, @Param('productoId', ParseUUIDPipe) productoId: string, @Body() dto: CreateProductoDto) { return this.service.actualizarProducto(pedidoId, productoId, dto); }
  @Delete(':pedidoId/productos/:productoId') eliminarProducto(@Param('pedidoId', ParseUUIDPipe) pedidoId: string, @Param('productoId', ParseUUIDPipe) productoId: string) { return this.service.eliminarProducto(pedidoId, productoId); }
  @Patch(':pedidoId/productos/:productoId/estatus-proveedor') estatusProveedor(@Param('pedidoId', ParseUUIDPipe) pedidoId: string, @Param('productoId', ParseUUIDPipe) productoId: string, @Body() dto: EstatusProveedorDto) { return this.service.estatusProveedor(pedidoId, productoId, dto.estatusProveedor); }

  @Get(':pedidoId/adicionales') adicionales(@Param('pedidoId', ParseUUIDPipe) pedidoId: string) { return this.service.adicionales(pedidoId); }
  @Get(':pedidoId/adicionales/:adicionalId') adicional(@Param('pedidoId', ParseUUIDPipe) pedidoId: string, @Param('adicionalId', ParseUUIDPipe) adicionalId: string) { return this.service.adicional(pedidoId, adicionalId); }
  @Post(':pedidoId/adicionales') crearAdicional(@Param('pedidoId', ParseUUIDPipe) pedidoId: string, @Body() dto: CreateAdicionalDto) { return this.service.crearAdicional(pedidoId, dto); }
  @Patch(':pedidoId/adicionales/:adicionalId') actualizarAdicional(@Param('pedidoId', ParseUUIDPipe) pedidoId: string, @Param('adicionalId', ParseUUIDPipe) adicionalId: string, @Body() dto: UpdateAdicionalDto) { return this.service.actualizarAdicional(pedidoId, adicionalId, dto); }
  @Delete(':pedidoId/adicionales/:adicionalId') eliminarAdicional(@Param('pedidoId', ParseUUIDPipe) pedidoId: string, @Param('adicionalId', ParseUUIDPipe) adicionalId: string) { return this.service.eliminarAdicional(pedidoId, adicionalId); }
}
