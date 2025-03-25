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
  role: string = 'empleado';
  modalUsuariosAbierto: boolean = false;
  modalEditarAbierto: boolean = false;
  usuarios: any[] = [];
  usuarioEditado: any = {
    _id: '',
    email: '',
    role: 'empleado',
    newPassword: ''
  };
  loading: boolean = false;
  passwordStrength: string = '';

  constructor(
    private authService: AuthService,
    private location: Location,
    private toastr: ToastrService
  ) {}

  onRegister() {
    this.loading = true;
    this.authService.register(this.email, this.password, this.role).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastr.success(response.message, 'Éxito');
          this.resetForm();
          this.cargarUsuarios();
        } else {
          this.toastr.error(response.message, 'Error');
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Error al registrar usuario', 'Error');
        this.loading = false;
      }
    });
  }

  checkPasswordStrength() {
    if (!this.password) {
      this.passwordStrength = '';
      return;
    }
    
    if (this.password.length < 6) {
      this.passwordStrength = 'weak';
    } else if (this.password.length < 10) {
      this.passwordStrength = 'medium';
    } else {
      const hasUpperCase = /[A-Z]/.test(this.password);
      const hasLowerCase = /[a-z]/.test(this.password);
      const hasNumbers = /\d/.test(this.password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
      
      if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
        this.passwordStrength = 'strong';
      } else if ((hasUpperCase && hasLowerCase) || (hasNumbers && hasSpecialChars)) {
        this.passwordStrength = 'medium';
      } else {
        this.passwordStrength = 'weak';
      }
    }
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.role = 'empleado';
    this.passwordStrength = '';
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

// register.component.ts
cargarUsuarios(): void {
  this.loading = true;
  this.authService.getUsers().subscribe({
    next: (response: any) => {
      this.usuarios = response; // Ajusta según la estructura de tu respuesta
      this.loading = false;
    },
    error: (error) => {
      this.toastr.error('Error al cargar usuarios', 'Error');
      console.error('Error:', error);
      this.loading = false;
    }
  });
}

  abrirModalEditar(user: any): void {
    this.usuarioEditado = { 
      _id: user._id,
      email: user.email,
      role: user.role,
      newPassword: ''
    };
    this.modalEditarAbierto = true;
    this.modalUsuariosAbierto = false;
  }

  cerrarModalEditar(): void {
    this.modalEditarAbierto = false;
  }

  onEditarUsuario(): void {
    this.loading = true;
    
    const updateData: any = {
        email: this.usuarioEditado.email,
        role: this.usuarioEditado.role
    };
    
    // Solo actualizar la contraseña si se proporcionó una nueva
    if (this.usuarioEditado.newPassword && this.usuarioEditado.newPassword.length >= 6) {
        updateData.password = this.usuarioEditado.newPassword;
    }

    this.authService.updateUser(this.usuarioEditado._id, updateData).subscribe({
        next: (response: any) => {
            if (response.success) {
                this.toastr.success(response.message, 'Éxito');
                this.cargarUsuarios();
                this.cerrarModalEditar();
            } else {
                this.toastr.error(response.message, 'Error');
            }
            this.loading = false;
        },
        error: (error) => {
            this.toastr.error(error.error?.message || 'Error al actualizar usuario', 'Error');
            this.loading = false;
        }
    });
}
  confirmarEliminacion(userId: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
        this.loading = true;
        this.authService.deleteUser(userId).subscribe({
            next: (response: any) => {
                if (response?.success) {
                    this.toastr.success(response.message, 'Éxito');
                    // Filtra el usuario eliminado de la lista local sin recargar
                    this.usuarios = this.usuarios.filter(user => user._id !== userId);
                } else {
                    this.toastr.error(response?.message || 'Error desconocido al eliminar', 'Error');
                }
                this.loading = false;
            },
            error: (error) => {
                console.error('Error completo:', error);
                this.toastr.error(
                    error.error?.message || 
                    error.message || 
                    'Error al comunicarse con el servidor', 
                    'Error'
                );
                this.loading = false;
            }
        });
    }
}
}