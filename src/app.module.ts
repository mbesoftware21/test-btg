import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientesModule } from './modules/clientes/clientes.module';
import { FondosModule } from './modules/fondos/fondos.module';
import { TransaccionesModule } from './modules/transacciones/transacciones.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ClientesModule,
    FondosModule,
    TransaccionesModule,
    AuthModule,
    DatabaseModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
