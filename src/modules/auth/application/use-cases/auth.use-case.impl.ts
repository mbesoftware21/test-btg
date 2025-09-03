// src/modules/auth/application/use-cases/auth.use-case.impl.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { IClienteUseCases } from '../../../clientes/application/use-cases/clientes.use-case';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClienteEntity } from '../../../clientes/domain/entities/cliente.entity';

// DTO para la respuesta de login
export class LoginResponseDto {
  access_token: string;
}

@Injectable()
export class AuthUseCasesImpl {
  constructor(
    private readonly clienteUseCases: IClienteUseCases,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra un cliente
   * @param cliente ClienteEntity con datos a registrar
   */
  async registrar(cliente: ClienteEntity): Promise<ClienteEntity> {
    // Verifica si ya existe un cliente con el mismo email
    const existente = await this.clienteUseCases
      .obtenerClientePorEmail(cliente.email)
      .catch(() => null);
    if (existente) throw new BadRequestException('Email ya registrado');

    // Hashear password
    cliente.password = await bcrypt.hash(cliente.password, 10);

    // Crear el cliente usando el módulo de clientes
    return this.clienteUseCases.crearCliente(cliente);
  }

  /**
   * Login de un cliente
   * @param email Email del cliente
   * @param password Password en texto plano
   */
  async login(email: string, password: string): Promise<LoginResponseDto> {
    // Obtener cliente por email
    const cliente:any = await this.clienteUseCases.obtenerClientePorEmail(email);
    if (!cliente) throw new UnauthorizedException('Credenciales inválidas');

    // Verificar password
    const valid = await bcrypt.compare(password.toString(), cliente.password.toString());
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    // Generar JWT, incluyendo roles dinámicos si existen
    const payload = { sub: cliente.id, email: cliente.email, roles: cliente.roles || ['cliente'] };

    return { access_token: this.jwtService.sign(payload) };
  }
}
