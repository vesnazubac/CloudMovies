import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { ReservationService } from 'src/app/models/reservation/reservation.service';
import { Accommodation } from 'src/app/accommodation/accommodation/model/accommodation.model';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { ReviewPostDTO } from 'src/app/models/dtos/reviewPostDTO.model';
import { ReviewService } from '../review.service';
import { ReviewEnum } from 'src/app/models/enums/reviewEnum';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { ReviewStatusEnum } from 'src/app/models/enums/reviewStatusEnum';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-owner-rating',
  templateUrl: './owner-rating.component.html',
  styleUrls: ['./owner-rating.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,MatIconModule,MatButtonModule,MatSelectModule,
    MatSlideToggleModule,CommonModule,MatRadioModule]

})
export class OwnerRatingComponent implements OnInit {
  createOwnerRatingForm: FormGroup;
  reservationId: number;
  ownerId:String;
  accommodationId:number;

  

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private accomodationService:AccommodationService,
    private reviewService:ReviewService,
    private router: Router,
    private snackBar:MatSnackBar

  ) { }
  

  ngOnInit(): void {
    this.createOwnerRatingForm = this.formBuilder.group({
      ownerId: [''],
      rating: [null],
      comment: ['']
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.accommodationId = +params.get('id')!;
      this.accomodationService.getById(this.accommodationId).subscribe(
        (foundAccomodation) => {
          const ownerUsernameControl = this.createOwnerRatingForm.get('ownerId');
          if (foundAccomodation !== null && foundAccomodation !== undefined && ownerUsernameControl) {
            ownerUsernameControl.setValue(foundAccomodation.ownerId);
            this.ownerId=foundAccomodation.ownerId;
          } else {
            console.error(`Owner ID ${foundAccomodation?.ownerId} not found or ownerId control is not defined`);
          }
        },
        (error: any) => {
          console.error('Error fetching owner ID:', error);
        }
      );
    });
    
 
  }
  

 



  rateOwner() {
    const ownerUsername = this.createOwnerRatingForm.value.ownerId;
    const rating = this.createOwnerRatingForm.value.rating;
    const comment = this.createOwnerRatingForm.value.comment;
    // Rad sa prikupljenim vrednostima
    console.log('Owner Username:', this.ownerId);
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    const accessToken: any = localStorage.getItem('user');
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(accessToken);

    const review: ReviewPostDTO = {
      userId:decodedToken.sub,
      type:ReviewEnum.OWNER,//OWNER or ACCOMMODATION
      comment:comment,
      accommodationId:this.accommodationId,
      ownerId:ownerUsername,
      grade:rating,
      dateTime:new Date(),
      deleted:false,
      reported:false,
      status: ReviewStatusEnum.PENDING,
      reservationId:0  
    }
    this.reviewService.create(review).pipe(
      catchError((error) => {
        console.error('Error, possibly invalid username :', error);
        
  
        // Provera da li je greška tipa Bad Request (HTTP 400)
        if (error.status === 400) {
          // Prikazivanje Snackbar-a sa porukom o grešci
          this.snackBar.open('It is impossible to rate.', 'Close', {
            duration: 5000, // Trajanje snackbar-a u milisekundama
          });
        } else {
          // Ako greška nije tipa Bad Request, možete dodati drugu logiku ili prikazati drugu poruku
          // Primer: Ako nije Bad Request, prikaži generičku poruku
          this.snackBar.open('Došlo je do greške. Molimo pokušajte ponovo.', 'Zatvori', {
            duration: 5000,
          });
          
        }
  
        // Vraćamo observable sa greškom pomoću throwError
        return throwError(error);
      })
    ).subscribe(
      {
        next: (data: ReviewPostDTO) => {
          this.router.navigate(['home'])
        },
      }
    );
  }

}

