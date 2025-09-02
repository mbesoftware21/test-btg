// src/modules/fondos/infrastructure/repositories/fondo.repository.impl.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fondo } from '../../domain/entities/fondo.entity';
import { FondoRepository } from './fondo.repository';
import { FondoDocument } from '../fondo.schema';

@Injectable()
export class FondoRepositoryImpl extends FondoRepository {
  constructor(@InjectModel('Fondo') private readonly fondoModel: Model<FondoDocument>) {
    super();
  }

  async findById(id: string): Promise<Fondo | null> {
    return this.fondoModel.findById(id).exec() as any;
  }

  async findAll(): Promise<Fondo[]> {
    return this.fondoModel.find().exec() as any;
  }

  async create(fondo: Fondo): Promise<Fondo> {
    const createdFondo = new this.fondoModel(fondo);
    return createdFondo.save() as any;
  }

  async update(fondo: Fondo): Promise<Fondo> {
    const updated = await this.fondoModel.findByIdAndUpdate(fondo._id, fondo, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Fondo con id ${fondo._id} no encontrado`);
    }
    return updated as any;
  }

  async delete(id: string): Promise<void> {
    const result = await this.fondoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Fondo con id ${id} no encontrado`);
    }
  }
}
