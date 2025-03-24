import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../services/Inventario.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar Snackbar

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {

  inventarios: any[] = [];
  nuevoInventario = {
    _id: '', // Agregar _id opcional para edición
    loteCaja: '',
    nombreProveedor: '',
    nombreProducto: '',
    cantidadCajasLote: 0,
    stockExhibe: 0,
    stockExhibeMin: 0,
    stockAlmacen: 0,
    stockAlmacenMin: 0,
    fechaCaducidadLote: ''
  };
  inventarioSeleccionado: any = null;
  editMode = false;
  modalAbierto = false;
  modalConfirmacion = false;

  constructor(
    private inventarioService: InventarioService,
    private location: Location,
    private snackBar: MatSnackBar // Inyectar Snackbar
  ) {}

  ngOnInit(): void {
    this.obtenerInventarios();
  }

  regresar(): void {
    this.location.back();  // Regresar a la página anterior
  }

  listaOculta: boolean = true; // Inicialmente, la lista está oculta

  // Define el método toggleInventario
  toggleInventario() {
    this.listaOculta = !this.listaOculta; // Cambia el valor de listaVisible
  }

  obtenerInventarios(): void {
    this.inventarioService.getInventario().subscribe(
      data => {
        this.inventarios = data;
        // Verificar que la fecha es válida y formatearla correctamente
        this.inventarios.forEach(inventario => {
          if (inventario.fechaCaducidadLote) {
            inventario.fechaCaducidadLote = this.formatDate(inventario.fechaCaducidadLote);
          }
        });
      },
      error => {
        console.error('Error al obtener inventarios', error);
        this.mostrarMensaje('Error al obtener inventarios', 'error');
      }
    );
  }

  formatDate(date: string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return ''; // Retornar una cadena vacía si la fecha es inválida
    }
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Mostrar mensaje de éxito o error
  mostrarMensaje(mensaje: string, tipo: 'exito' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000, // Duración de 3 segundos
      panelClass: tipo === 'exito' ? 'snackbar-exito' : 'snackbar-error', // Estilos personalizados
    });
  }

  // Crear o actualizar inventario
  guardarInventario(): void {
    if (this.editMode) {
      if (this.nuevoInventario._id) {
        this.inventarioService.actualizarInventario(this.nuevoInventario._id, this.nuevoInventario).subscribe(
          data => {
            this.obtenerInventarios(); // Refresh the inventory list
            this.cerrarModal(); // Close modal after successful update
            this.mostrarMensaje('Inventario actualizado con éxito', 'exito');
          },
          error => {
            console.error('Error al actualizar inventario', error);
            this.mostrarMensaje('Error al actualizar inventario', 'error');
          }
        );
      } else {
        console.error('ID del inventario no disponible para actualización');
        this.mostrarMensaje('Error: ID no disponible', 'error');
      }
    } else {
      this.inventarioService.registrarInventario(this.nuevoInventario).subscribe(
        data => {
          this.obtenerInventarios(); // Refresh the inventory list
          this.cerrarModal(); // Close modal after adding the new inventory
          this.mostrarMensaje('Inventario agregado con éxito', 'exito');
        },
        error => {
          console.error('Error al agregar inventario', error);
          this.mostrarMensaje('Error al agregar inventario', 'error');
        }
      );
    }
  }

  // Editar inventario
  editarInventario(inventario: any): void {
    this.nuevoInventario = { ...inventario };
    this.editMode = true;
    this.modalAbierto = true;
  }

  // Eliminar inventario
  eliminarInventario(id: string): void {
    this.inventarioService.eliminarInventario(id).subscribe(
      data => {
        this.obtenerInventarios(); // Refresh the inventory list
        this.mostrarMensaje('Inventario eliminado con éxito', 'exito');
      },
      error => {
        console.error('Error al eliminar inventario', error);
        this.mostrarMensaje('Error al eliminar inventario', 'error');
      }
    );
  }

  // Actualizar stockExhibe
  actualizarStockExhibe(id: string, stockExhibe: number): void {
    this.inventarioService.updateStockExhibe(id, stockExhibe).subscribe(
      data => {
        this.obtenerInventarios(); // Refresh the inventory list
        this.mostrarMensaje('Stock Exhibición actualizado', 'exito');
      },
      error => {
        console.error('Error al actualizar stockExhibe', error);
        this.mostrarMensaje('Error al actualizar stockExhibe', 'error');
      }
    );
  }

  // Abrir el modal
  abrirModal(): void {
    this.modalAbierto = true;
    this.editMode = false;
    this.nuevoInventario = {
      _id: '', // Asegúrate de resetear el _id al abrir el modal para agregar nuevo inventario
      loteCaja: '',
      nombreProveedor: '',
      nombreProducto: '',
      cantidadCajasLote: 0,
      stockExhibe: 0,
      stockExhibeMin: 0,
      stockAlmacen: 0,
      stockAlmacenMin: 0,
      fechaCaducidadLote: ''
    };
  }

  // Cerrar el modal
  cerrarModal(): void {
    this.modalAbierto = false;
    this.modalConfirmacion = false;
  }

  confirmarEliminacion(inventario: any): void {
    this.inventarioSeleccionado = inventario;
    this.modalConfirmacion = true;
  }

  // Cerrar modal de confirmación
  cerrarModalConfirmacion(): void {
    this.modalConfirmacion = false;
  }
}
