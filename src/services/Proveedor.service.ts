import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

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

  // Actualizar un proveedor
  actualizarProveedor(id: string, proveedorData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/proveedores/${id}`, proveedorData);
  }

  // Eliminar un proveedor
  eliminarProveedor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/proveedores/${id}`);
  }
}
