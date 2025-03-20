import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    console.log("📤 Datos enviados:", this.email, this.password);

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log("✅ Respuesta del servidor:", response);
        
        // Obtener el rol del usuario
        const userRole = response.user.role;

        // Redirigir según el rol
        if (userRole === 'almacenista') {
          this.router.navigate(['/almacen']);
        } else if (userRole === 'empleado') {
          this.router.navigate(['/empleado']);
        } else {
          this.router.navigate(['/home']); // Ruta por defecto si el rol no coincide
        }
      },
      (error) => {
        console.log("❌ Error en login:", error);
        this.errorMessage = error.error.message;
      }
    );
  }
}
