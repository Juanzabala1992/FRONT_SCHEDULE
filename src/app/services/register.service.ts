import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  getUser(id:string) {    
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.get(`${environment.apiUrl}/profile/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .pipe(map((data: any) => {            
        return data;
      }));
  }

  userRegister(activityData:any) {
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.post(`${environment.apiUrl}/save`,
      {
        idUser:"0001",
        email:"email",
        nombre:"nombre",
        numero_de_documento:"100000",
        tipo_de_documento:"C.C",
        cargo:"Developer",
        pais:"Colombia",
        direccion:"Calle falsa 123",
        telefono:"30000000",
        foto:"asdas"
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(map(res => {
        
        return res;
      }));
  };
}
