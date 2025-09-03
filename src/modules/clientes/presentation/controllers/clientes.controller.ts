// src/modules/clientes/presentation/clientes.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IClienteUseCases } from '../../application/use-cases/clientes.use-case';
import { ClienteEntity } from '../../domain/entities/cliente.entity';
import { ClienteDto } from '../dtos/cliente.dto';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clienteUseCases: IClienteUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado correctamente' })
  async crearCliente(@Body() clienteDto: ClienteDto): Promise<ClienteEntity> {
    const cliente = new ClienteEntity({
      nombre: clienteDto.nombre,
      email: clienteDto.email,
      telefono: clienteDto.telefono,
      preferencias: clienteDto.preferencias || [],
      password: clienteDto.password
    });
    return this.clienteUseCases.crearCliente(cliente);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async obtenerCliente(@Param('id') id: string): Promise<ClienteEntity> {
    const cliente = await this.clienteUseCases.obtenerClientePorId(id);
    if (!cliente) throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    return cliente;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  async listarClientes(): Promise<ClienteEntity[]> {
    return this.clienteUseCases.listarClientes();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cliente existente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async actualizarCliente(
    @Param('id') id: string,
    @Body() clienteDto: ClienteDto,
  ): Promise<ClienteEntity> {
    const cliente = new ClienteEntity({
      id,
      nombre: clienteDto.nombre,
      email: clienteDto.email,
      telefono: clienteDto.telefono,
      preferencias: clienteDto.preferencias || [],
      password: clienteDto.password
    });
    return this.clienteUseCases.actualizarCliente(cliente);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async eliminarCliente(@Param('id') id: string): Promise<{ mensaje: string }> {
    await this.clienteUseCases.eliminarCliente(id);
    return { mensaje: `Cliente con id ${id} eliminado correctamente` };
  }
}
