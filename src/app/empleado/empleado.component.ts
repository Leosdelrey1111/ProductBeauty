import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Producto {
  _id: string;
  nombreProducto: string;
  stockExhibe: number;
  imagen: string; // Nueva propiedad para la imagen
  categoriaMaquillaje: string; // Propiedad para la categoría
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
  filteredProducts: Producto[] = []; // Productos filtrados por categoría
  notificationMessage: string = '';
  categoryFilter: string = 'todos'; // Filtro de categoría por defecto

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerInventario();
  }

  obtenerInventario() {
    this.http.get<ProductoResponse>('http://localhost:3000/api/productos')
      .subscribe(
        (response) => {
          if (response && response.productos) {
            this.inventario = response.productos;
            this.filteredProducts = this.inventario; // Mostrar todos los productos al inicio
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

  // Filtrar productos por categoría
  filterProducts(category: string) {
    this.categoryFilter = category;
    if (category === 'todos') {
      this.filteredProducts = this.inventario; // Mostrar todos los productos
    } else {
      this.filteredProducts = this.inventario.filter(
        (producto) => producto.categoriaMaquillaje === category
      );
    }
  }

  actualizarCantidad(producto: Producto) {
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
        setTimeout(() => this.notificationMessage = '', 3000); // Ocultar notificación después de 3 segundos
      },
      (error) => {
        this.notificationMessage = `Error al actualizar el inventario: ${error.message}`;
        setTimeout(() => this.notificationMessage = '', 3000); // Ocultar notificación después de 3 segundos
      }
    );
  }

  actualizarProducto(producto: Producto) {
    this.http.put(`http://localhost:3000/api/productos/${producto._id}`, {
      stockExhibe: producto.stockExhibe
    }).subscribe(
      (response) => {
        const index = this.inventario.findIndex(p => p._id === producto._id);
        if (index !== -1) {
          this.inventario[index].stockExhibe = producto.stockExhibe;
        }
        this.notificationMessage = 'Producto actualizado correctamente';
        setTimeout(() => this.notificationMessage = '', 3000); // Ocultar notificación después de 3 segundos
      },
      (error) => {
        this.notificationMessage = `Error al actualizar el producto: ${error.message}`;
        setTimeout(() => this.notificationMessage = '', 3000); // Ocultar notificación después de 3 segundos
      }
    );
  }

  // Función para abrir el modal con la imagen ampliada
  openModal(imageSrc: string) {
    const modal = document.getElementById("product-modal")!;
    const modalImg = document.getElementById("modal-img")! as HTMLImageElement;
    modal.style.display = "block";
    modalImg.src = imageSrc;
  }

  // Función para cerrar el modal
  closeModal() {
    const modal = document.getElementById("product-modal")!;
    modal.style.display = "none";
  }

  // Función para cerrar sesión
  cerrarSesion() {
    // Lógica para cerrar sesión
    console.log('Cerrando sesión...');
    this.router.navigate(['/cliente']); // Redirigir al login
  }
}