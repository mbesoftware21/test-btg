import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {Fondo,FondoDocument,FondoSchema} from './fondo.schema';
import { FondoRepository } from './repositories/fondo.repository';
import { FondoRepositoryImpl } from './repositories/fondo.repository.impl';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fondo.name, schema: FondoSchema }]),
  ],
  providers: [
    {
      provide: FondoRepository,
      useClass: FondoRepositoryImpl,
    },
  ],
  exports: [FondoRepository], 
})

export class InfrastructureModule {}
