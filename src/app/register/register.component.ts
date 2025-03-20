import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';  // Importar Location para navegación

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  role: string = 'empleado'; // Valor por defecto
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private location: Location) {}

  onRegister() {
    console.log("📤 Enviando datos de registro:", this.email, this.password, this.role);

    this.authService.register(this.email, this.password, this.role).subscribe(
      (response) => {
        console.log("✅ Registro exitoso:", response);
        this.successMessage = 'Usuario registrado con éxito';
        this.errorMessage = '';
      },
      (error) => {
        console.log("❌ Error en registro:", error);
        this.errorMessage = error.error.message;
        this.successMessage = '';
      }
    );
  }
    // Función para regresar a la página anterior
    regresar(): void {
      this.location.back();  // Regresar a la página anterior en el historial
    }
}
