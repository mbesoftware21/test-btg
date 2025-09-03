// src/modules/fondos/application/use-cases/fondos.use-case.impl.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { FondoRepository } from '../../infrastructure/repositories/fondo.repository';
import { Fondo } from '../../domain/entities/fondo.entity';


export abstract class IFondoUseCases {
  abstract crearFondo(fondo: Fondo): Promise<Fondo>;
  abstract obtenerFondoPorId(id: string): Promise<Fondo>;
  abstract listarFondos(): Promise<Fondo[]>;
  abstract actualizarFondo(fondo: Fondo): Promise<Fondo>;
  abstract eliminarFondo(id: string): Promise<void>;
}


@Injectable()
export class FondoUseCasesImpl implements IFondoUseCases {
  constructor(private readonly fondoRepository: FondoRepository) {}

  async crearFondo(fondo: Fondo): Promise<Fondo> {
    return this.fondoRepository.create(fondo);
  }

  async obtenerFondoPorId(id: string): Promise<Fondo> {
    const fondo = await this.fondoRepository.findById(id);
    if (!fondo) throw new NotFoundException(`Fondo con id ${id} no encontrado`);
    return fondo;
  }

  async listarFondos(): Promise<Fondo[]> {
    return this.fondoRepository.findAll();
  }

  async actualizarFondo(fondo: Fondo): Promise<Fondo> {
    return this.fondoRepository.update(fondo);
  }

  async eliminarFondo(id: string): Promise<void> {
    return this.fondoRepository.delete(id);
  }
}
