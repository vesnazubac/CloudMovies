import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/env/env';
import {Observable} from "rxjs";
import { AccommodationPostDTO } from '../models/dtos/accommodationPostDTO.model';
import { AccommodationPutDTO } from '../models/dtos/accommodationPutDTO.model';
import { Accommodation } from './accommodation/model/accommodation.model';
import { HttpHeaders } from '@angular/common/http';
import { AccommodationStatusEnum } from '../models/enums/accommodationStatusEnum';
import { HttpParams } from '@angular/common/http';
import { AccommodationDetails } from './accommodation/model/accommodationDetails.model';
import { formatDate } from '@angular/common';
import { AccommodationTypeEnum } from '../models/enums/accommodationTypeEnum';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  constructor(private httpClient: HttpClient) {
  }

  create(accommodation: AccommodationPostDTO): Observable<Accommodation> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<Accommodation>(
      environment.apiHost + 'accommodations',
      JSON.stringify(accommodation),
      { headers: headers }
    );
  }
  getAll():Observable<Accommodation[]>{
    return this.httpClient.get<Accommodation[]>(environment.apiHost+'accommodations');
  }
  getAllApproved():Observable<Accommodation[]>{
    return this.httpClient.get<Accommodation[]>(environment.apiHost+'accommodations/approved');
  }
  getById(id: number): Observable<Accommodation | undefined> {
    return this.httpClient.get<Accommodation>(environment.apiHost + 'accommodations/' + id);
  }
  search(params: HttpParams):Observable<AccommodationDetails[]>{
    console.log(params);
    return this.httpClient.get<AccommodationDetails[]>(environment.apiHost+'accommodations/search',{params});
  }
  filter(params: HttpParams): Observable<AccommodationDetails[]> {
    return this.httpClient.get<AccommodationDetails[]>(environment.apiHost + 'accommodations/filter', { params });
  }
  getByStatus(status: AccommodationStatusEnum): Observable<Accommodation[] | undefined> {
    return this.httpClient.get<Accommodation[]>(environment.apiHost + 'accommodations/status/' + status);
  }

  update(updatedAccommodation: AccommodationPutDTO, id: number): Observable<AccommodationPutDTO> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<AccommodationPutDTO>(
      environment.apiHost + 'accommodations/' + id,
      JSON.stringify(updatedAccommodation),
      { headers: headers }
    );
  }
  
  updateStatus(id: number, status: AccommodationStatusEnum): Observable<Accommodation> {
    const params = new HttpParams().set('status', status);
    const apiUrl = `${environment.apiHost}accommodations/${id}/update-status`;
    return this.httpClient.put<Accommodation>(apiUrl, null, { params });
  }

  updateImages(accommodationId: number, images: string): Observable<Accommodation> {
    const params = new HttpParams().set('image', images);
    const apiUrl = `${environment.apiHost}accommodations/${accommodationId}/update-images`;

    return this.httpClient.put<Accommodation>(apiUrl, null, { params });
  }

  delete(id: number): Observable<Accommodation | undefined> {
    return this.httpClient.delete<Accommodation>(environment.apiHost + 'accommodations/' + id);
  }
  getByOwnerId(ownerId: string): Observable<Accommodation | undefined> {
    return this.httpClient.get<Accommodation>(
      `${environment.apiHost}accommodations/owner/${ownerId}`
    );
  }

}


