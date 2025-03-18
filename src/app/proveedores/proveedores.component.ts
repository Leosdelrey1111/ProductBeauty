import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/Proveedor.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  modalAbierto = false;
  modalConfirmacion = false;
  proveedorSeleccionado: any = null;
  editMode = false; // Para saber si estamos en modo edición o creación

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.obtenerProveedores(); // Cargar los proveedores al iniciar el componente
  }

  obtenerProveedores(): void {
    this.proveedorService.getProveedores().subscribe(
      (data) => {
        this.proveedores = data;
      },
      (error) => {
        console.error('Error al obtener proveedores', error);
      }
    );
  }

  abrirModal(): void {
    // Limpiamos el formulario para agregar un nuevo proveedor
    this.proveedorSeleccionado = {
      folioProveedor: '',
      nombre: '',
      telefono: '',
      correo: '',
      direccion: {
        calle: '',
        numeroExterior: '',
        colonia: '',
        codigoPostal: '',
        ciudad: {
          nombreCiudad: ''
        }
      }
    };
    this.modalAbierto = true;
    this.editMode = false; // Modo creación
  }

  editarProveedor(proveedor: any): void {
    this.proveedorSeleccionado = { ...proveedor };  // Copiar los datos del proveedor para editar
    this.modalAbierto = true;
    this.editMode = true; // Modo edición
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  guardarProveedor(): void {
    // Validación de campos obligatorios antes de enviar
    if (!this.proveedorSeleccionado.folioProveedor || !this.proveedorSeleccionado.nombre || !this.proveedorSeleccionado.direccion || !this.proveedorSeleccionado.direccion.calle || !this.proveedorSeleccionado.direccion.numeroExterior || !this.proveedorSeleccionado.direccion.colonia || !this.proveedorSeleccionado.direccion.codigoPostal || !this.proveedorSeleccionado.direccion.ciudad.nombreCiudad) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    if (this.editMode) {
      this.proveedorService.actualizarProveedor(this.proveedorSeleccionado._id, this.proveedorSeleccionado).subscribe(
        (data) => {
          this.obtenerProveedores();
          this.cerrarModal();
          alert('Proveedor actualizado');
        },
        (error) => {
          console.error('Error al actualizar proveedor', error);
        }
      );
    } else {
      this.proveedorService.registrarProveedor(this.proveedorSeleccionado).subscribe(
        (data) => {
          this.obtenerProveedores();
          this.cerrarModal();
          alert('Proveedor agregado');
        },
        (error) => {
          console.error('Error al agregar proveedor', error);
        }
      );
    }
  }

  eliminarProveedor(id: string): void {
    this.proveedorService.eliminarProveedor(id).subscribe(
      (data) => {
        this.obtenerProveedores();
        alert('Proveedor eliminado');
      },
      (error) => {
        console.error('Error al eliminar proveedor', error);
      }
    );
  }

  confirmarEliminacion(proveedor: any): void {
    this.proveedorSeleccionado = proveedor;
    this.modalConfirmacion = true;
  }

  cerrarModalConfirmacion(): void {
    this.modalConfirmacion = false;
    this.proveedorSeleccionado = null;
  }
}
