import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
  
  register(email: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password, role });
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, userData);
  }
}