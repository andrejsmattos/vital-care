export class User {
  constructor(
    public id: number,
    public email: string,
    public profile: string[],
    public password: string,
    public nome?: string,
    public dataNascimento?: Date | string,
    public cpf?: string,
    public telefone?: string
  ) {}
}
