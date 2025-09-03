import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IFondoUseCases } from '../../application/use-cases/fondos.use-case.impl';
import { Fondo } from '../../domain/entities/fondo.entity';
import { FondoDto } from '../../presentation/dtos/fondo.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@ApiTags('Fondos')
@Controller('fondos')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Se aplican a todos los endpoints
export class FondosController {
  constructor(private readonly fondosUseCases: IFondoUseCases) {}

  // --- SOLO ADMIN ---
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un nuevo fondo' })
  async crearFondo(@Body() fondoDto: FondoDto): Promise<Fondo> {
    const fondo = new Fondo(
      undefined,
      undefined,
      fondoDto.nombre,
      fondoDto.montoMinimo,
      fondoDto.categoria,
    );
    return this.fondosUseCases.crearFondo(fondo);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar un fondo existente' })
  async actualizarFondo(
    @Param('id') id: string,
    @Body() fondoDto: FondoDto,
  ): Promise<Fondo> {
    const fondo = new Fondo(
      id,
      id,
      fondoDto.nombre,
      fondoDto.montoMinimo,
      fondoDto.categoria,
    );
    return this.fondosUseCases.actualizarFondo(fondo);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar un fondo por ID' })
  async eliminarFondo(@Param('id') id: string): Promise<{ mensaje: string }> {
    await this.fondosUseCases.eliminarFondo(id);
    return { mensaje: `Fondo con id ${id} eliminado correctamente` };
  }

  @Get()
  @Roles('admin', 'cliente') // Solo admin puede listar todo
  @ApiOperation({ summary: 'Listar todos los fondos' })
  async listarFondos(): Promise<Fondo[]> {
    return this.fondosUseCases.listarFondos();
  }

  // --- SOLO CLIENTE ---
  @Get(':id')
  @Roles('cliente', 'admin') // clientes pueden consultar solo por id
  @ApiOperation({ summary: 'Obtener fondo por ID' })
  async obtenerFondo(@Param('id') id: string): Promise<Fondo> {
    const fondo = await this.fondosUseCases.obtenerFondoPorId(id);
    if (!fondo) throw new NotFoundException(`Fondo con id ${id} no encontrado`);
    return fondo;
  }
}
