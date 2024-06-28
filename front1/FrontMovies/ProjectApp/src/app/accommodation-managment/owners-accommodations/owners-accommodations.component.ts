import { Component, OnInit,ViewChild ,ChangeDetectorRef} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import { LayoutModule } from 'src/app/layout/layout.module';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { PriceCard } from 'src/app/accommodation/accommodation/model/priceCard.model';
import { CommonModule } from '@angular/common';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PriceTypeEnum } from 'src/app/models/enums/priceTypeEnum';
import { FormControl ,Validators} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AccommodationTypeEnum } from 'src/app/models/enums/accommodationTypeEnum';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { ReservationConfirmationEnum } from 'src/app/models/enums/reservationConfirmationEnum';
import { AccommodationPutDTO } from 'src/app/models/dtos/accommodationPutDTO.model';
import { Accommodation } from 'src/app/accommodation/accommodation/model/accommodation.model';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditPriceCardDialogComponent } from '../edit-price-card-dialog/edit-price-card-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PriceCardService } from 'src/app/accommodation/priceCard.service';
import { Reservation } from 'src/app/models/reservation/reservation.model';
import { ReservationService } from 'src/app/models/reservation/reservation.service';
import { PriceCardPostDTO } from 'src/app/models/dtos/priceCardPostDTO.model';
import { ReservationStatusEnum } from 'src/app/models/enums/reservationStatusEnum';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-owners-accommodations',
  templateUrl: './owners-accommodations.component.html',
  styleUrls: ['./owners-accommodations.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatNativeDateModule, MatInputModule, MatIconModule,MatButtonModule,MatChipsModule,MatRadioModule,LayoutModule,MatTableModule, MatPaginatorModule,CommonModule,MatDatepickerModule,MatSnackBarModule],

})
export class OwnersAccommodationsComponent {

  accessToken: any = localStorage.getItem('user');
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(this.accessToken);
  ownerId:string=""

// if (this.decodedToken) {
//   console.log("USERNAMEEE 899 " , decodedToken.sub)
//   this.ownerId=decodedToken.sub;
//   }

 dataSource = new MatTableDataSource<Accommodation>([]);
  displayedColumns: string[] = ['Id', 'Name', 'Owner','Type','Status','actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
   constructor(private service: AccommodationService, private snackBar:MatSnackBar,private router: Router) {
  }
  ngOnInit(): void {
    this.ownerId=this.decodedToken.sub;
    this.service.getByOwnerId(this.ownerId)
    .subscribe(
      (response) => {
        if (Array.isArray(response)) {
          const filteredList = response.filter((accommodation) => accommodation.status === 'APPROVED');
          
          this.dataSource = new MatTableDataSource<Accommodation>(filteredList);
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error(error);
      }  
    );
  }

  openEditComponent(element:Accommodation){
    this.router.navigate(['/editAccommodation', element.id]);
  }
  openReservationsComponent(element:Accommodation){
    this.router.navigate(['/accommodationsReservations', element.id]);
  }
}
