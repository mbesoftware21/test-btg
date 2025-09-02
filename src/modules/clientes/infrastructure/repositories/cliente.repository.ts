// src/modules/clientes/domain/repositories/cliente.repository.ts

import { ClienteEntity } from "../../domain/entities/cliente.entity";

export abstract class IClienteRepository {
  /**
   * Crea un nuevo cliente
   */
  abstract crear(cliente: ClienteEntity): Promise<ClienteEntity>;

  /**
   * Obtiene un cliente por su ID
   */
  abstract obtenerPorId(id: string): Promise<ClienteEntity | null>;

  /**
   * Obtiene un cliente por su email
   */
  abstract obtenerPorEmail(email: string): Promise<ClienteEntity | null>;

  /**
   * Actualiza un cliente existente
   */
  abstract actualizar(cliente: ClienteEntity): Promise<ClienteEntity>;

  /**
   * Elimina un cliente por su ID
   */
  abstract eliminar(id: string): Promise<void>;

  /**
   * Lista todos los clientes
   */
  abstract listarTodos(): Promise<ClienteEntity[]>;
}
