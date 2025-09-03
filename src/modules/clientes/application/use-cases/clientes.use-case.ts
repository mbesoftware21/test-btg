// src/modules/clientes/application/use-cases/clientes.use-case.ts
import { ClienteEntity } from "../../domain/entities/cliente.entity";

export abstract class IClienteUseCases {
  abstract crearCliente(cliente: ClienteEntity): Promise<ClienteEntity>;
  abstract obtenerClientePorId(id: string): Promise<ClienteEntity>;
  abstract obtenerClientePorEmail(email: string): Promise<ClienteEntity>;
  abstract actualizarCliente(cliente: ClienteEntity): Promise<ClienteEntity>;
  abstract eliminarCliente(id: string): Promise<void>;
  abstract listarClientes(): Promise<ClienteEntity[]>;
}
