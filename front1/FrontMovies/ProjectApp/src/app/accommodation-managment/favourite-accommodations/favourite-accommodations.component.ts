import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccommodationDataService } from 'src/app/accommodation/accommodation-data.service.module';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { Accommodation } from 'src/app/accommodation/accommodation/model/accommodation.model';
import { AuthService } from 'src/app/auth/auth.service';
import { LayoutModule } from 'src/app/layout/layout.module';
import { User } from 'src/app/models/user.model';
import { RoleEnum } from 'src/app/models/userEnums.model';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-favourite-accommodations',
  templateUrl: './favourite-accommodations.component.html',
  styleUrls: ['./favourite-accommodations.component.css'],
  standalone:true,
  imports: [ReactiveFormsModule, MatFormFieldModule,MatNativeDateModule, MatInputModule, MatIconModule, MatButtonModule, MatChipsModule, MatRadioModule, LayoutModule , MatTableModule, MatPaginatorModule,
  CommonModule, MatDatepickerModule, MatSnackBarModule]
})
export class FavouriteAccommodationsComponent {
  accessToken: any = localStorage.getItem('user');
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(this.accessToken);
  loggedInUserId=this.decodedToken.sub;
  role: RoleEnum ;
  wholeUser:User;

  accommodationList: Accommodation[] = []
  accommodationsToShow: Accommodation[]=[]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private service: AccommodationService, private snackBar:MatSnackBar, private fb: FormBuilder,
    private dataService: AccommodationDataService,private router: Router,
    private authService: AuthService,private cdr: ChangeDetectorRef,
    private userService:UserService) {
  }
  displayedColumns: string[] = ['Id', 'Name'];
  dataSource = new MatTableDataSource<Accommodation>([]);
  ngOnInit(): void {
    this.service.getAllApproved().subscribe({
      next: (data: Accommodation[]) => {
       this.accommodationList = data
       console.log(this.accommodationList)
      },
     error: (_) => {console.log("Greska!")}
    })

    this.myMethod()
  }
  myMethod(){
    this.authService.userState.subscribe((result) => {
      if(result != null){
        this.role = result.role;
      }else{
       this.role=RoleEnum.UNAUTHENTICATED;
      }
     this.cdr.detectChanges();
    })
    this.userService.getUserById(this.loggedInUserId).subscribe(
      (foundUser) => {
        if(foundUser){
          this.wholeUser = foundUser;
          console.log(this.wholeUser.favouriteAccommodations);
          
          // Convert the user's favoriteAccommodations string to an array of numbers
          const favoriteIds = this.wholeUser.favouriteAccommodations
            .split(',')
            .map(id => parseInt(id.trim(), 10));
          console.log(favoriteIds)
          console.log(this.accommodationList)
          for(const accommodation of this.accommodationList){
            //console.log(accommodation)
            if(accommodation.id)
            if(favoriteIds.includes(accommodation.id)){
              this.accommodationsToShow.push(accommodation)
            }
          }
          // Update the data source
          this.dataSource.data = this.accommodationsToShow || [];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    );
  }
}
