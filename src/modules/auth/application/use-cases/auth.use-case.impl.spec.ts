// src/modules/auth/application/use-cases/auth.use-case.impl.spec.ts
import { AuthUseCasesImpl } from './auth.use-case.impl';
import { IClienteUseCases } from '../../../clientes/application/use-cases/clientes.use-case';
import { JwtService } from '@nestjs/jwt';
import { ClienteEntity } from '../../../clientes/domain/entities/cliente.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthUseCasesImpl', () => {
  let authUseCases: AuthUseCasesImpl;
  let clienteUseCases: jest.Mocked<IClienteUseCases>;
  let jwtService: jest.Mocked<JwtService>;

  const cliente: ClienteEntity = {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '123456789',
    saldo: 500000,
    preferencias: [],
    password: 'hashedpassword',
    roles: ['cliente'],
  };

  beforeEach(() => {
    clienteUseCases = {
      crearCliente: jest.fn(),
      obtenerClientePorEmail: jest.fn(),
      obtenerClientePorId: jest.fn(),
      actualizarCliente: jest.fn(),
      eliminarCliente: jest.fn(),
      listarClientes: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
    } as any;

    authUseCases = new AuthUseCasesImpl(clienteUseCases, jwtService);
  });

  describe('registrar', () => {
    it('debe lanzar BadRequest si el email ya está registrado', async () => {
      clienteUseCases.obtenerClientePorEmail.mockResolvedValue(cliente);

      await expect(authUseCases.registrar(cliente)).rejects.toThrow(BadRequestException);
    });

    it('debe registrar un cliente nuevo con password hasheado', async () => {
      clienteUseCases.obtenerClientePorEmail.mockRejectedValue(new Error('not found'));
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      clienteUseCases.crearCliente.mockResolvedValue({ ...cliente, password: 'hashedPassword' });

      const result = await authUseCases.registrar({ ...cliente, password: 'plain123' });

      expect(bcrypt.hash).toHaveBeenCalledWith('plain123', 10);
      expect(clienteUseCases.crearCliente).toHaveBeenCalled();
      expect(result.password).toBe('hashedPassword');
    });
  });

  describe('login', () => {
    it('debe lanzar Unauthorized si el cliente no existe', async () => {
      clienteUseCases.obtenerClientePorEmail.mockRejectedValue(new Error('not found'));

      await expect(authUseCases.login('no@existe.com', '123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debe lanzar Unauthorized si el password no coincide', async () => {
      clienteUseCases.obtenerClientePorEmail.mockResolvedValue(cliente);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authUseCases.login(cliente.email, 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debe devolver un access_token si credenciales son válidas', async () => {
      clienteUseCases.obtenerClientePorEmail.mockResolvedValue(cliente);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('fake-jwt');

      const result = await authUseCases.login(cliente.email, 'plain123');

      expect(bcrypt.compare).toHaveBeenCalledWith('plain123', cliente.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: cliente.id,
        email: cliente.email,
        roles: cliente.roles,
      });
      expect(result.access_token).toBe('fake-jwt');
    });
  });
});
