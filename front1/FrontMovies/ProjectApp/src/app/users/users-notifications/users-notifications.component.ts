import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { Review } from 'src/app/accommodation/accommodation/model/review.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ReservationComponent } from 'src/app/reservation/reservation.component';
import { RoleEnum } from 'src/app/models/userEnums.model';
import { ReviewPutDTO } from 'src/app/models/dtos/reviewPutDTO.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/notificationService';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-users-notifications',
  templateUrl: './users-notifications.component.html',
  styleUrls: ['./users-notifications.component.css'],
  standalone: true,
  imports: [MatChipsModule,MatPaginatorModule, MatIconModule,MatTableModule, 
      MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule,
       CommonModule, LayoutModule, ReservationComponent]
})
export class UsersNotificationsComponent {

  constructor(private route: ActivatedRoute,private snackBar:MatSnackBar,private notificationService:NotificationService) { }

  notifications:Message[] |null|undefined;
  ownerId:string |null;

  ngOnInit() {

    const accessToken: any = localStorage.getItem('user');
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(accessToken);

    const username:string = decodedToken.sub;

    this.notificationService.getByUserId(username).subscribe(
      (data) => {
        this.notifications = data;
        console.log(this.notifications)
      },
      (error) => {
        console.error('Došlo je do greške prilikom dohvaćanja notifikacija:', error);
      }
    );
  
   
  }

}
