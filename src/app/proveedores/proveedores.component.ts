import { Component, OnInit, ViewChild } from '@angular/core';
import { ProveedorService } from '../../services/Proveedor.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  @ViewChild('proveedorForm') proveedorForm!: NgForm;

  proveedores: any[] = [];
  filteredProveedores: any[] = [];
  proveedorSeleccionado: any = {
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
  editMode = false;
  modalAbierto = false;
  modalConfirmacion = false;
  searchTerm = '';
  notificationMessage = '';

  constructor(
    private proveedorService: ProveedorService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  obtenerProveedores(): void {
    this.proveedorService.getProveedores().subscribe(
      (data: any) => {
        this.proveedores = data.map((proveedor: any) => ({
          ...proveedor,
          direccion: {
            calle: proveedor.direccion?.calle || '',
            numeroExterior: proveedor.direccion?.numeroExterior || proveedor.direccion?.numeroInterior || '',
            colonia: proveedor.direccion?.colonia || '',
            codigoPostal: proveedor.direccion?.codigoPostal || '',
            ciudad: {
              nombreCiudad: proveedor.direccion?.ciudad?.nombreCiudad || ''
            }
          }
        }));
        this.filteredProveedores = [...this.proveedores];
      },
      error => {
        this.mostrarNotificacion('Error al obtener proveedores');
      }
    );
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredProveedores = [...this.proveedores];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredProveedores = this.proveedores.filter(p => 
      p.nombre.toLowerCase().includes(term) || 
      p.folioProveedor.toLowerCase().includes(term) ||
      (p.telefono && p.telefono.toLowerCase().includes(term)) ||
      (p.correo && p.correo.toLowerCase().includes(term)) ||
      (p.direccion.ciudad.nombreCiudad && p.direccion.ciudad.nombreCiudad.toLowerCase().includes(term))
    );
  }

  regresar(): void {
    this.location.back();
  }

  abrirModal(): void {
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
    this.editMode = false;
  }

  editarProveedor(proveedor: any): void {
    this.proveedorSeleccionado = {
      _id: proveedor._id,
      folioProveedor: proveedor.folioProveedor,
      nombre: proveedor.nombre,
      telefono: proveedor.telefono || '',
      correo: proveedor.correo || '',
      direccion: {
        calle: proveedor.direccion?.calle || '',
        numeroExterior: proveedor.direccion?.numeroExterior || proveedor.direccion?.numeroInterior || '',
        colonia: proveedor.direccion?.colonia || '',
        codigoPostal: proveedor.direccion?.codigoPostal || '',
        ciudad: {
          nombreCiudad: proveedor.direccion?.ciudad?.nombreCiudad || ''
        }
      }
    };
    this.modalAbierto = true;
    this.editMode = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  cerrarModalConfirmacion(): void {
    this.modalConfirmacion = false;
  }

  guardarProveedor(): void {
    if (this.proveedorForm.invalid) {
      this.mostrarNotificacion('Por favor complete todos los campos requeridos');
      return;
    }

    if (this.editMode) {
      this.proveedorService.actualizarProveedor(
        this.proveedorSeleccionado._id, 
        this.proveedorSeleccionado
      ).subscribe(
        () => {
          this.obtenerProveedores();
          this.cerrarModal();
          this.mostrarNotificacion('Proveedor actualizado con éxito');
        },
        error => {
          this.mostrarNotificacion('Error al actualizar proveedor');
        }
      );
    } else {
      this.proveedorService.registrarProveedor(
        this.proveedorSeleccionado
      ).subscribe(
        () => {
          this.obtenerProveedores();
          this.cerrarModal();
          this.mostrarNotificacion('Proveedor creado con éxito');
        },
        error => {
          this.mostrarNotificacion('Error al crear proveedor');
        }
      );
    }
  }

  confirmarEliminacion(proveedor: any): void {
    this.proveedorSeleccionado = proveedor;
    this.modalConfirmacion = true;
  }

  eliminarProveedor(id: string): void {
    this.proveedorService.eliminarProveedor(id).subscribe(
      () => {
        this.obtenerProveedores();
        this.cerrarModalConfirmacion();
        this.mostrarNotificacion('Proveedor eliminado con éxito');
      },
      error => {
        this.mostrarNotificacion('Error al eliminar proveedor');
      }
    );
  }

  mostrarNotificacion(mensaje: string): void {
    this.notificationMessage = mensaje;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000);
  }
}