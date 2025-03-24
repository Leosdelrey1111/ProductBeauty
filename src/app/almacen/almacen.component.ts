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
  notificationMessage: string = '';

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
          this.mostrarNotificacion('Producto actualizado correctamente');
        },
        (error) => {
          this.mostrarNotificacion('Error al actualizar producto');
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
          this.mostrarNotificacion('Error al agregar producto');
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

  cerrarSesion(): void {
    this.router.navigate(['/cliente']);
  }

  mostrarNotificacion(mensaje: string): void {
    this.notificationMessage = mensaje;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000);
  }
}