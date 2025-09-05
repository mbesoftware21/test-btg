// src/modules/transacciones/presentation/transacciones.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionesController } from './transacciones.controller';
import { ITransaccionUseCases } from '../../application/use-cases/transacciones.use-case';
import { TransaccionDto } from '../dto/transaccion.dto';
import { TransaccionEntity } from '../../domain/entities/transaccion.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('TransaccionesController', () => {
  let controller: TransaccionesController;
  let useCases: ITransaccionUseCases;

  const mockUseCases = {
    registrarTransaccion: jest.fn(),
    obtenerTransaccionesPorCliente: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransaccionesController],
      providers: [
        {
          provide: ITransaccionUseCases,
          useValue: mockUseCases,
        },
      ],
    }).compile();

    controller = module.get<TransaccionesController>(TransaccionesController);
    useCases = module.get<ITransaccionUseCases>(ITransaccionUseCases);

    jest.clearAllMocks();
  });

  describe('registrarTransaccion', () => {
    it('✅ debería registrar una transacción cuando el cliente es dueño de la cuenta', async () => {
      const dto: TransaccionDto | any = {
        clienteId: 'cliente1',
        fondoId: 'fondo1',
        tipo: 'APERTURA',
        monto: 1000,
        transaccionId: 'tx123',
      };

      const req = { user: { sub: 'cliente1', roles: ['cliente'] } };

      const transaccionMock = { ...dto } as TransaccionEntity;
      (useCases.registrarTransaccion as jest.Mock).mockResolvedValue(transaccionMock);

      const result = await controller.registrarTransaccion(dto, req);

      expect(useCases.registrarTransaccion).toHaveBeenCalledWith(expect.any(TransaccionEntity));
      expect(result).toEqual(transaccionMock);
    });

    it('🚫 debería lanzar ForbiddenException si el cliente intenta registrar para otro usuario', async () => {
      const dto: TransaccionDto | any = {
        clienteId: 'cliente2',
        fondoId: 'fondo1',
        tipo: 'APERTURA',
        monto: 1000,
        transaccionId: 'tx123',
      };

      const req = { user: { sub: 'cliente1', roles: ['cliente'] } };

      await expect(controller.registrarTransaccion(dto, req)).rejects.toThrow(ForbiddenException);
      expect(useCases.registrarTransaccion).not.toHaveBeenCalled();
    });
  });

  describe('obtenerTransacciones', () => {
    it('✅ debería devolver transacciones si el cliente consulta las suyas', async () => {
      const req = { user: { sub: 'cliente1', roles: ['cliente'] } };
      const transaccionesMock: TransaccionEntity[] | any = [
        { clienteId: 'cliente1', fondoId: 'fondo1', tipo: 'APERTURA', monto: 1000 } as TransaccionEntity | any,
      ];

      (useCases.obtenerTransaccionesPorCliente as jest.Mock).mockResolvedValue(transaccionesMock);

      const result = await controller.obtenerTransacciones('cliente1', req);

      expect(useCases.obtenerTransaccionesPorCliente).toHaveBeenCalledWith('cliente1');
      expect(result).toEqual(transaccionesMock);
    });

    it('🚫 debería lanzar ForbiddenException si el cliente intenta ver transacciones de otro', async () => {
      const req = { user: { sub: 'cliente1', roles: ['cliente'] } };

      await expect(controller.obtenerTransacciones('cliente2', req)).rejects.toThrow(ForbiddenException);
      expect(useCases.obtenerTransaccionesPorCliente).not.toHaveBeenCalled();
    });

    it('🚫 debería lanzar NotFoundException si no existen transacciones', async () => {
      const req = { user: { sub: 'cliente1', roles: ['cliente'] } };
      (useCases.obtenerTransaccionesPorCliente as jest.Mock).mockResolvedValue([]);

      await expect(controller.obtenerTransacciones('cliente1', req)).rejects.toThrow(NotFoundException);
    });
  });
});
