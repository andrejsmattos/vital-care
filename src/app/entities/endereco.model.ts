import { Paciente } from './paciente.model';

export class Endereco {
  constructor(
    public cep: string,
    public cidade: string,
    public estado: string,
    public rua: string,
    public numero: string,
    public complemento: string,
    public bairro: string,
    public ptoReferencia: string
  ) {}
}
