// src/modules/transacciones/application/dto/transaccion.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsIn } from 'class-validator';

export class TransaccionDto {
  @ApiProperty({ example: 'clienteId123' })
  @IsString()
  clienteId: string;

  @ApiProperty({ example: 'fondoId123' })
  @IsString()
  fondoId: string;

  @ApiProperty({ example: 'apertura', enum: ['apertura', 'cancelacion'] })
  @IsIn(['apertura', 'cancelacion'])
  tipo: 'apertura' | 'cancelacion';

  @ApiProperty({ example: 100000 })
  @IsNumber()
  monto: number;

  @ApiProperty({ example: 'TX123456' })
  @IsString()
  transaccionId: string; // Identificador único
}
