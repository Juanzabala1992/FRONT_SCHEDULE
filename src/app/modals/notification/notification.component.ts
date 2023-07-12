import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { SharedService } from 'src/app/services/shared.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  
  stompClient: any = null;
  privateStompClient: any = null;
  socket: any;
  data_user: any;
  user$: any;
  messages:any;

  loginForm = new FormGroup({
    text: new FormControl('', { validators: [Validators.required] }),
    message: new FormControl('', { validators: [Validators.required] }),
    to: new FormControl('', { validators: [Validators.required] }),  
    nickname: new FormControl('', { validators: [Validators.required] }),  
  });

  constructor(private sharedService: SharedService) {
    this.user$ = this.sharedService.getUser;
  }

  ngOnInit(): void {
    this.user$.subscribe((user: any) => {
      this.dataLoad(user);
    });
    const userString=localStorage.getItem('user');          
    if(userString){
      const user = JSON.parse(userString);
      this.socketComfig(user);      
    }

    console.log("this.data_user--> ", this.data_user?.user);
      
  }  

  socketComfig(user:any){

    this.socket = new SockJS('http://localhost:8091/ws');
    this.stompClient = Stomp.over(this.socket);  
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/common/messages', (result: any) => {
        this.show(JSON.parse(result.body));
      });
    });
    this.socket = new SockJS(`http://localhost:8091/ws?user=${user.user}`);
    this.privateStompClient = Stomp.over(this.socket);
    this.privateStompClient.connect({}, (frame: any) => {
      console.log(frame);
      this.privateStompClient.subscribe('/user/specific', (result: any) => {
        console.log(result.body);
        this.show(JSON.parse(result.body));
      });
    });
  }

  dataLoad(data: any) {
    this.data_user = data;
  }

  sendMessage() {
    let text = this.loginForm.get('text')?.value;
    let from = this.loginForm.get('nickname')?.value;
    let idUser = this.data_user.id_user;

    this.stompClient.send("/app/application", {}, JSON.stringify({
      'content': text, 
      'destination': 'all', 
      'origin': from,
      'idUser': idUser,
      'state': false
    }));
  }
  
  sendPrivateMessage() {
    let text = this.loginForm.get('message')?.value;
    let from = this.loginForm.get('nickname')?.value;
    let to = this.loginForm.get('to')?.value;
    let idUser = this.data_user.id_user;

    this.stompClient.send("/app/private", {}, JSON.stringify({
      'content': text, 
      'destination': to, 
      'origin': from,
      'idUser': idUser,
      'state': false
    }));
  }
  
  show(message: any) {
    this.messages=message;
    console.log("message--->", this.messages);
  }
}
