import { Injectable } from '@angular/core';

import {HttpClient} from "@angular/common/http";
import { environment } from 'src/env/env';
import {Observable} from "rxjs";
import { Message } from './models/message.model';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(environment.apiHost + 'notifications')
  }

  getByUserId(username:string): Observable<Message[]> {
    return this.httpClient.get<Message[]>(environment.apiHost + 'notifications/user/'+username)
  } 
  
}