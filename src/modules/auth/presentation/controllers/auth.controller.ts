// src/modules/auth/presentation/auth.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthUseCasesImpl } from '../../application/use-cases/auth.use-case.impl';
import { ClienteEntity } from '../../../clientes/domain/entities/cliente.entity';
import { ClienteDto } from 'src/modules/clientes/presentation/dtos/cliente.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCases: AuthUseCasesImpl) {}

  @Post('register')
  async registrar(@Body() clienteDto: ClienteDto) {
    if (!clienteDto.password) {
      throw new BadRequestException('El password es obligatorio para el registro');
    }

    const cliente = new ClienteEntity({
      nombre: clienteDto.nombre,
      email: clienteDto.email,
      telefono: clienteDto.telefono,
      saldo: 500_000,
      preferencias: clienteDto.preferencias || [],
      password: clienteDto.password,
      roles: clienteDto.roles as string[],
    });

    return this.authUseCases.registrar(cliente);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authUseCases.login(loginDto.email, loginDto.password);
  }
}
