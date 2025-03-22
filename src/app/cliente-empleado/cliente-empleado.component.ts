import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Asegúrate de importar Router

@Component({
  selector: 'app-cliente-empleado',
  templateUrl: './cliente-empleado.component.html',
  styleUrls: ['./cliente-empleado.component.css']
})
export class ClienteEmpleadoComponent implements OnInit {
  productos: any[] = [];
  filteredProducts: any[] = [];  // Productos filtrados por búsqueda y categoría
  error: string = '';
  searchQuery: string = '';  // Texto de la barra de búsqueda
  categoryFilter: string = 'todos';  // Filtro de categoría por defecto (todos)
  noProductsFound: boolean = false;  // Para mostrar el mensaje cuando no se encuentren productos

  constructor(private http: HttpClient, private router: Router) {} // Inyecta Router en el constructor

  ngOnInit(): void {
    this.fetchProducts();  // Cargar los productos cuando se inicia el componente
  }

  // Función para obtener los productos desde la API
  fetchProducts() {
    this.http.get<{ message: string, productos: any[] }>('http://localhost:3000/api/productos')
      .subscribe(
        (response) => {
          this.productos = response.productos;
          this.filteredProducts = this.productos.filter(product => product.activo); // Filtrar solo los productos activos
        },
        (error) => {
          this.error = 'Error al obtener los productos';
          console.error('Error:', error);
        }
      );
  }

  // Función para filtrar productos según la categoría
  filterProducts(category: string) {
    this.categoryFilter = category;
    this.searchProducts();  // Volver a aplicar el filtro de búsqueda cuando se cambia la categoría
  }

  // Función para buscar productos basados en la categoría y el texto de búsqueda
  searchProducts() {
    let filtered = this.productos.filter(product => product.activo);  // Asegurarse de filtrar solo productos activos

    // Filtrar productos por categoría
    if (this.categoryFilter !== 'todos') {
      filtered = filtered.filter(product => product.categoriaMaquillaje === this.categoryFilter);
    }

    // Filtrar productos por nombre que empiecen con lo que el usuario escribe
    if (this.searchQuery) {
      filtered = filtered.filter(product =>
        product.nombreProducto.toLowerCase().startsWith(this.searchQuery.toLowerCase()) ||
        product.subcategoria.toLowerCase().startsWith(this.searchQuery.toLowerCase())
      );
    }

    this.filteredProducts = filtered;  // Asignar los productos filtrados
    
    // Verificar si hay productos después de la búsqueda
    this.noProductsFound = filtered.length === 0;  // Si no hay productos, se muestra el mensaje
  }

  // Función para regresar a una página anterior o redirigir a una ruta específica
  regresar(): void {
    this.router.navigate(['/empleado']);  // Redirige a la página de inicio o cualquier otra página
  }

  // Función para abrir el modal y mostrar la imagen ampliada
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

  // Función de redirección de sesión
  redirectToLogin() {
    window.location.href = '/login';
  }
}
