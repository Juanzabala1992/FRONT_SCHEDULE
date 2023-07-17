import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileModel } from 'src/app/model/profileModel';
import { FileAcceptValidator } from "../../utils/file-accept-validator";
import { Observable, Subscriber, first } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FollowService } from 'src/app/services/follow.service';
import { InvalidregisterComponent } from 'src/app/modals/invalidregister/invalidregister.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

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
  clients:[]=[];
  total_data:any;
  final_client:Array<any>=[];
  final_client_final:Array<any>=[];
  show_client=false;
  countries:Array<String>=["Colombia","Ecuador","España"];
  documentos:Array<String>=["C.C","P.A","C.D", "C.E", "DNI", "P.E"];
  private displayType: string = "d-none";
  private displayFirstType: string = "d-none";
  error:any='';
  
  constructor(private sanitizer: DomSanitizer, 
    private registerService:RegisterService,
    private _snackBar: MatSnackBar, private followService:FollowService,
    private ngbModal: NgbModal, private router: Router
    ) { }

  registerForm = new FormGroup({
    cliente: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cliente_final: new FormControl(''),
    direccion: new FormControl('',{ nonNullable: true, validators: [Validators.minLength(6)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, this.emailFormatValidator] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    apellido: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    numero_de_documento:new FormControl('', { nonNullable: true, validators: [Validators.required, this.numericMinLengthValidator(6)] }),
    tipo_de_documento:new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cargo:new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    pais:new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    telefono:new FormControl('', { nonNullable: true, validators: [Validators.required, this.numericMinLengthValidator(6)] }),
    foto:new FormControl(''),
  });

  //matcher = new MyErrorStateMatcher();
  

  ngOnInit(): void {
    this.followService.getClientAll()
    .pipe(first())
    .subscribe({
        next: (data) => {             
            this.takeClients(data);
        },
        error: error => {
            this.error = error;            
        }
    });

    this.registerForm.get('cliente')?.valueChanges.subscribe(value=>{
      this.registerForm.get('cliente_final')?.reset();
      this.takeFinalClients(value);
    });
  }
  takeClients(data:any){
    this.clients=data.map((client:any)=>{
      return client.client;
    });
    this.total_data=data;    
  }
  takeFinalClients(value:string){
    console.log(" this.total_data ", this.total_data)
    const final_data = this.total_data.map((data:any) => {
      const clientFinal = data.client_final;
       const contactClient = data.contacto_cliente;      
      
      if(data.client==value){
        if(clientFinal){
          return {clientFinal:clientFinal}; 
        }
        else{
          return contactClient;
        }          
      }      
    }).filter((client: any) => client !== undefined);

     if(final_data[0].clientFinal){
      const value = final_data[0].clientFinal;
      const final = this.total_data.map((data:any) => {
        const contacto_cliente_final = data.contacto_cliente_final;               
        
        if(data.client_final==value){
          return contacto_cliente_final;       
        }      
      }).filter((client: any) => client !== undefined);
      this.final_client_final=final;
      this.final_client=[final_data[0].clientFinal];
      this.show_client=true;
    }else{
      this.final_client=final_data;
      this.show_client=false;
    }    
    console.log("this.final_client_final ", this.final_client_final, 
    "this.final_client ", this.final_client);
  }
  upload($event:any){
    const target = $event.target as HTMLInputElement;
    const imageUrl:File =(target.files as FileList)[0];
    if(imageUrl){
      this.convertImageToBase64(imageUrl)
    } 
  }
  emailFormatValidator(control: AbstractControl): { [key: string]: any } | null {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { 'emailFormat': true };
  }
  convertImageToBase64(file:File){
    const observable = new Observable((subscriber: Subscriber<any>)=>{
      this.readFile(file, subscriber);
    })
    observable.subscribe((d)=>{
      this.base64=d;
    });
  }
  numericMinLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const numericValue = value ? value.toString().replace(/\D/g, '') : '';
      return numericValue.length >= minLength ? null : { 'numericMinLength': true };
    };
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

    const controls = Object.keys(this.registerForm.controls)
  .filter(controlName => this.registerForm.get(controlName)?.errors !== null);
  const controlNamesWithErrors  = controls.map(controlName => controlName);

  if(controlNamesWithErrors.length !=0){
      let modal = this.ngbModal.open(InvalidregisterComponent,{ size: 'sm'});
      modal.componentInstance.data = controls;
      modal.componentInstance.where = 'register';
    }else{
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

          this.router.navigate(['/console']);

        },
        error: error => {
          this.error = error;
          this.openSnackBar(
            this.error.error,
            'OK'
          );
        }
      });
    }    
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
