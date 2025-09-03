// src/modules/fondos/application/dto/fondo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class FondoDto {
  @ApiProperty({ example: 'FPV_BTG_PACTUAL_RECAUDADORA' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 75000 })
  @IsNumber()
  montoMinimo: number;

  @ApiProperty({ example: 'FPV' })
  @IsString()
  categoria: string;
}
