import { Injectable } from '@angular/core';

import {HttpClient} from "@angular/common/http";
import { environment } from 'src/env/env';
import {Observable} from "rxjs";

import { ReviewPutDTO } from '../models/dtos/reviewPutDTO.model';
import { ReviewPostDTO } from '../models/dtos/reviewPostDTO.model';
import { Review } from '../accommodation/accommodation/model/review.model';
import { ReviewStatusEnum } from '../models/enums/reviewStatusEnum';
import { UserReport } from '../accommodation/accommodation/model/userReport.model';
import { User } from '../models/user.model';
import { UserReportPostDTO } from '../models/dtos/userReportPostDTO.model';

@Injectable({
  providedIn: 'root'
})
export class UserReportsService {
  private reviewsList: UserReport[] = [];

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<UserReport[]> {
    return this.httpClient.get<UserReport[]>(environment.apiHost + 'userReports')
  }

  create(report: UserReportPostDTO): Observable<UserReportPostDTO> {

    return this.httpClient.post<UserReportPostDTO>(environment.apiHost + 'userReports', report)
  }

  getByUserId(userId:String): Observable<UserReport[]> {
    return this.httpClient.get<UserReport[]>(environment.apiHost + 'userReports/user/'+userId)
  }
  
  deactivation(id: number): Observable<UserReport> {
    return this.httpClient.put<UserReport>(`${environment.apiHost}userReports/report/${id}`, {});
  }

  ignoreReport(id: number): Observable<UserReport> {
    return this.httpClient.put<UserReport>(`${environment.apiHost}userReports/ignore/${id}`, {});
  }
  
}