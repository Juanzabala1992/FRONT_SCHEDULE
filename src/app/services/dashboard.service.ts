import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }


  scheduleRegister(data:any) {
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.post(`${environment.apiUrl}/save`,
      {
        idUser:data.idUser,  
        idSch:data.idSch,    
        nombre:data.nombre,
        numero_de_documento:data.numero_de_documento,
        actividades:data.actividades,
        fecha_inicio:data.fecha_inicio,
        fecha_fin:data.fecha_fin,        
        cliente:data.cliente,
        total_horas:data.total_horas,
        responsable_cliente:data.responsable_cliente,
        observaciones:data.observaciones
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(map(res => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return res;
      }));
  };

  getUser(id:string) {
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.get(`${environment.apiUrl}/schedule/user/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .pipe(map((data: any) => {
        
        return data;
      }));
  }

  getAll() {
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.get(`${environment.apiUrl}/schedules/all`, { headers: { Authorization: `Bearer ${token}` } })
      .pipe(map((data: any) => {        
        return data;
      }));
  }
}
