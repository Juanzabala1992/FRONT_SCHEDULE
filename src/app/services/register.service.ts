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

  getUserByEmail(id:string) {    
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.get(`${environment.apiUrl}/profile/email/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .pipe(map((data: any) => {            
        return data;
      }));
  }


  getAllUsers() {    
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.get(`${environment.apiUrl}/profile/all`, { headers: { Authorization: `Bearer ${token}` } })
      .pipe(map((data: any) => {            
        return data;
      }));
  }

  userRegister(data:any) {
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.post(`${environment.apiUrl}/profile/save`,
      {
        idUser:data.idUser,
        email:data.email,
        apellido:data.apellido,
        nombre:data.nombre,
        numero_de_documento:data.numero_de_documento,
        tipo_de_documento:data.tipo_de_documento,
        cargo:data.cargo,
        pais:data.pais,
        direccion:data.direccion,
        telefono:data.telefono,
        foto:data.foto,        
        cliente: data.cliente,
        cliente_final: data.cliente_final,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(map(res => {
        
        return res;
      }));
  };
}
