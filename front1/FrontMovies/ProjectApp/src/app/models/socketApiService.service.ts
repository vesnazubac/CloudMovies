import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from 'stompjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/env/env';
import { Message } from './message.model';
import { SocketService } from './socket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SocketApiService {
  private serverUrl = environment.apiHost + 'socket';
  private stompClient: any;
  
  private stompSubject = new BehaviorSubject<any>(null);
  private username:string


  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: Message[] = [];

  constructor(private socketService: SocketService, private snackBar: MatSnackBar) {    
    this.initializeWebSocketConnection();
  }


  initializeWebSocketConnection() {
    // serverUrl je vrednost koju smo definisali u registerStompEndpoints() metodi na serveru
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openGlobalSocket()
    });

  }

  sendUserIdOnLogin(userId: string) {
    this.stompClient.send("/send/userId", {}, JSON.stringify({ userId }));
  }
  

  sendMessageUsingSocket(message: Message) {
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
      console.log('Notification sent:', message);
  }

  sendMessageUsingRest(message: Message) {
      this.socketService.postRest(message).subscribe(res => {
      });
    
  }

  openGlobalSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe("/socket-publisher", (message: { body: string }) => {
        this.handleResult(message);
      });
    }
  }
  openSocket(username:String) {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe("/socket-publisher/" + username, (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }

  handleResult(message: { body: string; }) {
    console.log("HANDLE RESULTT")
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      console.log("MESSAGE : "+message)
      this.messages.push(messageResult);
      this.openSnackBar('New message received : '+messageResult.content, 'Dismiss');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000, 
    });
  }


getStompClient(): BehaviorSubject<any> {
  return this.stompClient;
}

}