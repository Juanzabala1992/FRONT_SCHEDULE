import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }

  getUser(id:string) {    
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.get(`${environment.apiUrl}/notifications/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .pipe(map((data: any) => {            
        return data;
      }));
  }
  putNotification(data:any){
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.put(`${environment.apiUrl}/notifications/update`,
      {        
        content:data.content,
        destination:data.destination,
        email:data.email,
        idUser:data.idUser,
        messageId:data.messageId,
        origin:data.origin,
        state: true       
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(map(res => {
        
        return res;
      }));
  }
}
