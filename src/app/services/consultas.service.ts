import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './authservice.service';
import { map, Observable } from 'rxjs';
import { Consulta } from '../entities/consulta.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  urlPath: string = `${environment.apiUrl}/consultas`;
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  salvarConsulta(consulta: Consulta): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(this.urlPath, consulta, { headers });
  }

  obterConsultas(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Consulta[]>(this.urlPath, { headers });
  }

  obterConsultaPorId(idConsulta: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.urlPath}/${idConsulta}`, { headers });
  }

  obterQuantidadeConsultas(): Observable<number> {
    const headers = this.authService.getAuthHeaders();
    const quantidadeConsultas = this.http
      .get<Consulta[]>(this.urlPath, { headers })
      .pipe(map((listaConsultas: Consulta[]) => listaConsultas.length));
    return quantidadeConsultas;
  }

  deletarConsulta(id: string) {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.urlPath}/${id}`, { headers });
  }

  atualizarConsulta(id: string, consultaAtualizada: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put(`${this.urlPath}/${id}`, consultaAtualizada, {
      headers,
    });
  }
}
