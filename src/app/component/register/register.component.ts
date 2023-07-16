import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileModel } from 'src/app/model/profileModel';
import { FileAcceptValidator } from "../../utils/file-accept-validator";
import { Observable, Subscriber, first } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  base64:string='';
  fileModel: any;
  imageURL!:SafeUrl;
  photo!:string;
  private displayType: string = "d-none";
  private displayFirstType: string = "d-none";
  error:string='';
  
  constructor(private sanitizer: DomSanitizer, 
    private registerService:RegisterService,
    private _snackBar: MatSnackBar) { }

  registerForm = new FormGroup({
    cliente: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cliente_final: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    apellido: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    numero_de_documento:new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tipo_de_documento:new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cargo:new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pais:new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    telefono:new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    foto:new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  //matcher = new MyErrorStateMatcher();
  

  ngOnInit(): void {
  }
  upload($event:any){
    const target = $event.target as HTMLInputElement;
    const imageUrl:File =(target.files as FileList)[0];
    if(imageUrl){
      this.convertImageToBase64(imageUrl)
    } 
  }
  convertImageToBase64(file:File){
    const observable = new Observable((subscriber: Subscriber<any>)=>{
      this.readFile(file, subscriber);
    })
    observable.subscribe((d)=>{
      this.base64=d;
    });
  }
  readFile(file:File, subscriber:Subscriber<any>){
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = ()=> {
      subscriber.next(fileReader.result);
      subscriber.complete()
    }
    fileReader.onerror = () =>{
      subscriber.error();
      subscriber.complete();
    }
  }
  save(){
    const randomCode = this.generateRandomCode();  
    const register:ProfileModel={
      idUser:randomCode,
      email: this.registerForm.get('email')?.value,
      nombre: this.registerForm.get('nombre')?.value,
      apellido: this.registerForm.get('apellido')?.value,
      numero_de_documento: this.registerForm.get('numero_de_documento')?.value,
      tipo_de_documento: this.registerForm.get('tipo_de_documento')?.value,
      cargo: this.registerForm.get('cargo')?.value,
      pais: this.registerForm.get('pais')?.value,
      cliente: this.registerForm.get('cliente')?.value,
      cliente_final: this.registerForm.get('cliente_final')?.value, 
      direccion: this.registerForm.get('direccion')?.value,
      telefono: this.registerForm.get('telefono')?.value,
      foto: this.base64,
    } 

    this.registerService.userRegister(register)
    .pipe(first())
      .subscribe({
        next: (data) => {
          this.openSnackBar(
            'Su registro se guardo exitosamente!',
            'OK'
          );
        },
        error: error => {
          this.error = error;
        }
      });
  }  
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['ok-snackbar']
    });
  }

  generateRandomCode(): string {
    const prefix = 'idusr-';
    const randomDigits = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Genera una letra minúscula aleatoria
  
    return prefix + randomDigits + randomLetter;
  }  
}
