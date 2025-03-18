import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../services/Productos.service';
import { ProveedorService } from '../../services/Proveedor.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {

  producto: any = {};
  proveedores: any[] = [];
  editMode: boolean = true;

  constructor(
    private productosService: ProductosService,
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerProducto(id);
    }
    this.obtenerProveedores();
  }

  obtenerProducto(id: string): void {
    this.productosService.getProductoById(id).subscribe(
      (data) => {
        this.producto = data.producto;
      },
      (error) => {
        console.error('Error al obtener producto', error);
      }
    );
  }

  obtenerProveedores(): void {
    this.proveedorService.getProveedores().subscribe(
      (data) => {
        this.proveedores = data || [];
      },
      (error) => {
        console.error('Error al obtener proveedores', error);
      }
    );
  }

  actualizarProducto(): void {
    this.productosService.actualizarProducto(this.producto._id, this.producto).subscribe(
      (data) => {
        console.log('Producto actualizado', data);
        this.router.navigate(['/almacen']);
      },
      (error) => {
        console.error('Error al actualizar producto', error);
      }
    );
  }
}
