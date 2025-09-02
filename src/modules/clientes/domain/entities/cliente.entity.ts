
export class ClienteEntity {
  constructor(
    public readonly id: string,       // ObjectId como string
    public nombre: string,
    public email: string,
    public telefono: string,
    public saldo: number = 500_000,   // Default igual que en el schema
    public preferencias: string[] = [], // Array de preferencias: email, sms
  ) {}
}
