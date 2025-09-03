// src/modules/clientes/infrastructure/schemas/cliente.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClienteDocument = Cliente & Document;

@Schema({ timestamps: true })
export class Cliente {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true, default: 500_000 })
  saldo: number; // Saldo inicial

  @Prop({ type: [String], default: [] })
  preferencias: string[]; // email, sms

  @Prop({ required: true })
  password: string; // 👈 corregido (string, no array)

  @Prop({ type: [String], default: ['cliente'] })
  roles: string[]; // 👈 nuevo campo
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
