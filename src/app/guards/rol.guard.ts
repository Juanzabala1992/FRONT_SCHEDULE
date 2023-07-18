import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {
  constructor(private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const userString =localStorage.getItem('user');      
      if(userString){
        const user = JSON.parse(userString);
        console.log(user.rol);
        if(user.rol=='ADMIN'){
          console.log("truee ->");
          return true;
        }
        else{
          this.router.navigate(['/login']);
          return false;
        }                   
      }else{
        this.router.navigate(['/login']);
        return false; 
      }         
  }
  
}
