import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  inventario: any[] = []; // Para almacenar los productos
  notificationMessage: string = ''; // Para mostrar mensajes de notificación

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerInventario(); // Obtener los productos al iniciar
  }

  // Función para obtener los productos desde el backend
  obtenerInventario() {
    this.http.get<any[]>('http://localhost:3000/api/inventario')
      .subscribe(
        (response) => {
          console.log('Productos obtenidos: ', response);  // Log para depuración
          this.inventario = response; // Almacenar los productos en la variable
        },
        (error) => {
          console.error('Error al obtener el inventario', error);
          this.notificationMessage = 'Error al obtener los productos.';
        }
      );
  }

  // Función para actualizar la cantidad de un producto
  actualizarCantidad(producto: any) {
    this.http.put(`http://localhost:3000/api/inventario/${producto._id}`, {
      stockExhibe: producto.stockExhibe
    })
    .subscribe(
      (response) => {
        console.log('Respuesta al actualizar producto: ', response);  // Log para depuración
        // Actualizamos la cantidad directamente en la lista local sin hacer una nueva solicitud GET
        const index = this.inventario.findIndex(p => p._id === producto._id);
        if (index !== -1) {
          this.inventario[index].stockExhibe = producto.stockExhibe;
        }

        this.notificationMessage = 'Cantidad actualizada correctamente';
      },
      (error) => {
        console.error('Error al actualizar la cantidad', error);
        this.notificationMessage = `Error al actualizar la cantidad: ${error.message}`;
      }
    );
  }
}
