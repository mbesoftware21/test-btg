import { Test, TestingModule } from '@nestjs/testing';
import { ClientesController } from './clientes.controller';
import { IClienteUseCases } from '../../application/use-cases/clientes.use-case';
import { ClienteEntity } from '../../domain/entities/cliente.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';

describe('ClientesController', () => {
  let controller: ClientesController;
  let mockUseCases: jest.Mocked<IClienteUseCases>;

  beforeEach(async () => {
    mockUseCases = {
      obtenerClientePorId: jest.fn(),
      listarClientes: jest.fn(),
      actualizarCliente: jest.fn(),
      eliminarCliente: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          provide: IClienteUseCases,
          useValue: mockUseCases,
        },
      ],
    }).compile();

    controller = module.get<ClientesController>(ClientesController);
  });

  describe('obtenerCliente', () => {
    it('debería retornar el cliente si el usuario es admin', async () => {
      const cliente = new ClienteEntity({
        id: '1',
        nombre: 'Juan',
        email: 'juan@example.com',
        telefono: '123',
        preferencias: [],
        password: '123456',
        roles: ['cliente'],
      });

      mockUseCases.obtenerClientePorId.mockResolvedValue(cliente);

      const result = await controller.obtenerCliente('1', {
        user: { sub: 'otro', roles: ['admin'] },
      });

      expect(result).toEqual(cliente);
      expect(mockUseCases.obtenerClientePorId).toHaveBeenCalledWith('1');
    });

    it('debería lanzar ForbiddenException si un cliente accede a otro id', async () => {
      await expect(
        controller.obtenerCliente('2', { user: { sub: '1', roles: ['cliente'] } }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debería lanzar NotFoundException si no existe el cliente', async () => {
      mockUseCases.obtenerClientePorId.mockResolvedValue(null as any);

      await expect(
        controller.obtenerCliente('1', { user: { sub: '1', roles: ['admin'] } }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listarClientes', () => {
    it('debería retornar todos los clientes', async () => {
      const clientes = [
        new ClienteEntity({ id: '1', nombre: 'A', email: 'a@test.com', telefono: '123', preferencias: [], password: '123456', roles: ['cliente'] }),
        new ClienteEntity({ id: '2', nombre: 'B', email: 'b@test.com', telefono: '456', preferencias: [], password: '123456', roles: ['cliente'] }),
      ];
      mockUseCases.listarClientes.mockResolvedValue(clientes);

      const result = await controller.listarClientes();

      expect(result).toEqual(clientes);
    });
  });

  describe('actualizarCliente', () => {
    it('debería permitir que un admin actualice cualquier cliente', async () => {
      const dto = { nombre: 'Nuevo', email: 'nuevo@test.com', telefono: '123', roles: ['cliente'] };
      const updated = new ClienteEntity({ id: '1', ...dto, preferencias: [], password: '123456' });

      mockUseCases.actualizarCliente.mockResolvedValue(updated);

      const result = await controller.actualizarCliente('1', dto as any, {
        user: { sub: '2', roles: ['admin'] },
      });

      expect(result).toEqual(updated);
      expect(mockUseCases.actualizarCliente).toHaveBeenCalled();
    });

    it('debería lanzar ForbiddenException si un cliente actualiza otro', async () => {
      const dto = { nombre: 'Mal', email: 'mal@test.com', telefono: '123', roles: ['cliente'] };
      await expect(
        controller.actualizarCliente('2', dto as any, { user: { sub: '1', roles: ['cliente'] } }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('eliminarCliente', () => {
    it('debería permitir a un admin eliminar cualquier cliente', async () => {
      mockUseCases.eliminarCliente.mockResolvedValue();

      const result = await controller.eliminarCliente('1', { user: { sub: '2', roles: ['admin'] } });

      expect(result).toEqual({ mensaje: 'Cliente con id 1 eliminado correctamente' });
      expect(mockUseCases.eliminarCliente).toHaveBeenCalledWith('1');
    });

    it('debería lanzar ForbiddenException si un cliente elimina otro usuario', async () => {
      await expect(
        controller.eliminarCliente('2', { user: { sub: '1', roles: ['cliente'] } }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
