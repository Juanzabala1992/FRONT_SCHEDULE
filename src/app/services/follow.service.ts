import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FollowModel } from '../component/model/followModel';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http: HttpClient) { }

  followSave(data:FollowModel) {
    console.log(data);
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.post(`${environment.apiUrl}/follow/save`,
      {
        final_date:data.final_date,
        follow: data.follow,
        followId:data.followId,
        init_date:data.final_date
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(map(res => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return res;
      }));
  };

  getFollow(id:string) {
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.get(`${environment.apiUrl}/follow/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .pipe(map((data: any) => {
        
        return data;
      }));
  }

  getFollowClientAll() {
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.get(`${environment.apiUrl}/follow/client/all`, { headers: { Authorization: `Bearer ${token}` } })
      .pipe(map((data: any) => {        
        return data;
      }));
  }

}
