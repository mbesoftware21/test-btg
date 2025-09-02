// clientes.module.ts
import { Module } from '@nestjs/common';
import { PresentationModule } from './presentation/presentation.module';
import { DomainModule } from './domain/domain.module';
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
    imports: [
        PresentationModule,
        DomainModule,
        ApplicationModule,
        InfrastructureModule],
})
export class AuthModule {}
