import { Component, OnInit, ViewChild } from '@angular/core';
import { InventarioService } from '../../services/Inventario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Location } from '@angular/common';
@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {
  @ViewChild('inventarioForm') inventarioForm!: NgForm;

  inventarios: any[] = [];
  filteredInventarios: any[] = [];
  nuevoInventario: any = {
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
  formSubmitted = false;
  searchTerm = '';
  filterField = 'nombreProducto';
  showShake = false;
  confirmOverride = false;

  constructor(
    private inventarioService: InventarioService,
    private snackBar: MatSnackBar,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario(): void {
    this.inventarioService.getInventario().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.inventarios = response.data.map((item: any) => ({
            ...item,
            fechaCaducidadLote: item.fechaCaducidadLote || ''
          }));
          this.filtrarInventarios();
        } else {
          this.mostrarMensaje(response.message || 'Error al cargar el inventario', 'error');
        }
      },
      error: (err) => {
        console.error('Error al cargar inventario:', err);
        this.mostrarMensaje('Error al cargar el inventario', 'error');
      }
    });
  }

  filtrarInventarios(): void {
    if (!this.searchTerm) {
      this.filteredInventarios = [...this.inventarios];
      return;
    }

    this.filteredInventarios = this.inventarios.filter(inv => 
      inv[this.filterField]?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  validarFechaFutura(fecha: string): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaCaducidad = new Date(fecha);
    return fechaCaducidad > hoy;
  }

  isNearExpiration(fecha: string): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaCad = new Date(fecha);
    const diffTime = fechaCad.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }

  isExpired(fecha: string): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaCad = new Date(fecha);
    return fechaCad < hoy;
  }

  guardarInventario(): void {
    this.formSubmitted = true;
    
    if (this.inventarioForm.invalid) {
      this.mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (!this.validarFechaFutura(this.nuevoInventario.fechaCaducidadLote)) {
      this.mostrarMensaje('La fecha de caducidad debe ser futura', 'error');
      return;
    }

    const datosParaEnviar = { 
      ...this.nuevoInventario,
      fechaCaducidadLote: this.nuevoInventario.fechaCaducidadLote
    };

    const operacion = this.editMode 
      ? this.inventarioService.actualizarInventario(this.nuevoInventario._id, datosParaEnviar)
      : this.inventarioService.registrarInventario(datosParaEnviar);

    operacion.subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cargarInventario();
          this.cerrarModal();
          this.mostrarMensaje(
            this.editMode ? 'Inventario actualizado con éxito' : 'Inventario creado con éxito', 
            'success'
          );
        } else {
          this.mostrarMensaje(response.message || 'Operación fallida', 'error');
        }
      },
      error: (err) => {
        console.error('Error en la operación:', err);
        this.mostrarMensaje(
          `Error al ${this.editMode ? 'actualizar' : 'crear'} el inventario: ${err.error?.message || err.message}`,
          'error'
        );
      }
    });
  }

  editarInventario(inventario: any): void {
    this.nuevoInventario = { 
      ...inventario,
      fechaCaducidadLote: inventario.fechaCaducidadLote || ''
    };
    this.editMode = true;
    this.modalAbierto = true;
  }

  confirmarEliminacion(inventario: any): void {
    this.inventarioSeleccionado = inventario;
    this.modalConfirmacion = true;
  }

  eliminarInventario(id: string): void {
    if ((this.inventarioSeleccionado?.stockExhibe > 0 || 
         this.inventarioSeleccionado?.stockAlmacen > 0) && 
        !this.confirmOverride) {
      this.showShake = true;
      setTimeout(() => this.showShake = false, 600);
      return;
    }

    this.inventarioService.eliminarInventario(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cargarInventario();
          this.cerrarModalConfirmacion();
          this.mostrarMensaje('Inventario eliminado con éxito', 'success');
        } else {
          this.mostrarMensaje(response.message || 'Error al eliminar', 'error');
        }
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.mostrarMensaje(`Error al eliminar el inventario: ${err.error?.message || err.message}`, 'error');
      }
    });
  }

  abrirModal(): void {
    this.modalAbierto = true;
    this.editMode = false;
    this.formSubmitted = false;
    this.resetFormulario();
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.resetFormulario();
  }

  cerrarModalConfirmacion(): void {
    this.modalConfirmacion = false;
    this.inventarioSeleccionado = null;
    this.confirmOverride = false;
    this.showShake = false;
  }

  resetFormulario(): void {
    this.nuevoInventario = {
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
    this.editMode = false;
    this.formSubmitted = false;
    if (this.inventarioForm) {
      this.inventarioForm.resetForm();
    }
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: [`snackbar-${tipo}`],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
  
  regresar(): void {
    this.location.back();
  }
}