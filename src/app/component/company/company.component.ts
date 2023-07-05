import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { CompanyModel } from '../../model/companyModel';
import { CompanyService } from 'src/app/services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit{

  error!:string;
  constructor(private companyService:CompanyService, private _snackBar: MatSnackBar){}

  companyForm = new FormGroup({
    client: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    client_final: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contacto_cliente: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    fecha_contrato:  new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contacto_cliente_final: new FormControl('', { nonNullable: true, validators: [Validators.required] })   
  });
  ngOnInit(): void {
    
  }

  save(){
    const codigoAleatorio = this.generarCodigoAleatorio();
    const company :CompanyModel = {
      idClient:codigoAleatorio,
      client: this.companyForm.get('client')?.value,
      client_final:this.companyForm.get('client_final')?.value,
      contacto_cliente:this.companyForm.get('contacto_cliente')?.value,
      fecha_contrato:this.companyForm.get('fecha_contrato')?.value,
      contacto_cliente_final:this.companyForm.get('contacto_cliente_final')?.value
    }
    this.companyService.companySave(company)
    .pipe(first())
    .subscribe({
        next: (data:any) => {
          this.openSnackBar(
            'Su registro se guardo exitosamente!',
            'OK'
          );            
        },
        error: (error:any) => {
            this.error = error;
            //this.loading = false;
        }
    });
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
}
