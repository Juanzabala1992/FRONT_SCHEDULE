import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private id:BehaviorSubject<any>;

  constructor() { 
    this.id = new BehaviorSubject({});
  }

  set setId(data:string){
    this.id.next(data);
  }
  get getId(){
    return this.id.asObservable();    
  }
}
