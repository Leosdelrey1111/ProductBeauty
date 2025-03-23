import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/Productos.service';
import { ProveedorService } from '../../services/Proveedor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css']
})
export class AlmacenComponent implements OnInit {

  productos: any[] = [];
  proveedores: any[] = [];
  nuevoProducto = {
    codigoBarras: '',
    nombreProducto: '',
    tamano: '',
    categoriaMaquillaje: '',
    subcategoria: '',
    marca: '',
    nombreProveedor: '',
    precioCaja: '',
    precioPieza: '',
    cantidadPorCaja: '',
    cantidadPiezas: '',
    stockExhibe: '',
    stockExhibeMin: '',
    stockAlmacen: '',
    stockAlmacenMin: '',
    imagen: '',
    cantidadCajasLote: '', 
    fechaCaducidadLote: '', 
    activo: true
  };
  editMode = false;
  selectedProducto: any = null;
  modalAbierto = false;
  viewMode = false;
  modalBajaAbierto = false;
  productoSeleccionado: any = null;

  mostrarInventario = true;  // Control para mostrar inventarios
  mostrarProveedores = false; // Control para mostrar proveedores

  constructor(
    private productosService: ProductosService,
    private proveedorService: ProveedorService,
    private router: Router  
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerProveedores();
  }

  obtenerProductos(): void {
    this.productosService.getProductos().subscribe(
      (data) => {
        this.productos = data.productos || [];
      },
      (error) => {
        console.error('Error al obtener productos', error);
      }
    );
  }

  obtenerProveedores(): void {
    this.proveedorService.getProveedores().subscribe(
      (data) => {
        this.proveedores = data || [];
      },
      (error) => {
        console.error('Error al obtener proveedores', error);
      }
    );
  }


  abrirProveedores(): void {
    this.router.navigate(['/proveedores']);  // Navegar a la pantalla de proveedores
  }

  abrirInventarios(): void {
    this.router.navigate(['/inventarios']);  // Navegar a la pantalla de inventario
  }
  

  abrirHistorial(): void {
    this.router.navigate(['/historial']);  // Navegar a la pantalla de inventario
  }

  adduser(): void {
    this.router.navigate(['/register']);  // Navegar a la pantalla de inventario
  }

  // Funciones relacionadas con los productos (agregar, editar, eliminar, etc.)
  verDetallesProducto(producto: any): void {
    this.viewMode = true;
    this.selectedProducto = producto;
    this.nuevoProducto = { ...producto };
    this.modalAbierto = true;
  }

  abrirModal(): void {
    this.modalAbierto = true;
    this.editMode = false;
    this.viewMode = false;
    this.nuevoProducto = {
      codigoBarras: '',
      nombreProducto: '',
      tamano: '',
      categoriaMaquillaje: '',
      subcategoria: '',
      marca: '',
      nombreProveedor: '',
      precioCaja: '',
      precioPieza: '',
      cantidadPorCaja: '',
      cantidadPiezas: '',
      stockExhibe: '',
      stockExhibeMin: '',
      stockAlmacen: '',
      stockAlmacenMin: '',
      imagen: '',
      cantidadCajasLote: '',
      fechaCaducidadLote: '',
      activo: true
    };
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.resetFormulario();
  }

  editarProducto(producto: any): void {
    this.modalAbierto = true;
    this.editMode = true;
    this.viewMode = false;
    this.selectedProducto = producto;
    this.nuevoProducto = { ...producto };
  }

  agregarProducto(): void {
    if (this.editMode) {
      this.productosService.actualizarProducto(this.selectedProducto._id, this.nuevoProducto).subscribe(
        (data) => {
          this.obtenerProductos();
          this.cerrarModal();
        },
        (error) => {
          console.error('Error al actualizar producto', error);
        }
      );
    } else {
      if (!this.nuevoProducto.cantidadCajasLote || !this.nuevoProducto.fechaCaducidadLote || !this.nuevoProducto.codigoBarras || !this.nuevoProducto.nombreProducto) {
        console.error('Faltan campos requeridos');
        alert("Por favor complete todos los campos requeridos.");
        return;
      }

      this.productosService.registrarProducto(this.nuevoProducto).subscribe(
        (data) => {
          this.obtenerProductos();
          this.cerrarModal();
        },
        (error) => {
          console.error('Error al agregar producto', error);
        }
      );
    }
  }

  // Función para manejar la baja de productos
  abrirModalBaja(producto: any): void {
    this.productoSeleccionado = producto;
    this.modalBajaAbierto = true;
  }

  cerrarModalBaja(): void {
    this.modalBajaAbierto = false;
    this.productoSeleccionado = null;
  }

  eliminarProducto(id: string, bajaTipo: string): void {
    if (bajaTipo === 'física') {
      this.productosService.eliminarProducto(id).subscribe(
        (data) => {
          this.obtenerProductos();
          this.cerrarModalBaja();
        },
        (error) => {
          console.error('Error al eliminar producto', error);
        }
      );
    } else if (bajaTipo === 'temporal') {
      this.productosService.bajaTemporalProducto(id).subscribe(
        (data) => {
          this.obtenerProductos();
          this.cerrarModalBaja();
        },
        (error) => {
          console.error('Error al dar baja temporal al producto', error);
        }
      );
    }
  }

  // Reactivar producto
  reactivarProducto(id: string): void {
    this.productosService.reactivarProducto(id).subscribe(
      (data) => {
        this.obtenerProductos(); 
      },
      (error) => {
        console.error('Error al reactivar producto', error);
      }
    );
  }

  resetFormulario(): void {
    this.nuevoProducto = {
      codigoBarras: '',
      nombreProducto: '',
      tamano: '',
      categoriaMaquillaje: '',
      subcategoria: '',
      marca: '',
      nombreProveedor: '',
      precioCaja: '',
      precioPieza: '',
      cantidadPorCaja: '',
      cantidadPiezas: '',
      stockExhibe: '',
      stockExhibeMin: '',
      stockAlmacen: '',
      stockAlmacenMin: '',
      imagen: '',
      cantidadCajasLote: '',
      fechaCaducidadLote: '',
      activo: true
    };
    this.editMode = false;
    this.selectedProducto = null;
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    console.log("Cerrando sesión...");
      this.router.navigate(['/cliente']);  // Navegar a la pantalla de inventario
  }
}
