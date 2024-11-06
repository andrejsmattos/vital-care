import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../environments/environment';
import { User } from '../entities/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  isLogged: boolean = false;
  token: string | null = null;
  private profile: string | undefined;

  constructor(private readonly http: HttpClient) {}

  urlPath: string = `${apiUrl}/usuarios`;

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if(!this.token) {
      this.token = localStorage.getItem('token');
    }
    // console.log('Token recuperado:', this.token);
    return this.token;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if(token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    } else {
      console.error('Nenhum token encontrado!');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  addUser(user: any): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.post<User>(`${this.urlPath}/pre-registro`, user, { headers });
  };

  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(this.urlPath, { headers });
  }

  setLoggedUser(user: any): void {
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  getLoggedUser(): any {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      return JSON.parse(loggedUser);
    } else {
      localStorage.setItem('loggedUser', JSON.stringify([]));
      return [];
    }
  }

  removeLoggedUser(): void {
    localStorage.removeItem('loggedUser');
  }

  removeUser(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.urlPath}/${id}`, { headers });
  }

  getUsersByEmailOrById(buscaInput: string) {
    const headers = this.getAuthHeaders();

    if (this.isNumeric(buscaInput)) {
      return this.http.get<User>(`${this.urlPath}?id=${buscaInput}`, { headers });
    } else {
      return this.http.get<User>(`${this.urlPath}?email=${buscaInput}`, { headers });
    }
  }

  isNumeric(buscaInput: string) {
    return /^\d+$/.test(buscaInput);
  }
  
  getUserById(id: string): Observable<User> {
    const headers = this.getAuthHeaders();
    const url = `${this.urlPath}/${id}`;
    return this.http.get<User>(url, { headers });
  }
  
  updateUser(id: string, user: any): Observable<User> {
    const headers = this.getAuthHeaders();
    console.log("Usuário: " + user);
    return this.http.put<User>(`${this.urlPath}/${id}`, user, { headers });
  }

  searchUserByEmail(buscaInput: string): Observable<User> {
    const url = `${this.urlPath}/email`;
    return this.http.get<User>(`${this.urlPath}?email=${buscaInput}`);
  }

  updatePassword(email: string, password: string): Observable<void> {
    const url = `${this.urlPath}/email/${email}/redefinir-senha`;
    return this.http.patch<void>(url, { password });
  }

  setProfile(profile: string): void {
    this.profile = profile;
    localStorage.setItem('profile', profile);
    console.log('Profile armazenado:', profile);
}

  getProfile(): string {
    if (!this.profile) {
      this.profile = localStorage.getItem('profile') || '';
    }
    return this.profile;
  }  
}
