// src/modules/fondos/presentation/presentation.module.ts
import { Module } from '@nestjs/common';
import { FondosController } from './controllers/fondos.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [FondosController],
})
export class PresentationModule {}
