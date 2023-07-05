import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../model/LoginModel';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { 

  }
  
  login(data:LoginModel) { 
    return this.http.post<any>(`${environment.apiUrl}/authenticate`, { email:data.email, password:data.password })    
        .pipe(map((user: any) => {
            localStorage.setItem('currentUser', JSON.stringify(user.token));
            window.sessionStorage.setItem("currentUser",JSON.stringify(user));
            let start_time = {start_time: new Date()};
            localStorage.setItem('sessionTime', JSON.stringify(start_time));
            console.log("User-->", user);           
            return user;
        }));
  }
}