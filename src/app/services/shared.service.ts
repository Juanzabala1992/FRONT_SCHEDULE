import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private id:BehaviorSubject<any>;
  private user:BehaviorSubject<any>;

  constructor() {
    this.id = new BehaviorSubject({}); 
    this.user = new BehaviorSubject({});
  }

  set setId(data:string){
    this.id.next(data);
  }
  get getId(){
    return this.id.asObservable();    
  }

  set setUser(data:any){
    this.user.next(data);    
  }
  get getUser(){    
    return this.user.asObservable();    
  }

  weekendsDatesFilter = (d: Date | null): boolean => {
    if(!d){
      return false
    }
    let day_filter = 0; 
    const days_picker=new Date(d);
     
    const holydays = [
      new Date('Wed Jul 20 2022 00:00:00 GMT-0500 (hora estándar de Colombia)'),      
      new Date('Mon Aug 15 2022 00:00:00 GMT-0500 (hora estándar de Colombia)'),
      new Date('Mon Oct 17 2022 00:00:00 GMT-0500 (hora estándar de Colombia)'),
      new Date('Mon Nov 07 2022 00:00:00 GMT-0500 (hora estándar de Colombia)'),
      new Date('Mon Nov 14 2022 00:00:00 GMT-0500 (hora estándar de Colombia)'),
      new Date('Thu Dec 08 2022 00:00:00 GMT-0500 (hora estándar de Colombia)')
    ]
    if(d==null){
      return false;
    }
    let day = days_picker.getDay();
    holydays.map((days:any)=>{   
      if (days ==  d){
        day_filter=day;        
      }
    })
    return day !== 0 && day !== 6 && day !== day_filter;
  }
}
