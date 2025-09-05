// src/modules/fondos/application/use-cases/fondos.use-case.impl.spec.ts
import { NotFoundException } from '@nestjs/common';
import { FondoUseCasesImpl } from './fondos.use-case.impl';
import { FondoRepository } from '../../infrastructure/repositories/fondo.repository';
import { Fondo } from '../../domain/entities/fondo.entity';

describe('FondoUseCasesImpl', () => {
  let useCases: FondoUseCasesImpl;
  let fondoRepo: jest.Mocked<FondoRepository>;

  const fondo = new Fondo('1', '1', 'Fondo A', 500, 'categoria1');

  beforeEach(() => {
    fondoRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCases = new FondoUseCasesImpl(fondoRepo);
  });

  describe('crearFondo', () => {
    it('debe crear un fondo', async () => {
      fondoRepo.create.mockResolvedValue(fondo);

      const result = await useCases.crearFondo(fondo);

      expect(fondoRepo.create).toHaveBeenCalledWith(fondo);
      expect(result).toEqual(fondo);
    });
  });

  describe('obtenerFondoPorId', () => {
    it('debe retornar el fondo si existe', async () => {
      fondoRepo.findById.mockResolvedValue(fondo);

      const result = await useCases.obtenerFondoPorId('1');

      expect(fondoRepo.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(fondo);
    });

    it('debe lanzar NotFound si no existe', async () => {
      fondoRepo.findById.mockResolvedValue(null);

      await expect(useCases.obtenerFondoPorId('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listarFondos', () => {
    it('debe listar todos los fondos', async () => {
      fondoRepo.findAll.mockResolvedValue([fondo]);

      const result = await useCases.listarFondos();

      expect(fondoRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual([fondo]);
    });
  });

  describe('actualizarFondo', () => {
    it('debe actualizar un fondo', async () => {
      fondoRepo.update.mockResolvedValue(fondo);

      const result = await useCases.actualizarFondo(fondo);

      expect(fondoRepo.update).toHaveBeenCalledWith(fondo);
      expect(result).toEqual(fondo);
    });
  });

  describe('eliminarFondo', () => {
    it('debe eliminar un fondo', async () => {
      fondoRepo.delete.mockResolvedValue(undefined);

      await useCases.eliminarFondo('1');

      expect(fondoRepo.delete).toHaveBeenCalledWith('1');
    });
  });
});
