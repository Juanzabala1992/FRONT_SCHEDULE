import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { InvalidregisterComponent } from 'src/app/modals/invalidregister/invalidregister.component';
import { ChangePasswordModel } from 'src/app/model/changePassword';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  error:string='';
  user$:any;
  user:any;
  changeType:boolean=true;
  iconEye:boolean=true;
  changeTypeCp:boolean=true;
  iconEyeCp:boolean=true;

  changePassword = new FormGroup({
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).(?=.*[$@$!%*?&]).{8,16}$'),
    Validators.minLength(7)] }),
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).(?=.*[$@$!%*?&]).{8,16}$'),
    Validators.minLength(7)] })
        
  });
  
  constructor(private authenticationService:AuthenticationService,
    private _snackBar: MatSnackBar, private sharedService:SharedService,
    private ngbModal: NgbModal
    ){
      this.user$=sharedService.getUser;
  }

  ngOnInit(): void {

    this.user$.subscribe((data:any)=>{
      this.loadData(data);
    });
  }
  loadData(data:any){
    this.user=data;
  }
  save(){
    const value = this.changePassword.valid;
    if(value){
      const pass :ChangePasswordModel = {
        email:this.user.user,
        newPassword: this.changePassword.get('newPassword')?.value,
      }
      this.authenticationService.changePassword(pass)
      .pipe(first())
      .subscribe({
          next: (data:any) => {          
            this.openSnackBar(
              'Su registro se guardo exitosamente!',
              'OK'
            );            
          },
          error: (error:any) => {
              this.error = error.error.message;
              this.openSnackBar(
                this.error,
                'OK'
              ); 
              //this.loading = false;
          }
      });
    }else{
      let modal = this.ngbModal.open(InvalidregisterComponent,{ size: 'xl'});      
      modal.componentInstance.where = 'password';
    }    
  }
  viewP(){
    this.changeType=!this.changeType;
    this.iconEye=!this.iconEye;
  }
  viewCp(){
    this.changeTypeCp=!this.changeTypeCp;
    this.iconEyeCp=!this.iconEyeCp;
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['ok-snackbar']
    });
  }
}
