import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ConsultaCepService } from '../../services/consulta-cep.service';
import { PageTitleService } from '../../services/title.service';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PacientesService } from '../../services/pacientes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paciente } from '../../entities/paciente.model';
import { Endereco } from '../../entities/endereco.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-cadastro-pacientes',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatDividerModule,
  ],
  templateUrl: './cadastro-pacientes.component.html',
  styleUrl: './cadastro-pacientes.component.scss',
})
export class CadastroPacientesComponent implements OnInit {
  pacienteId: string | null = null;
  endereco: Endereco | undefined;
  paciente: Paciente | undefined;
  pacienteForm: FormGroup;

  constructor(
    private readonly pageTitleService: PageTitleService,
    private readonly consultaCepService: ConsultaCepService,
    private readonly pacientesService: PacientesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.pageTitleService.setPageTitle('CADASTRO DE PACIENTE');

    this.pacienteForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      genero: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      rg: ['', [Validators.required, Validators.maxLength(20)]],
      orgaoExpedidor: ['', Validators.required],
      estadoCivil: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      naturalidade: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(64),
        ],
      ],
      contatoEmergencia: ['', [Validators.required]],
      listaAlergias: [''],
      listaCuidados: [''],
      convenio: [''],
      numeroConvenio: [''],
      validadeConvenio: [''],
      endereco: this.fb.group({
        rua: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required],
        cep: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
          ],
        ],
        complemento: [''],
        ptoReferencia: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const pacienteId = params.get('id');
      console.log('Rota com pacienteId:', pacienteId);
      this.pacienteId = pacienteId;
      if (this.pacienteId) {
        this.pageTitleService.setPageTitle('EDIÇÃO DE PACIENTE');
        this.cdr.detectChanges();
        this.carregarPaciente(this.pacienteId);
      } else {
        this.pageTitleService.setPageTitle('CADASTRO DE PACIENTE');
        this.cdr.detectChanges();
      }
    });
  }

  consultaCEP() {
    const cepValue = this.pacienteForm.get('endereco.cep')?.value as string;
    if (cepValue && cepValue.length === 8) {
      this.consultaCepService.obterEndereco(cepValue).subscribe({
        next: (response: any) => {
          this.endereco = response;
          this.preencherCamposEndereco(response);
        },
        error: (error: any) => {
          ('');
          console.error(error);
        },
      });
    }
  }

  preencherCamposEndereco(endereco: any) {
    this.pacienteForm.patchValue({
      endereco: {
        cidade: endereco.localidade,
        estado: endereco.uf,
        rua: endereco.logradouro,
        bairro: endereco.bairro,
      },
    });
  }

  deletarPaciente() {
    if (this.pacienteId) {
      this.mostrarMensagemConfirmacao();
    }
  }

  private mostrarMensagemConfirmacao(): void {
    const snackBarRef = this.snackBar.open(
      'Tem certeza que deseja deletar este paciente?',
      'Confirmar',
      {
        duration: 5000,
      }
    );
    snackBarRef.onAction().subscribe(() => {
      this.deletarPacienteConfirmado();
    });
  }

  private deletarPacienteConfirmado(): void {
    this.pacientesService.deletarPacientePorId(this.pacienteId!).subscribe({
      next: () => this.lidarComSucessoDelecao(),
      error: (error) => this.lidarComErroDelecao(error),
    });
  }

  private lidarComSucessoDelecao(): void {
    this.snackBar.open('Paciente deletado com sucesso!', 'Fechar', {
      duration: 5000,
    });
    this.router.navigate(['home']);
  }

  private lidarComErroDelecao(error: any): void {
    console.error('Erro ao deletar paciente:', error);
    this.snackBar.open('Erro ao deletar paciente. Tente novamente.', 'Fechar', {
      duration: 5000,
    });
  }

  removerMascara(valor: string): string {
     // Remove todos os caracteres não numéricos
    return valor.replace(/\D/g, '');
  }

  formatarTelefone(valor: string): string {
    // Formata o número de telefone no formato (XX)XXXXX-XXXX
    return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1)$2-$3');
  }

  formatarCPF(valor: string): string {
    // Formata o CPF no formato XXX.XXX.XXX-XX
    return valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  formatarCEP(valor: string): string {
    // Formata o CEP no formato XXXXX-XXX
    return valor.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  carregarPaciente(pacienteId: string) {
    this.pacientesService.obterPacientePorId(pacienteId).subscribe({
      next: (paciente) => this.processarPaciente(paciente),
      error: (error) => this.lidarComErroCarregamento(error),
    });
  }

  private processarPaciente(paciente: Paciente): void {
    if (paciente) {
      console.log('Dados do paciente recebidos:', paciente);
      const formattedPaciente = this.formatarDadosPaciente(paciente);
      console.log('Dados do paciente formatados:', formattedPaciente);
      this.atualizarFormulario(formattedPaciente);
    } else {
      console.error('Paciente não encontrado');
    }
  }

  private formatarDadosPaciente(paciente: Paciente): Paciente {
    return {
      ...paciente,
      dataNascimento: Array.isArray(paciente.dataNascimento)
        ? new Date(
            paciente.dataNascimento[0],
            paciente.dataNascimento[1] - 1,
            paciente.dataNascimento[2]
          )
            .toISOString()
            .split('T')[0]
        : paciente.dataNascimento as string,
      validadeConvenio: paciente.validadeConvenio
        ? new Date(paciente.validadeConvenio).toISOString().split('T')[0]
        : paciente.validadeConvenio as string,
      endereco: {
        ...paciente.endereco,
      },
    };
  }

  private atualizarFormulario(paciente: Paciente): void {
    this.pacienteForm.patchValue(paciente);
    console.log('Formulário após patchValue:', this.pacienteForm.value);
  }

  private lidarComErroCarregamento(error: any): void {
    console.error('Erro ao carregar paciente:', error);
  }

  salvarPaciente(): void {
    console.log('Iniciando o cadastro do paciente', this.pacienteForm.value);
    console.log('Valor de nomeCompleto:', this.pacienteForm.value.nome);

    if (this.validarFormulario()) {
      const paciente: Paciente = this.formatarDadosPacienteParaEnvio(this.pacienteForm.value);

      if (this.pacienteId) {
        this.atualizarPaciente(paciente);
      } else {
        this.cadastrarPaciente(paciente);
      }
    } else {
      this.verificarErrosFormulario();
    }
  }

  private validarFormulario(): boolean {
    return this.pacienteForm.valid;
  }

  private formatarDadosPacienteParaEnvio(paciente: Paciente): Paciente {
    return {
      ...paciente,
      telefone: this.formatarTelefone(paciente.telefone),
      cpf: this.formatarCPF(paciente.cpf),
      contatoEmergencia: this.formatarTelefone(paciente.contatoEmergencia),
    };
  }

  private cadastrarPaciente(paciente: Paciente): void {
    this.pacientesService.cadastrarPaciente(paciente).subscribe({
      next: () => this.lidarComSucessoCadastro(),
      error: (error) => this.lidarComErroCadastro(error),
    });
  }

  private atualizarPaciente(paciente: Paciente): void {
    this.pacientesService.atualizarPaciente(this.pacienteId!, paciente).subscribe({
      next: () => this.lidarComSucessoAtualizacao(),
      error: (error) => this.lidarComErroAtualizacao(error),
    });
  }

  private lidarComSucessoCadastro(): void {
    this.snackBar.open('Paciente cadastrado com sucesso!', 'Fechar', {
      duration: 5000,
    });
    this.router.navigate(['/listagem-prontuario']);
  }

  private lidarComErroCadastro(error: any): void {
    console.error('Erro ao cadastrar paciente:', error);
    this.snackBar.open('Erro ao cadastrar paciente. Tente novamente.', 'Fechar', {
      duration: 5000,
    });
  }

  private lidarComSucessoAtualizacao(): void {
    this.snackBar.open('Paciente atualizado com sucesso!', 'Fechar', {
      duration: 5000,
    });
    this.router.navigate(['/listagem-prontuario']);
  }

  private lidarComErroAtualizacao(error: any): void {
    console.error('Erro ao atualizar paciente:', error);
    this.snackBar.open('Erro ao atualizar paciente. Tente novamente.', 'Fechar', {
      duration: 5000,
    });
  }

  verificarErrosFormulario(): void {
    Object.keys(this.pacienteForm.controls).forEach((key) => {
      const controlErrors = this.pacienteForm.get(key)?.errors;
      if (controlErrors) {
        console.warn(`Erros no controle ${key}:`, controlErrors);
      }
    });

    const enderecoGroup = this.pacienteForm.get('endereco') as FormGroup;
    Object.keys(enderecoGroup.controls).forEach((key) => {
      const controlErrors = enderecoGroup.get(key)?.errors;
      if (controlErrors) {
        console.warn(`Erros no controle endereco.${key}:`, controlErrors);
      }
    });
  }
}
