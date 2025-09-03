export interface ClienteProps {
  id?: string;
  nombre: string;
  email: string;
  telefono: string;
  saldo?: number;
  preferencias?: string[];
  password
}

export class ClienteEntity {
  public readonly id?: string;
  public nombre: string;
  public email: string;
  public telefono: string;
  public saldo: number;
  public preferencias: string[];
  public password: string;

  constructor(props: ClienteProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.email = props.email;
    this.telefono = props.telefono;
    this.saldo = props.saldo ?? 500_000; // default
    this.preferencias = props.preferencias ?? [];
    this.password = props.password;
  }
}
