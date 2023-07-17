import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompanyModel } from '../model/companyModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  companySave(data:CompanyModel){
    const token = localStorage.getItem('currentUser')?.replace(/"/g, '');
    return this.http.post(`${environment.apiUrl}/company/save`,
      {
        idClient:data.idClient,
        client:data.client,
        client_final:data.client_final,
        contacto_cliente:data.contacto_cliente,
        contacto_cliente_final:data.contacto_cliente_final,
        fecha_contrato:data.fecha_contrato,
        telefono:data.telefono,
        telefono_final:data.telefono_final,
        email:data.email,
        email_final:data.email_final,
        observations:data.observations
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(map(res => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return res;
      }));
  }
}
