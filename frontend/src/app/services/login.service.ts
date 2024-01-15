import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  public getHeaders(): any {
    const token = localStorage.getItem('token');

    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  public login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/login`, user, {
      headers: this.getHeaders(),
    });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
