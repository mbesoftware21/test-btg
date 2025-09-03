// src/modules/clientes/application/application.module.ts
import { Module } from '@nestjs/common';
import { ITransaccionUseCases } from './use-cases/transacciones.use-case';
import { TransaccionUseCasesImpl } from './use-cases/transacciones.use-case.impl';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule], // Para poder usar los repositorios
  providers: [
    {
      provide: ITransaccionUseCases,
      useClass: TransaccionUseCasesImpl,
    },
  ],
  exports: [ITransaccionUseCases], // Para que el controlador u otros módulos puedan inyectarlo
})
export class ApplicationModule {}
