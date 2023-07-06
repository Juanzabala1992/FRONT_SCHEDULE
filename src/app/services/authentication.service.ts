import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../model/LoginModel';
import { ChangePasswordModel } from '../model/changePassword';


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
            localStorage.setItem('user', JSON.stringify({
              user:user.email,
              rol:user.role
            }));                      
            return user;
        }));
  }
  changePassword(data:ChangePasswordModel) { 
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.post(`${environment.apiUrl}/password`,
      {
        email:data.email,
        newPassword:data.newPassword
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(map(res => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return res;
      }));
  };
}