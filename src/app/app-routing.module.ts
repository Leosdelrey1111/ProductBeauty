import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404pageComponent } from './shared/pages/error404page/error404page.component';
import { AlmacenComponent } from './almacen/almacen.component';
import { LoginComponent } from './login/login.component';
import { ClienteComponent } from './cliente/cliente.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { InventariosComponent } from './inventarios/inventarios.component';
import { HistorialComponent } from './historial/historial.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: ClienteComponent },  // Cambia a 'cliente' para evitar conflicto
  { path: 'almacen', component: AlmacenComponent }, // Ruta correcta para el almacén
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'historial', component: HistorialComponent},
  { path: 'empleado', component: EmpleadoComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'inventarios', component: InventariosComponent },
  { path: '404', component: Error404pageComponent },
  { path: '**', redirectTo: '404' }  // Cualquier ruta no encontrada se redirige a '404'
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
