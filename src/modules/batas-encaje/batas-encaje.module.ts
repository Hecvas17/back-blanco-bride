import { Module } from '@nestjs/common';
import { BatasEncajeController } from './batas-encaje.controller';
import { BatasEncajeService } from './batas-encaje.service';

@Module({ controllers: [BatasEncajeController], providers: [BatasEncajeService] })
export class BatasEncajeModule {}
