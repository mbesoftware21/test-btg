// src/modules/clientes/application/use-cases/clientes.use-case.impl.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IClienteUseCases } from './clientes.use-case';
import { IClienteRepository } from '../../infrastructure/repositories/cliente.repository';
import { ClienteEntity } from '../../domain/entities/cliente.entity';

@Injectable()
export class ClienteUseCasesImpl implements IClienteUseCases {
  constructor(private readonly clienteRepo: IClienteRepository) {}

  async crearCliente(cliente: ClienteEntity): Promise<ClienteEntity> {
    const existente = await this.clienteRepo.obtenerPorEmail(cliente.email);
    if (existente) {
      throw new BadRequestException(`El email ${cliente.email} ya está registrado.`);
    }
    return this.clienteRepo.crear(cliente);
  }

  async obtenerClientePorId(id: string): Promise<ClienteEntity> {
    const cliente = await this.clienteRepo.obtenerPorId(id);
    if (!cliente) throw new NotFoundException(`Cliente con id ${id} no encontrado.`);
    return cliente;
  }

  async obtenerClientePorEmail(email: string): Promise<ClienteEntity> {
    const cliente = await this.clienteRepo.obtenerPorEmail(email);
    if (!cliente) throw new NotFoundException(`Cliente con email ${email} no encontrado.`);
    return cliente;
  }

  async actualizarCliente(cliente: ClienteEntity): Promise<ClienteEntity> {
    const existente = await this.clienteRepo.obtenerPorId(cliente.id as any);
    if (!existente) throw new NotFoundException(`Cliente con id ${cliente.id} no encontrado.`);
    return this.clienteRepo.actualizar(cliente);
  }

  async eliminarCliente(id: string): Promise<void> {
    const existente = await this.clienteRepo.obtenerPorId(id);
    if (!existente) throw new NotFoundException(`Cliente con id ${id} no encontrado.`);
    await this.clienteRepo.eliminar(id);
  }

  async listarClientes(): Promise<ClienteEntity[]> {
    return this.clienteRepo.listarTodos();
  }
}
