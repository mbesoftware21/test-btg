export class TransaccionEntity {
  clienteId: string;       // Referencia al cliente
  fondoId: string;         // ID del fondo
  tipo: 'apertura' | 'cancelacion';
  monto: number;
  transaccionId: string;   // Identificador único
  fecha?: Date;            // Opcional, puede ser generada automáticamente
}
