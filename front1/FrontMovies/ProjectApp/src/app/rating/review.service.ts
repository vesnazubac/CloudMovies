import { Injectable } from '@angular/core';

import {HttpClient} from "@angular/common/http";
import { environment } from 'src/env/env';
import {Observable} from "rxjs";

import { ReviewPutDTO } from '../models/dtos/reviewPutDTO.model';
import { ReviewPostDTO } from '../models/dtos/reviewPostDTO.model';
import { Review } from '../accommodation/accommodation/model/review.model';
import { ReviewStatusEnum } from '../models/enums/reviewStatusEnum';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewsList: Review[] = [];

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Review[]> {
    return this.httpClient.get<Review[]>(environment.apiHost + 'reviews')
  }

  create(review: ReviewPostDTO): Observable<ReviewPostDTO> {

    return this.httpClient.post<ReviewPostDTO>(environment.apiHost + 'reviews', review)
  }
  update(review: ReviewPutDTO,id:number): Observable<Review> {
   
    return this.httpClient.put<Review>(environment.apiHost + 'reviews/' + id,review)
  }

  findByOwnerId(ownerId: string): Observable<Review[]> {
    return this.httpClient.get<Review[]>(environment.apiHost + 'reviews/owner/' + ownerId);
  }

  findByAccommodationId(accommodationId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(environment.apiHost + 'reviews/accommodation/' + accommodationId);
  }
  delete(id:number) {
    return this.httpClient.delete(environment.apiHost + 'reviews/' + id)
  }

  findPendingByOwnerId(ownerId: string): Observable<Review[]> {
    return this.httpClient.get<Review[]>(environment.apiHost + 'reviews/owner/pending/' + ownerId);
  }

  findPendingByAccommodationId(accommodationId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(environment.apiHost + 'reviews/accommodation/pending/' + accommodationId);
  }

  approveReview(reviewId: number|undefined): Observable<void> {
    return this.httpClient.put<void>(environment.apiHost + 'reviews/' + reviewId + '/update-status/approve', null);
  }

  rejectReview(reviewId: number|undefined): Observable<void> {
    return this.httpClient.put<void>(environment.apiHost + 'reviews/' + reviewId + '/update-status/reject', null);
  }

  findAverageGradeByOwnerId(ownerId: String): Observable<number> {
    return this.httpClient.get<number>(environment.apiHost + 'reviews/averageGradesOwners/' + ownerId);
  }

  
  findAverageGradeByAccommodationId(accommodationId: number): Observable<number> {
    //console.log("A PUTANJA JE " + environment.apiHost + 'reviews/averageGradesAccommodations/' + accommodationId)
    return this.httpClient.get<number>(environment.apiHost + 'reviews/averageGradesAccommodations/' + accommodationId);
  }




  
  
}