import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { CompanyModel } from '../../model/companyModel';
import { CompanyService } from 'src/app/services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvalidregisterComponent } from 'src/app/modals/invalidregister/invalidregister.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit{
  
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;

  error!:any;
  constructor(private companyService:CompanyService, private _snackBar: MatSnackBar, 
    private ngbModal: NgbModal, private router: Router
    ){}

  companyForm = new FormGroup({
    client: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    client_final: new FormControl('', { validators: [Validators.minLength(4)] }),
    contacto_cliente: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    fecha_contrato:  new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contacto_cliente_final: new FormControl('', { nonNullable: true, validators: [Validators.minLength(4)] }),
    observations:new FormControl('', { validators: [Validators.minLength(5)] }), 
    email: new FormControl('', { nonNullable: true, validators: [this.emailFormatValidator] }),
    email_final: new FormControl('', { validators: [this.emailFormatValidator] }),
    telefono:new FormControl('', { nonNullable: true, validators: [this.numericMinLengthValidator(6)] }),  
    telefono_final: new FormControl('', {validators: [this.numericMinLengthValidator(6)] }),
    final_client_toggle:new FormControl('')
  });
  ngOnInit(): void {

  }

  save(){   

    const controls = Object.keys(this.companyForm.controls)
    .filter(controlName => this.companyForm.get(controlName)?.errors !== null);
    const controlNamesWithErrors  = controls.map(controlName => controlName);  
    
      if(controlNamesWithErrors.length !=0){
        let modal = this.ngbModal.open(InvalidregisterComponent,{ size: 'xl'});
        modal.componentInstance.data = controls;
        modal.componentInstance.where = 'company';
      }else{
        const codigoAleatorio = this.generarCodigoAleatorio();
        const company :CompanyModel = {
          idClient:codigoAleatorio,
          client: this.companyForm.get('client')?.value,          
          email: this.companyForm.get('email')?.value,
          email_final: this.companyForm.get('email_final')?.value,
          telefono: this.companyForm.get('telefono')?.value,
          telefono_final: this.companyForm.get('telefono_final')?.value,
          client_final:this.companyForm.get('client_final')?.value,
          contacto_cliente:this.companyForm.get('contacto_cliente')?.value,
          fecha_contrato:this.companyForm.get('fecha_contrato')?.value,
          contacto_cliente_final:this.companyForm.get('contacto_cliente_final')?.value,
          observations:this.companyForm.get('observations')?.value
        }
        
        this.companyService.companySave(company)
        .pipe(first())
        .subscribe({
            next: (data:any) => {
              this.openSnackBar(
                'Su registro se guardo exitosamente!',
                'OK'
              );   
              this.router.navigate(['/console']);         
            },
            error: (error:any) => {
                this.error = error.error;                
                this.openSnackBar(
                  this.error.message,
                  'OK'
                ); 
            }
        });
      } 
  }

  generarCodigoAleatorio(): string {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
  
    let codigo = 'CLI-';
    for (let i = 0; i < 5; i++) {
      codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    codigo += letras.charAt(Math.floor(Math.random() * letras.length));  
    return codigo;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['ok-snackbar']
    });
  }

  emailFormatValidator(control: AbstractControl): { [key: string]: any } | null {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { 'emailFormat': true };
  }
  numericMinLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const numericValue = value ? value.toString().replace(/\D/g, '') : '';
      return numericValue.length >= minLength ? null : { 'numericMinLength': true };
    };
  } 
}
