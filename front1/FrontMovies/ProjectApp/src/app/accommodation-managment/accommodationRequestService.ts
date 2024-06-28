import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/env/env';
import {Observable} from "rxjs";
import { AccommodationPostDTO } from '../models/dtos/accommodationPostDTO.model';
import { AccommodationPutDTO } from '../models/dtos/accommodationPutDTO.model';
import { HttpHeaders } from '@angular/common/http';
import { AccommodationStatusEnum } from '../models/enums/accommodationStatusEnum';
import { HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { AccommodationTypeEnum } from '../models/enums/accommodationTypeEnum';
import { Accommodation } from '../accommodation/accommodation/model/accommodation.model';
import { AccommodationRequest } from '../accommodation/accommodation/model/accommodationRequest.model';
import { AccommodationRequestStatus } from '../models/enums/accommodationRequestStatus';
@Injectable({
  providedIn: 'root'
})
export class AccommodationRequestService {
  constructor(private httpClient: HttpClient) {
  }

  
  getAll():Observable<AccommodationRequest[]>{
    return this.httpClient.get<AccommodationRequest[]>(environment.apiHost+'accommodationsRequests');
  }
  getById(id: number): Observable<AccommodationRequest | undefined> {
    return this.httpClient.get<AccommodationRequest>(environment.apiHost + 'accommodationsRequests/' + id);
  }
  getByStatus(status: AccommodationRequestStatus): Observable<AccommodationRequest[]> {
    const url = environment.apiHost + 'accommodationsRequests/'+'status/' + status;
    return this.httpClient.get<AccommodationRequest[]>(url);
  }
  getByTwoStatuses(status1: AccommodationRequestStatus, status2: AccommodationRequestStatus): Observable<AccommodationRequest[]> {
    const url = environment.apiHost + `accommodationsRequests/status/${status1}/${status2}`;
    return this.httpClient.get<AccommodationRequest[]>(url);
  }

  updateStatus(requestId: number, status: AccommodationRequestStatus): Observable<AccommodationRequest> {
    const url = `${environment.apiHost}accommodationsRequests/${requestId}/update-status?status=${status}`;
    return this.httpClient.put<AccommodationRequest>(url, {});
  }
}