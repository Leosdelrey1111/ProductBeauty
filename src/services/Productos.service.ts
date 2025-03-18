// productos.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) { }

    // Obtener un producto por ID
    getProductoById(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/productos/${id}`);
    }

  getProductos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  registrarProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  actualizarProducto(id: string, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  bajaTemporalProducto(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/baja-temporal/${id}`, { activo: false });
  }
  
    // Reactivar un producto
    reactivarProducto(id: string): Observable<any> {
      return this.http.patch(`${this.apiUrl}/reactivar/${id}`, { activo: true });
    }
    
}
