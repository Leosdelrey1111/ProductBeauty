// src/services/inventario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';  // Importar la configuración de entorno

@Injectable({
  providedIn: 'root',
})
export class InventarioService {

  private apiUrl = environment.apiUrl;  // Usar la URL definida en el archivo de entorno

  constructor(private http: HttpClient) {}

  // Obtener el inventario
  getInventario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inventario`);
  }

  // Registrar un nuevo inventario
  registrarInventario(inventarioData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventario`, inventarioData);
  }
}
