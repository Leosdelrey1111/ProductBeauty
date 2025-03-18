// src/services/historial.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';  // Importar la configuración de entorno

@Injectable({
  providedIn: 'root',
})
export class HistorialService {

  private apiUrl = environment.apiUrl;  // Usar la URL definida en el archivo de entorno

  constructor(private http: HttpClient) {}

  // Obtener historial
  getHistorial(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial`);
  }

  // Crear historial
  crearHistorial(historialData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/historial`, historialData);
  }
}
