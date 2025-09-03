// src/modules/transacciones/presentation/transacciones.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ITransaccionUseCases } from '../../application/use-cases/transacciones.use-case';
import { TransaccionDto } from '../dto/transaccion.dto';
import { TransaccionEntity } from '../../domain/entities/transaccion.entity';

@ApiTags('Transacciones')
@Controller('transacciones')
export class TransaccionesController {
    constructor(private readonly transaccionUseCases: ITransaccionUseCases) { }

    @Post()
    @ApiOperation({ summary: 'Registrar una transacción (apertura o cancelación)' })
    @ApiResponse({ status: 201, description: 'Transacción registrada correctamente' })
    async registrarTransaccion(@Body() transaccionDto: TransaccionDto): Promise<TransaccionEntity> {
        const transaccion = new TransaccionEntity()
        //   transaccionDto.clienteId,
        //   transaccionDto.fondoId,
        //   transaccionDto.tipo,
        //   transaccionDto.monto,
        //   transaccionDto.transaccionId,
        // );
        transaccion.clienteId = transaccionDto.clienteId
        transaccion.fondoId = transaccionDto.fondoId
        transaccion.tipo = transaccionDto.tipo
        transaccion.monto = transaccionDto.monto
        transaccion.transaccionId = transaccionDto.transaccionId
        return this.transaccionUseCases.registrarTransaccion(transaccion);
    }

    @Get(':clienteId')
    @ApiOperation({ summary: 'Obtener todas las transacciones de un cliente' })
    @ApiResponse({ status: 200, description: 'Lista de transacciones' })
    async obtenerTransacciones(@Param('clienteId') clienteId: string): Promise<TransaccionEntity[]> {
        const transacciones = await this.transaccionUseCases.obtenerTransaccionesPorCliente(clienteId);
        if (!transacciones || transacciones.length === 0) {
            throw new NotFoundException(`No se encontraron transacciones para el cliente ${clienteId}`);
        }
        return transacciones;
    }
}
