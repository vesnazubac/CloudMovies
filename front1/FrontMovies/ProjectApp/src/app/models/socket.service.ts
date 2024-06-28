import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env';
import { map } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  url: string = environment.apiHost + "socket";
  restUrl:string = environment.apiHost + "/sendMessageRest";

  constructor(private http: HttpClient) { }

  post(data: Message) {
    return this.http.post<Message>(this.url, data)
      .pipe(map((data: Message) => { return data; }));
  }

  postRest(data: Message) {
    return this.http.post<Message>(this.restUrl, data)
      .pipe(map((data: Message) => { return data; }));
  }
}