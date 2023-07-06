import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoginModel } from '../../model/LoginModel';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error = '';
  loading = false;

  constructor(private router:Router, private authenticationService:AuthenticationService,
    private _snackBar: MatSnackBar, private sharedService: SharedService
    ) { }

  
  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })    
  });

  ngOnInit(): void {
    
  }
  login(){
    const login :LoginModel = {
      email: this.loginForm.get('username')?.value,
      password:this.loginForm.get('password')?.value
    }
    this.authenticationService.login(login)
    .pipe(first())
    .subscribe({
        next: (data) => {
          this.sharedService.setId=data.idUser;
          const userString =localStorage.getItem('user');
          if(userString){
            const user = JSON.parse(userString);
            this.sharedService.setUser=user;           
          }          
          if(data.role=="USER"){
            this.router.navigate(['/schedule']);  
          }else
          if(data.role=="ADMIN"){
            this.router.navigate(['/console']);
          }                
        },
        error: error => {
            this.error = error;
            this.loading = false;
        }
    });
    //this.router.navigate(['/schedule']);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['ok-snackbar'],
    });
    
  }
}
