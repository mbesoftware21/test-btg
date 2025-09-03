// src/modules/clientes/presentation/presentation.module.ts
import { Module } from '@nestjs/common';
import { ClientesController } from './controllers/clientes.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule], // Importa la capa de aplicación para inyectar los casos de uso
  controllers: [ClientesController], // Registra el controlador de clientes
})
export class PresentationModule {}
