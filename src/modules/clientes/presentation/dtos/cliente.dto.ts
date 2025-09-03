// src/modules/clientes/application/dto/cliente.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional, MinLength } from 'class-validator';

export class ClienteDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+573001234567' })
  @IsString()
  telefono: string;

  @ApiProperty({ example: ['email'], required: false })
  @IsArray()
  @IsOptional()
  preferencias?: string[];

  @ApiProperty({ example: '123456', required: false })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string; // <-- agregado para AuthModule
}
