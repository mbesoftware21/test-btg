// src/modules/clientes/application/application.module.ts
import { Module } from '@nestjs/common';
import { IClienteUseCases } from './use-cases/clientes.use-case';
import { ClienteUseCasesImpl } from './use-cases/clientes.use-case.impl';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule], // Para poder usar los repositorios
  providers: [
    {
      provide: IClienteUseCases,
      useClass: ClienteUseCasesImpl,
    },
  ],
  exports: [IClienteUseCases], // Para que el controlador u otros módulos puedan inyectarlo
})
export class ApplicationModule {}
