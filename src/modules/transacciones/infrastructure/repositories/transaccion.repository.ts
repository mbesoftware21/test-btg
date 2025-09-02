import { TransaccionEntity } from "../../domain/entities/transaccion.entity";

export abstract class ITransaccionRepository {
  /**
   * Registra una transacción (apertura o cancelación)
   */
  abstract registrar(transaccion: TransaccionEntity): Promise<TransaccionEntity>;

  /**
   * Obtiene todas las transacciones de un cliente
   */
  abstract obtenerPorCliente(clienteId: string): Promise<TransaccionEntity[]>;
}
