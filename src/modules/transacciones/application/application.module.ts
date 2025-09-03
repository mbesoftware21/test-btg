// src/modules/transacciones/application/application.module.ts
import { Module } from '@nestjs/common';
import { ITransaccionUseCases } from './use-cases/transacciones.use-case';
import { TransaccionUseCasesImpl } from './use-cases/transacciones.use-case.impl';

// Infraestructura de transacciones
import { InfrastructureModule as TransaccionesInfrastructureModule  } from '../infrastructure/infrastructure.module';

// Infraestructura de clientes y fondos
import { InfrastructureModule as ClientesInfrastructureModule } from 'src/modules/clientes/infrastructure/infrastructure.module';
import { InfrastructureModule as FondosInfrastructureModule } from 'src/modules/fondos/infrastructure/infrastructure.module';

@Module({
  imports: [
    TransaccionesInfrastructureModule,
    ClientesInfrastructureModule,
    FondosInfrastructureModule,
  ],
  providers: [
    {
      provide: ITransaccionUseCases,
      useClass: TransaccionUseCasesImpl,
    },
  ],
  exports: [ITransaccionUseCases],
})
export class ApplicationModule {}
