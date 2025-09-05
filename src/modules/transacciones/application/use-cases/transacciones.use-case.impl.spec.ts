// src/modules/transacciones/application/use-cases/transacciones.use-case.impl.spec.ts
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransaccionUseCasesImpl } from './transacciones.use-case.impl';
import { ITransaccionRepository } from '../../infrastructure/repositories/transaccion.repository';
import { IClienteRepository } from '../../../clientes/infrastructure/repositories/cliente.repository';
import { FondoRepository } from '../../../fondos/infrastructure/repositories/fondo.repository';
import { TransaccionEntity } from '../../domain/entities/transaccion.entity';

describe('TransaccionUseCasesImpl', () => {
  let useCases: TransaccionUseCasesImpl;
  let transaccionRepo: jest.Mocked<ITransaccionRepository>;
  let clienteRepo: jest.Mocked<IClienteRepository>;
  let fondoRepo: jest.Mocked<FondoRepository>;

  const cliente = { id: 'c1', saldo: 1000, email: 'test@test.com', nombre: 'Juan' } as any;
  const fondo = { id: 'f1', montoMinimo: 500, nombre: 'Fondo A' } as any;

  beforeEach(() => {
    transaccionRepo = {
      registrar: jest.fn(),
      obtenerPorCliente: jest.fn(),
    } as any;

    clienteRepo = {
      obtenerPorId: jest.fn(),
      actualizar: jest.fn(),
    } as any;

    fondoRepo = {
      findById: jest.fn(),
    } as any;

    useCases = new TransaccionUseCasesImpl(transaccionRepo, clienteRepo, fondoRepo);
  });

  describe('registrarTransaccion', () => {
    it('debe lanzar NotFound si cliente no existe', async () => {
      clienteRepo.obtenerPorId.mockResolvedValue(null);

      const tx = { clienteId: 'c1', fondoId: 'f1', tipo: 'apertura', monto: 600 } as TransaccionEntity;

      await expect(useCases.registrarTransaccion(tx)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFound si fondo no existe', async () => {
      clienteRepo.obtenerPorId.mockResolvedValue(cliente);
      fondoRepo.findById.mockResolvedValue(null);

      const tx = { clienteId: 'c1', fondoId: 'f1', tipo: 'apertura', monto: 600 } as TransaccionEntity;

      await expect(useCases.registrarTransaccion(tx)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequest si monto menor al mínimo', async () => {
      clienteRepo.obtenerPorId.mockResolvedValue(cliente);
      fondoRepo.findById.mockResolvedValue(fondo);

      const tx = { clienteId: 'c1', fondoId: 'f1', tipo: 'apertura', monto: 100 } as TransaccionEntity;

      await expect(useCases.registrarTransaccion(tx)).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar BadRequest si saldo insuficiente', async () => {
      clienteRepo.obtenerPorId.mockResolvedValue({ ...cliente, saldo: 200 });
      fondoRepo.findById.mockResolvedValue(fondo);

      const tx = { clienteId: 'c1', fondoId: 'f1', tipo: 'apertura', monto: 600 } as TransaccionEntity;

      await expect(useCases.registrarTransaccion(tx)).rejects.toThrow(BadRequestException);
    });

    it('debe registrar apertura válida', async () => {
      clienteRepo.obtenerPorId.mockResolvedValue({ ...cliente });
      fondoRepo.findById.mockResolvedValue(fondo);
      transaccionRepo.registrar.mockResolvedValue({ id: 't1' } as any);

      const tx = { clienteId: 'c1', fondoId: 'f1', tipo: 'apertura', monto: 600 } as TransaccionEntity;

      const result = await useCases.registrarTransaccion(tx);

      expect(clienteRepo.actualizar).toHaveBeenCalledWith(expect.objectContaining({ saldo: 400 }));
      expect(transaccionRepo.registrar).toHaveBeenCalledWith(tx);
      expect(result).toEqual({ id: 't1' });
    });

    it('debe lanzar BadRequest si no existe apertura previa para cancelacion', async () => {
      clienteRepo.obtenerPorId.mockResolvedValue({ ...cliente });
      fondoRepo.findById.mockResolvedValue(fondo);
      transaccionRepo.obtenerPorCliente.mockResolvedValue([]);

      const tx = { clienteId: 'c1', fondoId: 'f1', tipo: 'cancelacion', monto: 600 } as TransaccionEntity;

      await expect(useCases.registrarTransaccion(tx)).rejects.toThrow(BadRequestException);
    });

    it('debe registrar cancelacion válida', async () => {
      clienteRepo.obtenerPorId.mockResolvedValue({ ...cliente });
      fondoRepo.findById.mockResolvedValue(fondo);

      const apertura = { clienteId: 'c1', fondoId: 'f1', tipo: 'apertura', monto: 600 } as TransaccionEntity;
      transaccionRepo.obtenerPorCliente.mockResolvedValue([apertura]);
      transaccionRepo.registrar.mockResolvedValue({ id: 't2' } as any);

      const tx = { clienteId: 'c1', fondoId: 'f1', tipo: 'cancelacion', monto: 600 } as TransaccionEntity;

      const result = await useCases.registrarTransaccion(tx);

      expect(clienteRepo.actualizar).toHaveBeenCalledWith(expect.objectContaining({ saldo: 1600 }));
      expect(transaccionRepo.registrar).toHaveBeenCalledWith(tx);
      expect(result).toEqual({ id: 't2' });
    });

    it('debe lanzar BadRequest si tipo inválido', async () => {
      clienteRepo.obtenerPorId.mockResolvedValue(cliente);
      fondoRepo.findById.mockResolvedValue(fondo);

      const tx = { clienteId: 'c1', fondoId: 'f1', tipo: 'otro', monto: 100 } as any;

      await expect(useCases.registrarTransaccion(tx)).rejects.toThrow(BadRequestException);
    });
  });

  describe('obtenerTransaccionesPorCliente', () => {
    it('debe retornar lista de transacciones', async () => {
      const transacciones = [{ id: 't1' }] as any;
      transaccionRepo.obtenerPorCliente.mockResolvedValue(transacciones);

      const result = await useCases.obtenerTransaccionesPorCliente('c1');

      expect(result).toEqual(transacciones);
    });
  });
});
