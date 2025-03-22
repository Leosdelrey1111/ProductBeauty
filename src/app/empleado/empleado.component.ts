import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Producto {
  _id: string;
  nombreProducto: string;
  stockExhibe: number;
}

interface ProductoResponse {
  message: string;
  productos: Producto[];
}

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  inventario: Producto[] = [];
  notificationMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerInventario();
  }

  obtenerInventario() {
    this.http.get<ProductoResponse>('http://localhost:3000/api/productos')
      .subscribe(
        (response) => {
          if (response && response.productos) {
            this.inventario = response.productos;
          } else {
            this.notificationMessage = 'No se encontraron productos.';
          }
        },
        (error) => {
          console.error('Error al obtener el inventario', error);
          this.notificationMessage = 'Error al obtener los productos.';
        }
      );
  }

  actualizarCantidad(producto: Producto) {
    console.log("Valor stockExhibe antes de actualizar:", producto.stockExhibe);  // Aquí verificamos el valor antes de enviarlo
    if (producto._id && producto.stockExhibe !== undefined) {
      this.actualizarInventario(producto);
      this.actualizarProducto(producto);
    } else {
      this.notificationMessage = 'ID o stockExhibe no son válidos';
    }
  }
  
  

  actualizarInventario(producto: Producto) {
    this.http.put(`http://localhost:3000/api/inventarios/${producto._id}`, {
      stockExhibe: producto.stockExhibe
    })
    .subscribe(
      (response) => {
        this.notificationMessage = 'Inventario actualizado correctamente';
      },
      (error) => {
        this.notificationMessage = `Error al actualizar el inventario: ${error.message}`;
      }
    );
  }

  actualizarProducto(producto: Producto) {
    this.http.put(`http://localhost:3000/api/productos/${producto._id}`, {
      stockExhibe: producto.stockExhibe
    }).subscribe(
      (response) => {
        console.log("Respuesta del backend:", response);  // Verifica la respuesta
        const index = this.inventario.findIndex(p => p._id === producto._id);
        if (index !== -1) {
          this.inventario[index].stockExhibe = producto.stockExhibe;
        }
        this.notificationMessage = 'Producto actualizado correctamente';
      },
      (error) => {
        this.notificationMessage = `Error al actualizar el producto: ${error.message}`;
      }
    );
  }
}  