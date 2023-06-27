import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent {
  constructor(private router:Router){

  }
  routes(route:string){
    this.router.navigate([`/${route}`]);
  }
}
