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
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, role });
  }

 // auth.service.ts
getUsers(): Observable<any> {
  return this.http.get(`${this.apiUrl}/users`);
}
 // auth.service.ts - Método updateUser
updateUser(userId: string, userData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/users/${userId}`, userData);
}

  // En tu auth.service.ts
deleteUser(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/users/${id}`);
}
}