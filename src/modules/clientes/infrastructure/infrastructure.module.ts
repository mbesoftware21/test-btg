import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {Cliente,ClienteDocument,ClienteSchema} from './shemas/cliente.schema';
import { IClienteRepository } from './repositories/cliente.repository';
import { ClienteRepositoryImpl } from './repositories/cliente.repository.impl';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cliente.name, schema: ClienteSchema }]),
  ],
  providers: [
    {
      provide: IClienteRepository,
      useClass: ClienteRepositoryImpl,
    },
  ],
  exports: [IClienteRepository], 
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