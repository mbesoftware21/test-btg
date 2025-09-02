// src/modules/clientes/infrastructure/repositories/cliente.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClienteEntity } from '../../domain/entities/cliente.entity';
import { IClienteRepository } from './cliente.repository';
import { Cliente, ClienteDocument } from '../shemas/cliente.schema';

@Injectable()
export class ClienteRepositoryImpl implements IClienteRepository {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<ClienteDocument>,
  ) {}

  async crear(cliente: ClienteEntity): Promise<ClienteEntity> {
    const nuevo = new this.clienteModel(cliente);
    return nuevo.save() as any ; 
  }

  async obtenerPorId(id: string): Promise<ClienteEntity | null> {
    return this.clienteModel.findById(id).exec() as any;
  }

  async obtenerPorEmail(email: string): Promise<ClienteEntity | null> {
    return this.clienteModel.findOne({ email }).exec() as any;
  }

  async actualizar(cliente: ClienteEntity): Promise<ClienteEntity> {
    return this.clienteModel
      .findByIdAndUpdate(cliente.id, cliente, { new: true })
      .exec() as any ;
  }

  async eliminar(id: string): Promise<void> {
    await this.clienteModel.findByIdAndDelete(id).exec();
  }

  async listarTodos(): Promise<ClienteEntity[]> {
    return this.clienteModel.find().exec() as any;
  }
}
