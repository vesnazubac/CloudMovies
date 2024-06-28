import { Injectable } from '@angular/core';
import {Wine} from "./wine/model/wine.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../env/env";
import {Observable} from "rxjs";
//added some comment
@Injectable({
  providedIn: 'root'
})
export class WineService {
  private wineList: Wine[] = [];

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Wine[]> {
    return this.httpClient.get<Wine[]>(environment.apiHost + 'wines')
  }

  add(wine: Wine): Observable<Wine> {
    return this.httpClient.post<Wine>(environment.apiHost + 'add', wine)
  }

  getWine(id: number): Observable<Wine> {
    return this.httpClient.get<Wine>(environment.apiHost + 'wines/' + id)
  }
}
