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
    tamaño: '',
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
    imagen: ''
  };
  editMode = false;
  selectedProducto: any = null;
  modalAbierto = false;

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

  abrirModal(): void {
    this.modalAbierto = true;
    this.editMode = false;
    this.nuevoProducto = {
      codigoBarras: '',
      nombreProducto: '',
      tamaño: '',
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
      imagen: ''
    };
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.resetFormulario();
  }

  editarProducto(producto: any): void {
    this.modalAbierto = true;
    this.editMode = true;
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
      tamaño: '',
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
      imagen: ''
    };
    this.editMode = false;
    this.selectedProducto = null;
  }
}
