// src/modules/auth/presentation/auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthUseCasesImpl } from '../../application/use-cases/auth.use-case.impl';
import { BadRequestException } from '@nestjs/common';
import { ClienteDto } from '../../../clientes/presentation/dtos/cliente.dto';
import { LoginDto } from '../dtos/login.dto';
import { ClienteEntity } from '../../../clientes/domain/entities/cliente.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authUseCases: AuthUseCasesImpl;

  const mockAuthUseCases = {
    registrar: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthUseCasesImpl,
          useValue: mockAuthUseCases,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authUseCases = module.get<AuthUseCasesImpl>(AuthUseCasesImpl);

    jest.clearAllMocks();
  });

  describe('registrar', () => {
    it('debería lanzar BadRequestException si falta password', async () => {
      const dto: ClienteDto = {
        nombre: 'Juan',
        email: 'juan@test.com',
        telefono: '123456',
        saldo: 0,
        preferencias: [],
        password: undefined,
        roles: ['USER'],
      };

      await expect(controller.registrar(dto)).rejects.toThrow(BadRequestException);
    });

    it('debería llamar a authUseCases.registrar con ClienteEntity válido', async () => {
      const dto: ClienteDto | any= {
        nombre: 'Juan',
        email: 'juan@test.com',
        telefono: '123456',
        saldo: 0,
        preferencias: ['fondos'],
        password: '12345',
        roles: ['USER'],
      };

      const clienteMock = new ClienteEntity(dto);

      (authUseCases.registrar as jest.Mock).mockResolvedValue(clienteMock);

      const result = await controller.registrar(dto);

      expect(authUseCases.registrar).toHaveBeenCalledWith(expect.any(ClienteEntity));
      expect(result).toEqual(clienteMock);
    });
  });

  describe('login', () => {
    it('debería llamar a authUseCases.login con email y password', async () => {
      const dto: LoginDto = { email: 'juan@test.com', password: '12345' };

      (authUseCases.login as jest.Mock).mockResolvedValue({ token: 'fake-jwt' });

      const result = await controller.login(dto);

      expect(authUseCases.login).toHaveBeenCalledWith(dto.email, dto.password);
      expect(result).toEqual({ token: 'fake-jwt' });
    });
  });
});
