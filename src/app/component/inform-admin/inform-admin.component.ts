import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inform-admin',
  templateUrl: './inform-admin.component.html',
  styleUrls: ['./inform-admin.component.css']
})
export class InformAdminComponent {

  constructor(private router:Router){

  }
  routes(route:string){
    this.router.navigate([`/${route}`]);
  }  
}
