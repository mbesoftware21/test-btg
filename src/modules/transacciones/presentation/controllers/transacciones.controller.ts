// src/modules/transacciones/presentation/transacciones.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ITransaccionUseCases } from '../../application/use-cases/transacciones.use-case';
import { TransaccionDto } from '../dto/transaccion.dto';
import { TransaccionEntity } from '../../domain/entities/transaccion.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@ApiTags('Transacciones')
@Controller('transacciones')
@UseGuards(AuthGuard('jwt'), RolesGuard) // 🔒 protegido con JWT y roles
export class TransaccionesController {
  constructor(private readonly transaccionUseCases: ITransaccionUseCases) {}

  @Post()
  @Roles('cliente') // 👤 solo clientes pueden crear
  @ApiOperation({ summary: 'Registrar una transacción (apertura o cancelación)' })
  @ApiResponse({ status: 201, description: 'Transacción registrada correctamente' })
  async registrarTransaccion(
    @Body() transaccionDto: TransaccionDto,
    @Req() req,
  ): Promise<TransaccionEntity> {
    const user = req.user;

    // 🚫 Un cliente solo puede registrar sus propias transacciones
    if (user.sub !== transaccionDto.clienteId) {
      throw new ForbiddenException('No puedes registrar transacciones para otro usuario');
    }

    const transaccion = new TransaccionEntity();
    transaccion.clienteId = transaccionDto.clienteId;
    transaccion.fondoId = transaccionDto.fondoId;
    transaccion.tipo = transaccionDto.tipo;
    transaccion.monto = transaccionDto.monto;
    transaccion.transaccionId = transaccionDto.transaccionId;

    return this.transaccionUseCases.registrarTransaccion(transaccion);
  }

  @Get(':clienteId')
  @Roles('cliente', 'admin') // clientes ven las suyas, admin puede ver cualquiera
  @ApiOperation({ summary: 'Obtener todas las transacciones de un cliente' })
  @ApiResponse({ status: 200, description: 'Lista de transacciones' })
  async obtenerTransacciones(
    @Param('clienteId') clienteId: string,
    @Req() req,
  ): Promise<TransaccionEntity[]> {
    const user = req.user;

    // 🚫 Un cliente solo puede ver sus propias transacciones
    if (user.roles.includes('cliente') && user.sub !== clienteId) {
      throw new ForbiddenException('No puedes consultar transacciones de otro usuario');
    }

    const transacciones =
      await this.transaccionUseCases.obtenerTransaccionesPorCliente(clienteId);

    if (!transacciones || transacciones.length === 0) {
      throw new NotFoundException(`No se encontraron transacciones para el cliente ${clienteId}`);
    }

    return transacciones;
  }
}
