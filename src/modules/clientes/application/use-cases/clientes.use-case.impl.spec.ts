// src/modules/clientes/application/use-cases/clientes.use-case.impl.spec.ts
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ClienteUseCasesImpl } from './clientes.use-case.impl';
import { IClienteRepository } from '../../infrastructure/repositories/cliente.repository';
import { ClienteEntity } from '../../domain/entities/cliente.entity';

describe('ClienteUseCasesImpl', () => {
  let useCases: ClienteUseCasesImpl;
  let repo: jest.Mocked<IClienteRepository>;

  const cliente: ClienteEntity | any = {
    id: '1',
    nombre: 'Juan',
    email: 'juan@test.com',
    telefono: '12345',
  };

  beforeEach(() => {
    repo = {
      crear: jest.fn(),
      obtenerPorId: jest.fn(),
      obtenerPorEmail: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      listarTodos: jest.fn(),
    };
    useCases = new ClienteUseCasesImpl(repo);
  });

  describe('crearCliente', () => {
    it('debe crear un cliente si no existe el email', async () => {
      repo.obtenerPorEmail.mockResolvedValue(null);
      repo.crear.mockResolvedValue(cliente);

      const result = await useCases.crearCliente(cliente);

      expect(repo.obtenerPorEmail).toHaveBeenCalledWith(cliente.email);
      expect(repo.crear).toHaveBeenCalledWith(cliente);
      expect(result).toEqual(cliente);
    });

    it('debe lanzar BadRequestException si el email ya existe', async () => {
      repo.obtenerPorEmail.mockResolvedValue(cliente);

      await expect(useCases.crearCliente(cliente)).rejects.toThrow(BadRequestException);
    });
  });

  describe('obtenerClientePorId', () => {
    it('debe retornar un cliente existente', async () => {
      repo.obtenerPorId.mockResolvedValue(cliente);

      const result = await useCases.obtenerClientePorId('1');

      expect(result).toEqual(cliente);
    });

    it('debe lanzar NotFoundException si no existe el cliente', async () => {
      repo.obtenerPorId.mockResolvedValue(null);

      await expect(useCases.obtenerClientePorId('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('obtenerClientePorEmail', () => {
    it('debe retornar un cliente existente por email', async () => {
      repo.obtenerPorEmail.mockResolvedValue(cliente);

      const result = await useCases.obtenerClientePorEmail(cliente.email);

      expect(result).toEqual(cliente);
    });

    it('debe lanzar NotFoundException si no existe el cliente por email', async () => {
      repo.obtenerPorEmail.mockResolvedValue(null);

      await expect(useCases.obtenerClientePorEmail(cliente.email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('actualizarCliente', () => {
    it('debe actualizar un cliente existente', async () => {
      repo.obtenerPorId.mockResolvedValue(cliente);
      repo.actualizar.mockResolvedValue({ ...cliente, nombre: 'Carlos' });

      const result = await useCases.actualizarCliente({ ...cliente, nombre: 'Carlos' });

      expect(repo.obtenerPorId).toHaveBeenCalledWith(cliente.id);
      expect(repo.actualizar).toHaveBeenCalled();
      expect(result.nombre).toBe('Carlos');
    });

    it('debe lanzar NotFoundException si el cliente no existe', async () => {
      repo.obtenerPorId.mockResolvedValue(null);

      await expect(useCases.actualizarCliente(cliente)).rejects.toThrow(NotFoundException);
    });
  });

  describe('eliminarCliente', () => {
    it('debe eliminar un cliente existente', async () => {
      repo.obtenerPorId.mockResolvedValue(cliente);
      repo.eliminar.mockResolvedValue();

      await useCases.eliminarCliente('1');

      expect(repo.eliminar).toHaveBeenCalledWith('1');
    });

    it('debe lanzar NotFoundException si no existe el cliente', async () => {
      repo.obtenerPorId.mockResolvedValue(null);

      await expect(useCases.eliminarCliente('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listarClientes', () => {
    it('debe retornar una lista de clientes', async () => {
      repo.listarTodos.mockResolvedValue([cliente]);

      const result = await useCases.listarClientes();

      expect(result).toEqual([cliente]);
    });
  });
});
