import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaccion, TransaccionSchema } from './shemas/transaccion.schema';
import { ITransaccionRepository } from './repositories/transaccion.repository';
import { TransaccionRepositoryImpl } from './repositories/transaccion.repository.impl';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaccion.name, schema: TransaccionSchema }]),
  ],
  providers: [
    {
      provide: ITransaccionRepository,
      useClass: TransaccionRepositoryImpl,
    },
  ],
  exports: [ITransaccionRepository], 
})
export class InfrastructureModule {}

// https://taxxa.info/menu-manual-tecnico/ 
// https://taxxa.info/menu-manual-tecnico/
// Angela Maria Hernandez
// 15:14
// Ya los tienes en el correo
// Sebastian Botero
// 15:18
// 3175399051