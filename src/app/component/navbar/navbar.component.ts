import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Stomp } from '@stomp/stompjs';
import { first } from 'rxjs';
import * as SockJS from 'sockjs-client';
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

  stompClient: any = null;
  privateStompClient: any = null;
  socket: any;
  user$: any;
  messages:any;
  user:any;

  loginForm = new FormGroup({
    text: new FormControl('', { validators: [Validators.required] }),
    message: new FormControl('', { validators: [Validators.required] }),
    to: new FormControl('', { validators: [Validators.required] }),  
    nickname: new FormControl('', { validators: [Validators.required] }),  
  });

  constructor(private registerService:RegisterService, 
    private sharedService:SharedService, private sanitizer: DomSanitizer,
    private router: Router
    ) {
    this.id$=this.sharedService.getId;
   }

  ngOnInit(): void {
    let count=0;
    this.router.events.subscribe((event=>{
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
  }
  socketComfig(user:any, count:number){
    if(count<=1){
      this.user=user.user;  
      this.socket = new SockJS(`http://localhost:8091/ws?user=${user.user}`);      
      this.privateStompClient = Stomp.over(this.socket);
  
      
  
      this.privateStompClient.connect({}, (frame: any) => {        
        this.privateStompClient.subscribe('/user/specific', (result: any) => {          
          this.show(JSON.parse(result.body));
        });
      });
  
      this.socket = new SockJS(`http://localhost:8091/ws?user==${user.user}`);
      this.stompClient = Stomp.over(this.socket);  
      this.stompClient.connect({}, (frame: any) => {        
        this.stompClient.subscribe('/common/messages', (result: any) => {
          this.show(JSON.parse(result.body));
        });
      });
    }  
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
    let idUser = this.user;

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
  
  sendPrivateMessage() {
    let text = this.loginForm.get('message')?.value;
    let from = this.loginForm.get('nickname')?.value;
    let to = this.loginForm.get('to')?.value;
    let idUser = this.user;

    this.stompClient.send("/app/private", {}, JSON.stringify({
      'content': text, 
      'destination': to, 
      'origin': from,
      'idUser': idUser,
      'state': false
    }));
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

  show(message: any) {
    this.messages=message;    
  }
}
