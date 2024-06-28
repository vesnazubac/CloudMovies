import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import { UsersViewComponent } from './users-view/users-view.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { UsersReviewsComponent } from './users-reviews/users-reviews.component';
import { UserReportsComponent } from './user-reports/user-reports.component';
import { UsersNotificationsComponent } from './users-notifications/users-notifications.component';



@NgModule({
  declarations: [
    UsersViewComponent,
    UsersReviewsComponent,
    UserReportsComponent,
    UsersNotificationsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MaterialModule
  ],
  exports:[
    UsersViewComponent
  ]
})
export class UsersModule { }
