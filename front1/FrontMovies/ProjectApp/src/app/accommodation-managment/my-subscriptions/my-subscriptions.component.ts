// import { HttpClient } from '@angular/common/http';
// import { Component, ViewChild, OnInit } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
// import { environment } from 'src/env/env';

// import {MatChipsModule} from '@angular/material/chips';
// import {MatIconModule} from '@angular/material/icon';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatButtonModule} from '@angular/material/button';
// import { MatListModule } from '@angular/material/list';
// import { CommonModule } from '@angular/common';
// import { LayoutModule } from "../../layout/layout.module";
// import { ReservationComponent } from "../../reservation/reservation.component";
// import { UserGetDTO } from 'src/app/models/userGetDTO.model';
// import { RoleEnum } from 'src/app/models/userEnums.model';
// import { AuthService } from 'src/app/auth/auth.service';
// import { ReviewService } from 'src/app/rating/review.service';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { ReviewStatusEnum } from 'src/app/models/enums/reviewStatusEnum';
// import { User } from 'src/app/models/user.model';
// import { UserService } from 'src/app/user.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Observable, map } from 'rxjs';
// import { MovieGetDTO } from 'src/app/models/movieGetDTO.model';
// import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


// @Component({
//   selector: 'app-my-subscriptions',
//   templateUrl: './my-subscriptions.component.html',
//   styleUrls: ['./my-subscriptions.component.css'],
//   standalone:true,
//   imports:[MatButtonModule,MatChipsModule,MatIconModule]
// })
// export class MySubscriptionsComponent implements OnInit {

//   topicsDataSource: MatTableDataSource<string>;
//   displayedColumns: string[] = ['Name', 'actions'];

//  // @ViewChild(MatPaginator) paginator: MatPaginator;
//   @ViewChild(MatSort) sort: MatSort;

//   userSubscriptions: any[] = [];
//   userEmail: string|undefined|null = localStorage.getItem('username');

//   constructor(private http: HttpClient) { }

//   ngOnInit(): void {
//     this.getUserSubscriptions();
//   }

//   getUserSubscriptions(): void {
//     this.http.get<any>(`${environment.cloudHost}getTopics?email=${this.userEmail}`)
//       .subscribe(response => {
//         this.userSubscriptions = response; // Ovdje očekujemo da će Lambda funkcija vratiti polje pretplata
//         console.log(this.userSubscriptions);

//         const topics = this.userSubscriptions.map(subscription => {
//           const parts = subscription.TopicArn.split(':');
//           return parts[5]; 
//         });

//         this.topicsDataSource.data = topics;

//         //this.topicsDataSource.paginator = this.paginator;
//         this.topicsDataSource.sort = this.sort;

//         console.log(this.topicsDataSource.data);

//       }, error => {
//         console.error('Error fetching subscriptions:', error);
//       });
//   }

//   unsubscribe(topic: string): void {
//     // Implement unsubscribe logic here
//   }
// }

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { environment } from 'src/env/env';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { LayoutModule } from "../../layout/layout.module";
import { ReservationComponent } from "../../reservation/reservation.component";
import { UserGetDTO } from 'src/app/models/userGetDTO.model';
import { RoleEnum } from 'src/app/models/userEnums.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ReviewService } from 'src/app/rating/review.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ReviewStatusEnum } from 'src/app/models/enums/reviewStatusEnum';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { MovieGetDTO } from 'src/app/models/movieGetDTO.model';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule
  ]
})
export class MySubscriptionsComponent implements OnInit {

  // topicsDataSource: MatTableDataSource<string>([]);
  topicsDataSource = new MatTableDataSource<string>([]);
  displayedColumns: string[] = ['Name', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userSubscriptions: any[] = [];
  userEmail: string | undefined | null = localStorage.getItem('username');


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getUserSubscriptions();
  }

  getUserSubscriptions(): void {
    this.http.get<any>(`${environment.cloudHost}getTopics?email=${this.userEmail}`)
      .subscribe(response => {
        this.userSubscriptions = response; // Ovdje očekujemo da će Lambda funkcija vratiti polje pretplata
        console.log(this.userSubscriptions);

        const topics = this.userSubscriptions.map(subscription => {
          const parts = subscription.TopicArn.split(':');
          return parts[5];
        });

        this.topicsDataSource.data = topics;
        this.topicsDataSource.paginator = this.paginator;
        this.topicsDataSource.sort = this.sort;

        console.log(this.topicsDataSource.data);

      }, error => {
        console.error('Error fetching subscriptions:', error);
      });
  }

  unsubscribe(topic: string): void {
    this.http.post<any>(`${environment.cloudHost}unsubscribe`, { topic: topic, email: this.userEmail })
    .subscribe(response => {
      // Obrada uspešnog unsubscribe-a
      console.log(`Successfully unsubscribed from topic: ${topic}`);
      
      // Ažuriranje prikaza ili ponovno učitavanje podataka
      this.getUserSubscriptions();
    }, error => {
      console.error(`Error unsubscribing from topic: ${topic}`, error);
    });
  }
}

