// src/modules/clientes/presentation/clientes.controller.ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IClienteUseCases } from '../../application/use-cases/clientes.use-case';
import { ClienteEntity } from '../../domain/entities/cliente.entity';
import { ClienteDto } from '../dtos/cliente.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';

@ApiTags('Clientes')
@Controller('clientes')
@UseGuards(AuthGuard('jwt'), RolesGuard) // 🔒 proteger todo el controlador
export class ClientesController {
  constructor(private readonly clienteUseCases: IClienteUseCases) {}

  @Get(':id')
  @Roles('cliente', 'admin')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async obtenerCliente(@Param('id') id: string, @Req() req): Promise<ClienteEntity> {
    const user = req.user;

    // 🚫 Un cliente solo puede ver su propia cuenta
    if (user.roles.includes('cliente') && user.sub !== id) {
      throw new ForbiddenException('No puedes ver la información de otro usuario');
    }

    const cliente = await this.clienteUseCases.obtenerClientePorId(id);
    if (!cliente) throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    return cliente;
  }

  @Get()
  @Roles('admin') // 👑 solo admin puede listar todos
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  async listarClientes(): Promise<ClienteEntity[]> {
    return this.clienteUseCases.listarClientes();
  }

  @Put(':id')
  @Roles('cliente', 'admin')
  @ApiOperation({ summary: 'Actualizar un cliente existente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async actualizarCliente(
    @Param('id') id: string,
    @Body() clienteDto: ClienteDto,
    @Req() req,
  ): Promise<ClienteEntity> {
    const user = req.user;

    // 🚫 Un cliente solo puede actualizar su propia cuenta
    if (user.roles.includes('cliente') && user.sub !== id) {
      throw new ForbiddenException('No puedes actualizar la información de otro usuario');
    }

    const cliente = new ClienteEntity({
      id,
      nombre: clienteDto.nombre,
      email: clienteDto.email,
      telefono: clienteDto.telefono,
      preferencias: clienteDto.preferencias || [],
      password: clienteDto.password,
      roles: clienteDto.roles as string[],
    });
    return this.clienteUseCases.actualizarCliente(cliente);
  }

  @Delete(':id')
  @Roles('cliente', 'admin')
  @ApiOperation({ summary: 'Eliminar un cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async eliminarCliente(@Param('id') id: string, @Req() req): Promise<{ mensaje: string }> {
    const user = req.user;

    // 🚫 Un cliente solo puede eliminar su propia cuenta
    if (user.roles.includes('cliente') && user.sub !== id) {
      throw new ForbiddenException('No puedes eliminar otro usuario');
    }

    await this.clienteUseCases.eliminarCliente(id);
    return { mensaje: `Cliente con id ${id} eliminado correctamente` };
  }
}
