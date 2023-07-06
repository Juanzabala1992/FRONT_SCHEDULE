import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs';
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
  changePassword = new FormGroup({
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })    
  });
  
  constructor(private authenticationService:AuthenticationService,
    private _snackBar: MatSnackBar, private sharedService:SharedService
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
 
    const pass :ChangePasswordModel = {
      email:this.user.user,
      newPassword: this.changePassword.get('newPassword')?.value,
    }
    this.authenticationService.changePassword(pass)
    .pipe(first())
    .subscribe({
        next: (data:any) => {
          console.log("data-->", data);
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
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['ok-snackbar']
    });
  }
}
