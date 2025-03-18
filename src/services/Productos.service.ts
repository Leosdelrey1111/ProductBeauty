// src/services/productos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';  // Importar la configuración de entorno

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = environment.apiUrl;  // Usar la URL definida en el archivo de entorno

  constructor(private http: HttpClient) {}

  
  // Obtener un producto por ID
  getProductoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/${id}`);
  }
  // Obtener todos los productos
  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`);
  }

  // Registrar un nuevo producto
  registrarProducto(productData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, productData);
  }

  // Actualizar un producto por ID
  actualizarProducto(id: string, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, productData);
  }

  // Eliminar un producto por ID
  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
}
