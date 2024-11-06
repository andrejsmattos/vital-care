import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Paciente } from '../entities/paciente.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { AuthService } from './authservice.service';
import { apiUrl } from '../environments/environment';
import { UserStorageService } from './users-storage.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  urlPath: string = `${apiUrl}/pacientes`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly userService: UserStorageService
  ) {}

  atualizarPaciente(id: string, paciente: Paciente): Observable<Paciente> {
    const headers = this.userService.getAuthHeaders();
    return this.http
      .put<Paciente>(`${this.urlPath}/${id}`, paciente, { headers })
      .pipe(
        tap((response) =>
          console.log('Paciente editado com sucesso:', response)
        ),
        catchError(this.handleError)
      );
  }

  cadastrarPaciente(paciente: Paciente): Observable<any> {
    const headers = this.userService.getAuthHeaders();
    console.log('Paciente a ser enviado:', paciente);
    // console.log('Headers:', headers);
    return this.http.post(this.urlPath, paciente, { headers }).pipe(
      tap((response) => console.log('Paciente salvo com sucesso:', response)),
      catchError(this.handleError)
    );
  }

  obterPacientes(): Observable<Paciente[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http
      .get<{ pacientes: Paciente[] }>(this.urlPath, {
        headers,
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          // console.log('Backend response status:', response.status);
          // console.log('Backend response headers:', response.headers);
          // console.log('Backend response body:', response.body);
        }),
        map((response) => response.body?.pacientes || [])
      );
  }

  getPacientePorId(id: string): Observable<Paciente> {
    const headers = this.authService.getAuthHeaders();
    return this.http
      .get<Paciente>(`${this.urlPath}/${id}`, { headers })
      .pipe(tap((response) => console.log('Backend response:', response)));
  }

  obterPacientePorId(id: string): Observable<Paciente> {
    const headers = this.userService.getAuthHeaders();
    return this.http
      .get<Paciente>(`${this.urlPath}/${id}`, { headers, observe: 'response' })
      .pipe(
        tap((response) => {
          console.log('Backend response status:', response.status);
          console.log('Backend response headers:', response.headers);
          console.log('Backend response body:', response.body);
        }),
        map((response) => response.body as Paciente)
      );
  }

  obterPacientesPorNomeOuPorId(buscaInput: string): Observable<Paciente[]> {
    const headers = this.authService.getAuthHeaders();
    // console.log('getPacientesPorNomeOuPorId chamado com:', buscaInput);

    if (this.isNumeric(buscaInput)) {
      const url = `${this.urlPath}?id=${buscaInput}`;
      console.log('URL para busca por ID:', url);

      return this.http
        .get<{ pacientes: Paciente[] }>(url, { headers, observe: 'response' })
        .pipe(
          tap((response) => {
            console.log('Status:', response.status);
            console.log('Headers:', response.headers);
            console.log('Body:', response.body);
          }),
          map((response) => response.body?.pacientes || [])
        );
    } else {
      const url = `${this.urlPath}?nome=${buscaInput}`;
      console.log('URL para busca por nome:', url);

      return this.http
        .get<{ pacientes: Paciente[] }>(url, { headers, observe: 'response' })
        .pipe(
          tap((response) => {
            console.log('Status:', response.status);
            console.log('Headers:', response.headers);
            console.log('Body:', response.body);
          }),
          map((response) => response.body?.pacientes || [])
        );
    }
  }

  isNumeric(buscaInput: string) {
    return /^\d+$/.test(buscaInput);
  }

  obterPacientesPorNomeEmailOuTelefone(buscaInput: string): Observable<Paciente[]> {
    const headers = this.authService.getAuthHeaders();
    // console.log('obterPacientesPorNomeEmailOuTelefone chamado com:', buscaInput);

    const buscaSemFormatacao = this.removerFormatacaoTelefone(buscaInput);

    let params: any = {};

    if (this.isNumeric(buscaSemFormatacao)) {
      params.telefone = buscaSemFormatacao;
    } else if (this.isEmail(buscaInput)) {
      params.email = buscaInput;
    } else {
      params.nome = buscaInput;
    }

    console.log('Parâmetros para busca:', params);

    return this.http
      .get<{ pacientes: Paciente[] }>(this.urlPath, {
        headers,
        params,
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          console.log('Status:', response.status);
          console.log('Headers:', response.headers);
          console.log('Body:', response.body);
        }),
        map((response) => response.body?.pacientes || [])
      );
  }

  private isEmail(value: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  }

  private removerFormatacaoTelefone(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }

  deletarPacientePorId(id: string): Observable<void> {
    const headers = this.userService.getAuthHeaders();
    return this.http.delete<void>(`${this.urlPath}/${id}`, { headers });
  }

  // private logResponse(response: HttpResponse<any>): void {
  //   console.log('Backend response status:', response.status);
  //   console.log('Backend response headers:', response.headers);
  //   console.log('Backend response body:', response.body);
  // }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Detalhes do erro:', error);
    if (error.error instanceof ErrorEvent) {
      // Erros do lado do cliente ou de rede
      console.error('Erro do lado do cliente:', error.error.message);
    } else {
      // Erros retornados pelo backend
      console.error(
        `Backend retornou o código ${error.status}, ` +
          `corpo do erro: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(
      () =>
        new Error(
          'Ocorreu um erro ao processar a requisição. Verifique os detalhes e tente novamente.'
        )
    );
  }
}
