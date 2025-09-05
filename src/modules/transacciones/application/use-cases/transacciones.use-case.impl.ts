import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ITransaccionUseCases } from './transacciones.use-case';
import { ITransaccionRepository } from '../../infrastructure/repositories/transaccion.repository';
import { TransaccionEntity } from '../../domain/entities/transaccion.entity';
import { IClienteRepository } from '../../../clientes/infrastructure/repositories/cliente.repository';
import { FondoRepository } from '../../../fondos/infrastructure/repositories/fondo.repository';
import { Fondo } from 'src/modules/fondos/domain/entities/fondo.entity';

@Injectable()
export class TransaccionUseCasesImpl implements ITransaccionUseCases {
  private readonly logger = new Logger(TransaccionUseCasesImpl.name);

  constructor(
    private readonly transaccionRepository: ITransaccionRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly fondoRepository: FondoRepository,
  ) {}

  async registrarTransaccion(transaccion: TransaccionEntity): Promise<TransaccionEntity> {

    // 1. Validar que el cliente exista
    const cliente = await this.clienteRepository.obtenerPorId(transaccion.clienteId);
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${transaccion.clienteId} no encontrado`);
    }

    // 2. Validar que el fondo exista
    const fondo: Fondo | any = await this.fondoRepository.findById(transaccion.fondoId);

    if (!fondo) {
      throw new NotFoundException(`Fondo con id ${transaccion.fondoId} no encontrado`);
    }

    let transaccionRegistrada: TransaccionEntity;

    // 3. Lógica según tipo de transacción
    if (transaccion.tipo === 'apertura') {
      if (transaccion.monto < fondo.montoMinimo) {
        throw new BadRequestException(`El monto debe ser al menos ${fondo.montoMinimo}`);
      }

      if (cliente.saldo < transaccion.monto) {
        throw new BadRequestException('Saldo insuficiente');
      }

      // Restar saldo al cliente
      cliente.saldo -= transaccion.monto;
      await this.clienteRepository.actualizar(cliente);

      transaccionRegistrada = await this.transaccionRepository.registrar(transaccion);

      // 🔔 Notificación fake
      this.logger.log(
        `[NOTIFICACIÓN] Cliente ${cliente.id} suscrito al fondo ${fondo.nombre} por ${transaccion.monto}`,
      );

    } else if (transaccion.tipo === 'cancelacion') {
      const transaccionesPrevias = await this.transaccionRepository.obtenerPorCliente(transaccion.clienteId);
      const apertura = transaccionesPrevias.find(
        (t) => t.fondoId === transaccion.fondoId && t.tipo === 'apertura',
      );

      if (!apertura) {
        throw new BadRequestException('No existe una apertura previa de este fondo para cancelar');
      }

      // Devolver saldo al cliente
      cliente.saldo += apertura.monto;
      await this.clienteRepository.actualizar(cliente);

      transaccionRegistrada = await this.transaccionRepository.registrar(transaccion);

      // 🔔 Notificación fake
      this.logger.log(
        `[NOTIFICACIÓN] Cliente ${cliente.id} canceló su suscripción al fondo ${fondo.nombre}. Saldo devuelto: ${apertura.monto}`,
      );

    } else {
      throw new BadRequestException('Tipo de transacción no válido');
    }

    return transaccionRegistrada;
  }

  async obtenerTransaccionesPorCliente(clienteId: string): Promise<TransaccionEntity[]> {
    return this.transaccionRepository.obtenerPorCliente(clienteId);
  }
}
