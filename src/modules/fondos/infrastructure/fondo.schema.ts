// src/modules/fondos/infrastructure/schemas/fondo.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FondoDocument = Fondo & Document;

@Schema({ timestamps: true })
export class Fondo {
  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop({ required: true })
  montoMinimo: number;

  @Prop({ required: true })
  categoria: string;
}

export const FondoSchema = SchemaFactory.createForClass(Fondo);
