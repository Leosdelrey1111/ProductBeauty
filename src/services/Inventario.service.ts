import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = `${environment.apiUrl}/inventario`;

  constructor(private http: HttpClient) { }

  getInventario(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  registrarInventario(inventario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, inventario);
  }

  actualizarInventario(id: string, inventario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inventario);
  }

  eliminarInventario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateStockExhibe(id: string, stockExhibe: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/stock`, { stockExhibe });
  }
}