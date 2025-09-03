// src/modules/fondos/presentation/fondos.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IFondoUseCases } from '../../application/use-cases/fondos.use-case.impl';
import { Fondo } from '../../domain/entities/fondo.entity';
import { FondoDto } from '../../presentation/dtos/fondo.dto';

@ApiTags('Fondos')
@Controller('fondos')
export class FondosController {
  constructor(private readonly fondosUseCases: IFondoUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo fondo' })
  @ApiResponse({ status: 201, description: 'Fondo creado correctamente' })
  async crearFondo(@Body() fondoDto: FondoDto): Promise<Fondo> {
    const fondo = new Fondo(
      '', // _id opcional, Mongo lo generará
      '', // id opcional
      fondoDto.nombre,
      fondoDto.montoMinimo,
      fondoDto.categoria,
    );
    return this.fondosUseCases.crearFondo(fondo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener fondo por ID' })
  @ApiResponse({ status: 200, description: 'Fondo encontrado' })
  @ApiResponse({ status: 404, description: 'Fondo no encontrado' })
  async obtenerFondo(@Param('id') id: string): Promise<Fondo> {
    const fondo = await this.fondosUseCases.obtenerFondoPorId(id);
    if (!fondo) throw new NotFoundException(`Fondo con id ${id} no encontrado`);
    return fondo;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los fondos' })
  @ApiResponse({ status: 200, description: 'Lista de fondos' })
  async listarFondos(): Promise<Fondo[]> {
    return this.fondosUseCases.listarFondos();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un fondo existente' })
  @ApiResponse({ status: 200, description: 'Fondo actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Fondo no encontrado' })
  async actualizarFondo(
    @Param('id') id: string,
    @Body() fondoDto: FondoDto,
  ): Promise<Fondo> {
    const fondo = new Fondo(
      '', // _id opcional
      id,
      fondoDto.nombre,
      fondoDto.montoMinimo,
      fondoDto.categoria,
    );
    return this.fondosUseCases.actualizarFondo(fondo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un fondo por ID' })
  @ApiResponse({ status: 200, description: 'Fondo eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Fondo no encontrado' })
  async eliminarFondo(@Param('id') id: string): Promise<{ mensaje: string }> {
    await this.fondosUseCases.eliminarFondo(id);
    return { mensaje: `Fondo con id ${id} eliminado correctamente` };
  }
}
