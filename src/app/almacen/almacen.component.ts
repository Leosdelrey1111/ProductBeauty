import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductosService } from '../../services/Productos.service';
import { ProveedorService } from '../../services/Proveedor.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css']
})
export class AlmacenComponent implements OnInit {
  @ViewChild('productoForm') productoForm!: NgForm;
  
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
    precioCaja: 0,
    precioPieza: 0,
    cantidadPorCaja: 0,
    cantidadPiezas: 0,
    stockExhibe: 0,
    stockExhibeMin: 0,
    stockAlmacen: 0,
    stockAlmacenMin: 0,
    imagen: '',
    cantidadCajasLote: 0,
    fechaCaducidadLote: '',
    activo: true
  };
  editMode = false;
  selectedProducto: any = null;
  modalAbierto = false;
  viewMode = false;
  modalBajaAbierto = false;
  productoSeleccionado: any = null;
  notificationMessage: string = '';
  formSubmitted = false;

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
        this.mostrarNotificacion('Error al obtener productos');
      }
    );
  }

  obtenerProveedores(): void {
    this.proveedorService.getProveedores().subscribe(
      (data) => {
        this.proveedores = data || [];
      },
      (error) => {
        this.mostrarNotificacion('Error al obtener proveedores');
      }
    );
  }

  abrirProveedores(): void {
    this.router.navigate(['/proveedores']);
  }

  abrirInventarios(): void {
    this.router.navigate(['/inventarios']);
  }
  
  abrirHistorial(): void {
    this.router.navigate(['/historial']);
  }

  adduser(): void {
    this.router.navigate(['/register']);
  }

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
    this.formSubmitted = false;
    this.resetFormulario();
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.formSubmitted = false;
    this.resetFormulario();
  }

  editarProducto(producto: any): void {
    this.modalAbierto = true;
    this.editMode = true;
    this.viewMode = false;
    this.formSubmitted = false;
    this.selectedProducto = producto;
    this.nuevoProducto = { ...producto };
  }

  agregarProducto(): void {
    this.formSubmitted = true;
    
    if (this.productoForm.invalid) {
      this.mostrarNotificacion('Por favor complete todos los campos requeridos correctamente');
      return;
    }

    if (this.editMode) {
      this.productosService.actualizarProducto(this.selectedProducto._id, this.nuevoProducto).subscribe(
        (data) => {
          this.obtenerProductos();
          this.cerrarModal();
          this.mostrarNotificacion('Producto actualizado correctamente');
        },
        (error) => {
          this.mostrarNotificacion('Error al actualizar producto: ' + error.message);
        }
      );
    } else {
      this.productosService.registrarProducto(this.nuevoProducto).subscribe(
        (data) => {
          this.obtenerProductos();
          this.cerrarModal();
          this.mostrarNotificacion('Producto agregado correctamente');
        },
        (error) => {
          this.mostrarNotificacion('Error al agregar producto: ' + error.message);
        }
      );
    }
  }

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
          this.mostrarNotificacion('Producto eliminado correctamente');
        },
        (error) => {
          this.mostrarNotificacion('Error al eliminar producto');
        }
      );
    } else if (bajaTipo === 'temporal') {
      this.productosService.bajaTemporalProducto(id).subscribe(
        (data) => {
          this.obtenerProductos();
          this.cerrarModalBaja();
          this.mostrarNotificacion('Producto dado de baja temporalmente');
        },
        (error) => {
          this.mostrarNotificacion('Error al dar baja temporal al producto');
        }
      );
    }
  }

  reactivarProducto(id: string): void {
    this.productosService.reactivarProducto(id).subscribe(
      (data) => {
        this.obtenerProductos();
        this.mostrarNotificacion('Producto reactivado correctamente');
      },
      (error) => {
        this.mostrarNotificacion('Error al reactivar producto');
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
      precioCaja: 0,
      precioPieza: 0,
      cantidadPorCaja: 0,
      cantidadPiezas: 0,
      stockExhibe: 0,
      stockExhibeMin: 0,
      stockAlmacen: 0,
      stockAlmacenMin: 0,
      imagen: '',
      cantidadCajasLote: 0,
      fechaCaducidadLote: '',
      activo: true
    };
    this.editMode = false;
    this.selectedProducto = null;
    if (this.productoForm) {
      this.productoForm.resetForm();
    }
  }

  cerrarSesion(): void {
    this.router.navigate(['/cliente']);
  }

  mostrarNotificacion(mensaje: string): void {
    this.notificationMessage = mensaje;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000);
  }

  // Validación personalizada para fechas futuras
  validarFechaFutura(fecha: string): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaCaducidad = new Date(fecha);
    return fechaCaducidad > hoy;
  }
}