# API DEMO

Base URL: `http://localhost:3000/api`

Los enums se reciben y devuelven en minúsculas (`borrador`, `bata_encaje`, `ya_llego`, etc.). Los precios y anticipos se devuelven como números JSON. `fechaEvento` usa `YYYY-MM-DD`.

## Catálogos

- `GET /catalogos/colores?activo=true&buscar=rosa&disponibleBordado=true`
- `POST /catalogos/colores` — `{ nombre, disponibleProducto, disponibleBordado, activo?, orden? }`
- `PATCH /catalogos/colores/:id` y `PATCH /catalogos/colores/:id/activo` — edición o `{ activo }`
- `GET|POST /catalogos/tallas`, `PATCH /catalogos/tallas/:id`, `PATCH /catalogos/tallas/:id/activo`
- `GET|POST /catalogos/tipografias`, `PATCH /catalogos/tipografias/:id`, `PATCH /catalogos/tipografias/:id/activo`
- `GET|POST /catalogos/tipos-encaje`, `PATCH /catalogos/tipos-encaje/:id`, `PATCH /catalogos/tipos-encaje/:id/activo`

Los catálogos aceptan `nombre`, `orden`, `activo`; tipografías también aceptan `muestra`.

## Clientes y proveedores

- `GET /clientes?activo=true&buscar=maria`
- `GET|POST /clientes/:id` / `POST /clientes`
- `PATCH /clientes/:id` y `PATCH /clientes/:id/activo`
- `GET /proveedores?activo=true&buscar=batas`
- `GET|POST /proveedores/:id` / `POST /proveedores`
- `PATCH /proveedores/:id` y `PATCH /proveedores/:id/activo`

## Pedidos

- `GET /pedidos?estatus=borrador&buscar=PED-0001`
- `GET /pedidos/:id`
- `POST /pedidos` — datos generales más `productos: [...]`; genera folio y crea todo en una transacción.
- `PATCH /pedidos/:id` — datos generales.
- `PATCH /pedidos/:id/estatus` — `{ estatus }`.
- `POST|PATCH|DELETE /pedidos/:pedidoId/productos[/:productoId]`
- `PATCH /pedidos/:pedidoId/productos/:productoId/estatus-proveedor` — `{ estatusProveedor }`

Los productos se validan según `tipo`, incluyendo catálogos activos, cantidad positiva y precio no negativo.

## Adicionales

- `GET /pedidos/:pedidoId/adicionales`
- `GET /pedidos/:pedidoId/adicionales/:adicionalId`
- `POST /pedidos/:pedidoId/adicionales` — `{ observaciones?, productos: [...] }`
- `PATCH /pedidos/:pedidoId/adicionales/:adicionalId` — puede reemplazar productos transaccionalmente.
- `DELETE /pedidos/:pedidoId/adicionales/:adicionalId`

Los folios usan `PED-0001-AD01`. Sus productos conservan el `pedidoId` padre y tienen `adicionalId`.

## Batas de encaje

- `GET /batas-encaje?buscar=&estatus=solicitada&tipoEncajeId=&tallaId=&pedidoId=`
- `PATCH /batas-encaje/:productoId/estatus` — `{ estatusBataEncaje }`
- `PATCH /batas-encaje/:productoId/tipo-encaje` — `{ tipoEncajeId }`

Es una fachada sobre `pedido_productos`; no existe una tabla independiente.

## Errores y pendientes

Se devuelven `400`, `404` y `409` con mensajes legibles. No hay autenticación, uploads, PDFs, historial ni Swagger en esta demo.
