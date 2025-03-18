// src/services/proveedor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';  // Importar la configuración de entorno

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {

  private apiUrl = environment.apiUrl;  // Usar la URL definida en el archivo de entorno

  constructor(private http: HttpClient) {}

  // Obtener todos los proveedores
  getProveedores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/proveedores`);
  }

  // Registrar un proveedor
  registrarProveedor(proveedorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/proveedores`, proveedorData);
  }

  // Eliminar un proveedor
  eliminarProveedor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/proveedores/${id}`);
  }
}
