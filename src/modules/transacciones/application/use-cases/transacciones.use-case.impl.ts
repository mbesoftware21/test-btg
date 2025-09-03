// src/modules/transacciones/application/use-cases/transacciones.use-case.impl.ts
import { Injectable } from '@nestjs/common';
import { ITransaccionUseCases } from './transacciones.use-case';
import { ITransaccionRepository } from '../../infrastructure/repositories/transaccion.repository';
import { TransaccionEntity } from '../../domain/entities/transaccion.entity';

@Injectable()
export class TransaccionUseCasesImpl implements ITransaccionUseCases {
  constructor(private readonly transaccionRepository: ITransaccionRepository) {}

  async registrarTransaccion(transaccion: TransaccionEntity): Promise<TransaccionEntity> {
    // Aquí podrías agregar lógica adicional como validación de saldo, monto mínimo, etc.
    return this.transaccionRepository.registrar(transaccion);
  }

  async obtenerTransaccionesPorCliente(clienteId: string): Promise<TransaccionEntity[]> {
    return this.transaccionRepository.obtenerPorCliente(clienteId);
  }
}
