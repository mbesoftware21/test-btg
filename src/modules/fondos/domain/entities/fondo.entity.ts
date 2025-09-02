// src/modules/fondos/domain/entities/fondo.entity.ts
export class Fondo {
  constructor(
    public readonly _id: string,
    public readonly id: string,
    public readonly nombre: string,
    public readonly montoMinimo: number,
    public readonly categoria: string,
  ) {}
}
