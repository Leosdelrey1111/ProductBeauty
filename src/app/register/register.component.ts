import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

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
}
