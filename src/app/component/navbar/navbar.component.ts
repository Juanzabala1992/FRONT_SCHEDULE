import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  error='';
  id$: any;
  id_user!:string;
  data_user!:any;
  imageData!:any;
  load:boolean=false;

  constructor(private registerService:RegisterService, 
    private sharedService:SharedService, private sanitizer: DomSanitizer,
    private router: Router
    ) {
    this.id$=sharedService.getId;
   }

  ngOnInit(): void {
    this.id$.subscribe((id:string)=>{
      this.id_user=id;
      if(this.id_user[0]){
        this.loadData();
      }
    }); 
  
  }
  loadData(){    
    this.registerService.getUser(this.id_user)
    .pipe(first())
    .subscribe({
        next: (data) => {            
            this.base64ToArrayBuffer(data, data.foto);            
        },
        error: error => {
            this.error = error;            
        }
    }); 
  }
  password(){
    this.router.navigate(['/change-password']);
  }
  base64ToArrayBuffer(base64Str:any, foto:any) { 
    this.load=true;   
    this.data_user=base64Str;
    const base64String = foto.substring(foto.indexOf(',') + 1);
    const binaryString = window.atob(base64String);
    const bytes = new Uint8Array(
      Array.from(binaryString, (char) => char.charCodeAt(0))
    );
    const blob = new Blob([bytes], { type: 'image/png' });

    // Crear una URL válida para el objeto Blob
    this.imageData = URL.createObjectURL(blob);

  }
  notifications(){
    this.router.navigate(['/notifications']);
  }

}
