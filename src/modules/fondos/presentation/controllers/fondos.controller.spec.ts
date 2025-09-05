// src/modules/fondos/presentation/controllers/fondos.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FondosController } from './fondos.controller';
import { IFondoUseCases } from '../../application/use-cases/fondos.use-case.impl';
import { Fondo } from '../../domain/entities/fondo.entity';
import { FondoDto } from '../dtos/fondo.dto';
import { NotFoundException } from '@nestjs/common';

describe('FondosController', () => {
  let controller: FondosController;
  let fondosUseCases: IFondoUseCases;

  const mockFondosUseCases = {
    crearFondo: jest.fn(),
    actualizarFondo: jest.fn(),
    eliminarFondo: jest.fn(),
    listarFondos: jest.fn(),
    obtenerFondoPorId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FondosController],
      providers: [
        {
          provide: IFondoUseCases,
          useValue: mockFondosUseCases,
        },
      ],
    }).compile();

    controller = module.get<FondosController>(FondosController);
    fondosUseCases = module.get<IFondoUseCases>(IFondoUseCases);

    jest.clearAllMocks();
  });

  describe('crearFondo', () => {
    it('debería crear un fondo y devolverlo', async () => {
      const dto: FondoDto = { nombre: 'Fondo A', montoMinimo: 1000, categoria: 'Renta fija' };
      const fondoMock = new Fondo('1', '1', dto.nombre, dto.montoMinimo, dto.categoria);

      (fondosUseCases.crearFondo as jest.Mock).mockResolvedValue(fondoMock);

      const result = await controller.crearFondo(dto);

      expect(fondosUseCases.crearFondo).toHaveBeenCalledWith(expect.any(Fondo));
      expect(result).toEqual(fondoMock);
    });
  });

  describe('actualizarFondo', () => {
    it('debería actualizar un fondo y devolverlo', async () => {
      const dto: FondoDto = { nombre: 'Fondo B', montoMinimo: 2000, categoria: 'Variable' };
      const fondoMock = new Fondo('2', '2', dto.nombre, dto.montoMinimo, dto.categoria);

      (fondosUseCases.actualizarFondo as jest.Mock).mockResolvedValue(fondoMock);

      const result = await controller.actualizarFondo('2', dto);

      expect(fondosUseCases.actualizarFondo).toHaveBeenCalledWith(expect.any(Fondo));
      expect(result).toEqual(fondoMock);
    });
  });

  describe('eliminarFondo', () => {
    it('debería eliminar un fondo y devolver un mensaje', async () => {
      (fondosUseCases.eliminarFondo as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.eliminarFondo('3');

      expect(fondosUseCases.eliminarFondo).toHaveBeenCalledWith('3');
      expect(result).toEqual({ mensaje: 'Fondo con id 3 eliminado correctamente' });
    });
  });

  describe('listarFondos', () => {
    it('debería listar todos los fondos', async () => {
      const fondosMock = [
        new Fondo('1', '1', 'Fondo A', 1000, 'Renta fija'),
        new Fondo('2', '2', 'Fondo B', 2000, 'Variable'),
      ];

      (fondosUseCases.listarFondos as jest.Mock).mockResolvedValue(fondosMock);

      const result = await controller.listarFondos();

      expect(fondosUseCases.listarFondos).toHaveBeenCalled();
      expect(result).toEqual(fondosMock);
    });
  });

  describe('obtenerFondo', () => {
    it('debería devolver un fondo si existe', async () => {
      const fondoMock = new Fondo('1', '1', 'Fondo A', 1000, 'Renta fija');

      (fondosUseCases.obtenerFondoPorId as jest.Mock).mockResolvedValue(fondoMock);

      const result = await controller.obtenerFondo('1');

      expect(fondosUseCases.obtenerFondoPorId).toHaveBeenCalledWith('1');
      expect(result).toEqual(fondoMock);
    });

    it('debería lanzar NotFoundException si no existe el fondo', async () => {
      (fondosUseCases.obtenerFondoPorId as jest.Mock).mockResolvedValue(null);

      await expect(controller.obtenerFondo('99')).rejects.toThrow(NotFoundException);
    });
  });
});
