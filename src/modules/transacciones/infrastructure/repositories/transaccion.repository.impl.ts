import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransaccionRepository } from './transaccion.repository';
import { Transaccion, TransaccionDocument } from '../shemas/transaccion.schema';
import { TransaccionEntity } from '../../domain/entities/transaccion.entity';

@Injectable()
export class TransaccionRepositoryImpl implements ITransaccionRepository {
  constructor(
    @InjectModel(Transaccion.name) private transaccionModel: Model<TransaccionDocument>,
  ) {}

  async registrar(transaccion: TransaccionEntity): Promise<TransaccionEntity> {
    const nueva = new this.transaccionModel(transaccion);
    return nueva.save();
  }

  async obtenerPorCliente(clienteId: string): Promise<TransaccionEntity[]> {
    return this.transaccionModel.find({ clienteId }).exec();
  }
}
