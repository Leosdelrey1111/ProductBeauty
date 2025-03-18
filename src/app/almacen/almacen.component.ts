import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/Productos.service';
import { ProveedorService } from '../../services/Proveedor.service';

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
    cantidadCajasLote: '', // Added field for Lote quantity
    fechaCaducidadLote: '' // Added field for Lote expiration date
  };
  editMode = false;
  selectedProducto: any = null;
  modalAbierto = false;
  viewMode = false; // Nuevo estado para ver detalles

  constructor(
    private productosService: ProductosService,
    private proveedorService: ProveedorService
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

  verDetallesProducto(producto: any): void {
    this.viewMode = true;
    this.selectedProducto = producto;
    this.nuevoProducto = { ...producto }; // Copiar los datos del producto al formulario
    this.modalAbierto = true; // Abrir el modal
  }

  abrirModal(): void {
    this.modalAbierto = true;
    this.editMode = false;
    this.viewMode = false; // Resetear viewMode cuando se abre el modal para agregar
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
      fechaCaducidadLote: ''
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
      // Check if all necessary fields are filled
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

  eliminarProducto(id: string): void {
    this.productosService.eliminarProducto(id).subscribe(
      (data) => {
        this.obtenerProductos();
      },
      (error) => {
        console.error('Error al eliminar producto', error);
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
      fechaCaducidadLote: ''
    };
    this.editMode = false;
    this.selectedProducto = null;
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    // Lógica para cerrar sesión
    console.log("Cerrando sesión...");
    // Aquí podrías implementar la lógica de cierre de sesión, como redirigir al usuario o eliminar tokens.
  }
}
