// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthUseCasesImpl } from './application/use-cases/auth.use-case.impl';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { AuthController } from './presentation/controllers/auth.controller';
import { ApplicationModule as ClientesAppModule } from '../clientes/application/application.module';

@Module({
  imports: [
    ClientesAppModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthUseCasesImpl, JwtStrategy, RolesGuard],
  exports: [AuthUseCasesImpl],
})
export class AuthModule {}
