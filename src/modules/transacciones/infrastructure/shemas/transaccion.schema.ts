import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransaccionDocument = Transaccion & Document;

@Schema({ timestamps: true })
export class Transaccion {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Cliente' })
  clienteId: string;

  @Prop({ required: true })
  fondoId: string;

  @Prop({ required: true })
  tipo: 'apertura' | 'cancelacion';

  @Prop({ required: true })
  monto: number;

  @Prop({ required: true, unique: true })
  transaccionId: string; // Identificador único
}

export const TransaccionSchema = SchemaFactory.createForClass(Transaccion);
