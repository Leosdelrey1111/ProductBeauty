import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  role: string = 'empleado'; // Valor por defecto
  modalUsuariosAbierto: boolean = false;
  modalEditarAbierto: boolean = false;
  usuarios: any[] = [];
  usuarioEditado: any = {};

  constructor(
    private authService: AuthService,
    private location: Location,
    private toastr: ToastrService
  ) {}

  onRegister() {
    this.authService.register(this.email, this.password, this.role).subscribe(
      (response) => {
        this.toastr.success('Usuario registrado con éxito', 'Éxito');
        this.cargarUsuarios(); // Recargar la lista de usuarios
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

  regresar(): void {
    this.location.back();
  }

  abrirModalUsuarios(): void {
    this.modalUsuariosAbierto = true;
    this.cargarUsuarios();
  }

  cerrarModalUsuarios(): void {
    this.modalUsuariosAbierto = false;
  }

  cargarUsuarios(): void {
    this.authService.getUsers().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        this.toastr.error('Error al cargar usuarios', 'Error');
      }
    );
  }

  abrirModalEditar(user: any): void {
    this.usuarioEditado = { ...user };
    this.modalEditarAbierto = true;
  }

  cerrarModalEditar(): void {
    this.modalEditarAbierto = false;
  }

  onEditarUsuario(): void {
    this.authService.updateUser(this.usuarioEditado._id, this.usuarioEditado).subscribe(
      () => {
        this.toastr.success('Usuario actualizado con éxito', 'Éxito');
        this.cargarUsuarios();
        this.cerrarModalEditar();
      },
      (error) => {
        this.toastr.error('Error al actualizar usuario', 'Error');
      }
    );
  }

  confirmarEliminacion(userId: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.authService.deleteUser(userId).subscribe(
        () => {
          this.toastr.success('Usuario eliminado con éxito', 'Éxito');
          this.cargarUsuarios();
        },
        (error) => {
          this.toastr.error('Error al eliminar usuario', 'Error');
        }
      );
    }
  }
}