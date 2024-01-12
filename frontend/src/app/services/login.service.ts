import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  public getHeaders() :any {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');

    // if (token) {
    //   headers.set('Authorization', `Bearer ${token}`);
    // }
    // return headers;

    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  // public get<T>(url: string): Observable<T> {
  //   return this.http.get<T>(`${this.apiUrl}/${url}`, {
  //     headers: this.getHeaders(),
  //   });
  // }

  // public post<T>(url: string, data: any): Observable<T> {
  //   return this.http.post<T>(`${this.apiUrl}/${url}`, data, {
  //     headers: this.getHeaders(),
  //   });
  // }
  public login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/login`, user, {headers: this.getHeaders()});
  }
}
