// src/modules/transacciones/application/use-cases/transacciones.use-case.ts
import { TransaccionEntity } from '../../domain/entities/transaccion.entity';

export abstract class ITransaccionUseCases {
  /**
   * Registra una transacción de apertura o cancelación
   */
  abstract registrarTransaccion(transaccion: TransaccionEntity): Promise<TransaccionEntity>;

  /**
   * Obtiene todas las transacciones de un cliente
   */
  abstract obtenerTransaccionesPorCliente(clienteId: string): Promise<TransaccionEntity[]>;
}
