import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor ( private readonly http: HttpClient ){}

  obterEndereco(cep: any): Observable<any>{
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }
}
