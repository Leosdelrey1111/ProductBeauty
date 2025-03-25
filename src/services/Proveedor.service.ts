import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProveedores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/proveedores`);
  }

  registrarProveedor(proveedorData: any): Observable<any> {
    const data = {
      ...proveedorData,
      direccion: {
        calle: proveedorData.direccion.calle,
        numeroExterior: proveedorData.direccion.numeroExterior,
        colonia: proveedorData.direccion.colonia,
        codigoPostal: proveedorData.direccion.codigoPostal,
        ciudad: {
          nombreCiudad: proveedorData.direccion.ciudad.nombreCiudad
        }
      }
    };
    return this.http.post(`${this.apiUrl}/proveedores`, data);
  }

  actualizarProveedor(id: string, proveedorData: any): Observable<any> {
    const data = {
      ...proveedorData,
      direccion: {
        calle: proveedorData.direccion.calle,
        numeroExterior: proveedorData.direccion.numeroExterior,
        colonia: proveedorData.direccion.colonia,
        codigoPostal: proveedorData.direccion.codigoPostal,
        ciudad: {
          nombreCiudad: proveedorData.direccion.ciudad.nombreCiudad
        }
      }
    };
    return this.http.put(`${this.apiUrl}/proveedores/${id}`, data);
  }

  eliminarProveedor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/proveedores/${id}`);
  }
}