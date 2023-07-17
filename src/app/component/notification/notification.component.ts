import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Stomp } from '@stomp/stompjs';
import { first } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { ResponseFollowComponent } from 'src/app/modals/response-follow/response-follow.component';
import { NotificationsService } from 'src/app/services/notifications.service';
import { RegisterService } from 'src/app/services/register.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  error='';
  registers:any;
  notifications$:any
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'state',
    'foto',
    'nombre',
    'content',
    'origin',
    'fecha',
  ];
  
  constructor(private notificationsService:NotificationsService, 
    private registerService:RegisterService,
    private sharedService:SharedService, private ngbModal: NgbModal
    ){
      this.notifications$=this.sharedService.getNotificationTo;
  }
  ngOnInit(): void {
    const userString=localStorage.getItem('user'); 
    if(userString){
      const user = JSON.parse(userString);
      this.notificationsService.getUser(user.user)
      .pipe(first())
      .subscribe({
      next: (data:any) => { 
        this.loadMessages(data, false);
      },
      error: (error:any) => {
          this.error = error;            
        }
      });         
    }   
    this.notifications$.subscribe((data:any)=>{      
      if(data.length){   
        console.log("data  error", data);          
       this.loadMessages(data, true);
      }      
    })
  }
  loadMessages(messages: any, isNew:boolean) {     
    for(let i=0;i<messages.length;i++){      
      this.registerService.getUserByEmail(messages[i].origin).pipe(first())
      .subscribe({
        next: (data:any) => {           
          this.getInfo(data, messages, isNew);         
        },
        error: (error:any) => {
            this.error = error;            
          }
        });
    }    
  }

  getInfo(data:any, messages:any, isNew:boolean){    
    const relatedMessages = messages.map((message:any) => {
      if (message.origin === data.email) {
       let foto = this.base64ToArrayBuffer(data.foto);
        
        return {
            id: message.id,
            foto: foto,
            nombre: data.nombre,
            apellido: data.apellido,
            messageId: message.messageId,
            content: message.content,
            destination: message.destination,
            origin: message.origin,
            state: message.state,
            fecha: new Date()
        };
    } else {
        return null;
    }
  });
    if(isNew){
      
      this.registers.push(relatedMessages[0]);
    }else{
      this.registers = new Array<any>();
      this.registers = relatedMessages;
    }
            this.dataSource = new MatTableDataSource(this.registers);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
  }
  openEdit(data:any){
    let modal = this.ngbModal.open(ResponseFollowComponent,{ windowClass: 'xxl'});
        modal.componentInstance.data = data;
        this.registers.map((obj:any)=>{
          if(obj.messageId==data.messageId){            
            obj.state=true;
          }
          return obj;
      });

  }
  base64ToArrayBuffer(foto:any) { 
    const base64String = foto.substring(foto.indexOf(',') + 1);
    const binaryString = window.atob(base64String);
    const bytes = new Uint8Array(
      Array.from(binaryString, (char) => char.charCodeAt(0))
    );
    const blob = new Blob([bytes], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }
}
