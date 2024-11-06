import { Endereco } from "./endereco.model";
import { User } from "./user.model";

export class Paciente {
  constructor(
    public id: number,
    public nome: string,
    public genero: string,
    public dataNascimento: string | Date,
    public cpf: string,
    public rg: string,
    public orgaoExpedidor: string,
    public estadoCivil: string,
    public telefone: string,
    public email: string,
    public naturalidade: string,
    public contatoEmergencia: string,
    public listaAlergias: string,
    public listaCuidados: string,
    public convenio: string,
    public numeroConvenio: string,
    public validadeConvenio: string | Date,
    public endereco: Endereco,
    public usuario: User,
    public idade?: string
  ) {}
}

