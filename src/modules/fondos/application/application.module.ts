// src/modules/clientes/application/application.module.ts
import { Module } from '@nestjs/common';
import { FondoUseCasesImpl,IFondoUseCases } from './use-cases/fondos.use-case.impl';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule], // Para poder usar los repositorios
  providers: [
    {
      provide: IFondoUseCases,
      useClass: FondoUseCasesImpl,
    },
  ],
  exports: [IFondoUseCases], // Para que el controlador u otros módulos puedan inyectarlo
})
export class ApplicationModule {}
