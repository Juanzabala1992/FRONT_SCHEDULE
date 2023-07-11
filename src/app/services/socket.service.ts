import { Injectable } from '@angular/core';
import { Client, IStompSocket, Message, Stomp, StompConfig, StompHeaders } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
  constructor() {
    this.initializeWebSocketConnection();
  }
  public stompClient:any;
  public msg = [];
  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8081/socket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
   
    this.stompClient.connect({}, function(frame: any) {
      that.stompClient.subscribe('/message', (message: { body: never; }) => {
        if (message.body) {
          that.msg.push(message.body);
        }
      });
    });
  }
  
  sendMessage(message:any) {
    this.stompClient.send('/app/send/message' , {}, message);
  }
}
