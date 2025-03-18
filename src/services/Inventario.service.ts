import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInventario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inventario`);
  }

  registrarInventario(inventarioData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventario`, inventarioData);
  }

  updateStockExhibe(id: string, stockExhibe: number): Observable<any> {
    return this.http.put(`http://localhost:3000/api/inventario/${id}`, { stockExhibe });
  }
  
  

  actualizarInventario(id: string, inventario: any): Observable<any> {
    return this.http.put(`http://localhost:3000/api/inventario/actualizar/${id}`, inventario);
  }
  

  eliminarInventario(id: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/inventario/${id}`);
  }
  
  
}
