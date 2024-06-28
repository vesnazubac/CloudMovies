import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/env/env';
import {Observable} from "rxjs";
import { HttpHeaders } from '@angular/common/http';
import { PriceCard } from './accommodation/model/priceCard.model';
import { PriceCardPostDTO } from '../models/dtos/priceCardPostDTO.model';
import { PriceCardPutDTO } from '../models/dtos/priceCardPutDTO.model';

@Injectable({
  providedIn: 'root'
})
export class PriceCardService {
  constructor(private httpClient: HttpClient) {
  }

  create(priceCard: PriceCardPostDTO): Observable<PriceCard> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<PriceCard>(
      environment.apiHost + 'priceCards',
      JSON.stringify(priceCard),
      { headers: headers }
    );
  }

  getByAccommodationId(id: number): Observable<PriceCard[] | undefined> {
    return this.httpClient.get<PriceCard[]>(environment.apiHost + 'priceCards/accommodation/' + id);
  }

  update(priceCard:PriceCardPutDTO,id:number):Observable<PriceCard>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<PriceCard>(
      environment.apiHost + 'priceCards/'+id,
      JSON.stringify(priceCard),
      { headers: headers }
    );
  }

  delete(id: number): Observable<void> {
    console.log(id)
    return this.httpClient.delete<void>(environment.apiHost+'priceCards/'+id);
  }

}