// src/modules/fondos/domain/repositories/fondo.repository.ts

import { Fondo } from "../../domain/entities/fondo.entity";

export abstract class FondoRepository {
  abstract findById(id: string): Promise<Fondo | null>;
  abstract findAll(): Promise<Fondo[]>;
  abstract create(fondo: Fondo): Promise<Fondo>;
  abstract update(fondo: Fondo): Promise<Fondo>;
  abstract delete(id: string): Promise<void>;
}
