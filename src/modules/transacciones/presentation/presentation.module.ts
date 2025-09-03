// src/modules/transacciones/presentation/presentation.module.ts
import { Module } from '@nestjs/common';
import { TransaccionesController } from './controllers/transacciones.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [TransaccionesController],
})
export class PresentationModule {}
