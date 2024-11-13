import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './authservice.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private urlPath = `${environment.apiUrl}/dashboard`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getDashboardData(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(this.urlPath, { headers });
  }
}
