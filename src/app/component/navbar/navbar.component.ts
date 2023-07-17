import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Stomp } from '@stomp/stompjs';
import { delay, first } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { NotificationsService } from 'src/app/services/notifications.service';
import { RegisterService } from 'src/app/services/register.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  error='';
  id$: any;
  id_user!:string;
  data_user!:any;
  imageData!:any;
  load:boolean=false;
  view=false;
  notifications$:any;
  stompClient: any = null;
  privateStompClient: any = null;
  socket: any;
  user$: any;
  messages:number=0;
  user:any;

  loginForm = new FormGroup({
    text: new FormControl('', { validators: [Validators.required] }),
    message: new FormControl('', { validators: [Validators.required] }),
    to: new FormControl('', { validators: [Validators.required] }),  
    nickname: new FormControl('', { validators: [Validators.required] }),  
  });

  constructor(private registerService:RegisterService, 
    private sharedService:SharedService, private sanitizer: DomSanitizer,
    private router: Router, private notificationsService:NotificationsService
    ) {
    this.id$=this.sharedService.getId;
    this.notifications$=this.sharedService.getNotification;
   }

  ngOnInit(): void {
    let count=0;
    this.router.events.subscribe((async event=>{
      if(this.router.url.includes('/login')){
          this.view=false;
      }
      else{
          this.view=true;
          const userString=localStorage.getItem('user');   
          count++;
          if(userString){
            const user = JSON.parse(userString);
            this.socketComfig(user, count);             
        }
      }
    }));

    this.id$.subscribe((id:string)=>{
      this.id_user=id;
      if(this.id_user[0]){
        this.loadData();
      }
    });  
    
    this.notifications$.subscribe((notification:any)=>{
      this.sendPrivateMessage(notification);
    });    
  }
  socketComfig(user:any, count:number){    
    if(count<=1){
      this.user=user;  
      this.socket = new SockJS(`http://operation-management-env.eba-mtmfqwpu.eu-west-1.elasticbeanstalk.com:5000/ws?user=${user.user}`);
      //this.socket = new SockJS(`http://localhost:8091/ws?user=${user.user}`);      
      this.privateStompClient = Stomp.over(this.socket);  
      this.show(this.user);

      this.privateStompClient.connect({}, (frame: any) => { 
        console.log(frame);       
        this.privateStompClient.subscribe('/user/specific', (result: any) => {          
          this.newMessage(JSON.parse(result.body));
        });
      });
  
      this.socket = new SockJS(`http://operation-management-env.eba-mtmfqwpu.eu-west-1.elasticbeanstalk.com:5000/ws?user=${user.user}`);
      //this.socket = new SockJS(`http://localhost:8091/ws?user=${user.user}`);
      this.stompClient = Stomp.over(this.socket);  
      this.stompClient.connect({}, (frame: any) => {        
        console.log(frame);
        this.stompClient.subscribe('/common/messages', (result: any) => {
          this.newMessage(JSON.parse(result.body));
        });
      });
    }  
  }
  newMessage(message:any){    
    this.sharedService.setNotificationTo=[message];
    this.messages=this.messages+1;
  }
  loadData(){    
    this.registerService.getUser(this.id_user)
    .pipe(first())
    .subscribe({
        next: (data) => {            
            this.base64ToArrayBuffer(data, data.foto);            
        },
        error: error => {
            this.error = error;            
        }
    });    
  }  
  sendMessage() {

    let text = this.loginForm.get('text')?.value;
    let from = this.loginForm.get('nickname')?.value;
    let idUser = '';
    if(this.user){
      idUser = this.user.user;
    }
    this.stompClient.send("/app/application", {}, JSON.stringify(
      {
      'content': text, 
      'origin': from,
      'destination':'all',
      'idUser': idUser,
      'state': false
      }
      ));
  }
  
  sendPrivateMessage(notification:any) {     
    let from = '';
    let idUser = '';

    if(this.user){
      from = this.user.user;
      idUser = this.user.user;
    }

    for(let i=0; i<notification.length;i++){      
      this.stompClient.send("/app/private", {}, JSON.stringify({
        'messageId':notification[i].messageId,
        'content': notification[i].message, 
        'destination': notification[i].destination, 
        'origin': from,
        'idUser': idUser,
        'state': false
      }));

    }    
  }

  password(){
    this.router.navigate(['/change-password']);
  }
  base64ToArrayBuffer(base64Str:any, foto:any) { 
    this.load=true;   
    this.data_user=base64Str;
    const base64String = foto.substring(foto.indexOf(',') + 1);
    const binaryString = window.atob(base64String);
    const bytes = new Uint8Array(
      Array.from(binaryString, (char) => char.charCodeAt(0))
    );
    const blob = new Blob([bytes], { type: 'image/png' });
    this.imageData = URL.createObjectURL(blob);

  }
  notifications(){
    this.router.navigate(['/notifications']);
  }
  loadMessages(data:any){
    let count=0;
    data.map((data:any)=>{      
      if(!data.state){
        count++;
      }      
      return count;
    });
    
    this.messages=count;
  }
  show(message: any) {    
    /*let user_result='' 
    console.log("message -->", message);
    if(message.user){
      user_result=message.user;
    }
    else{
      user_result=message.email;
      this.sharedService.setNotificationTo=message;
    }*/
     this.notificationsService.getUser(message.user)
      .pipe(first())
      .subscribe({
        next: (data:any) => { 
          this.loadMessages(data);
        },
        error: (error:any) => {
            this.error = error;            
        }
    });
  }   
}
