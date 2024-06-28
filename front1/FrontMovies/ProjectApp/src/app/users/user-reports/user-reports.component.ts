import { UserReport } from 'src/app/accommodation/accommodation/model/userReport.model';
import { UserReportsService } from 'src/app/reports/reports.service';
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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.css'],
  standalone:true,
  imports: [MatChipsModule,MatPaginatorModule, MatIconModule,MatTableModule, 
    MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule,
     CommonModule, LayoutModule]
})
export class UserReportsComponent {

  constructor(private route: ActivatedRoute,private snackBar:MatSnackBar,private userReportsService:UserReportsService) { }

  userId:String|null|undefined;
  usersReports:UserReport[]|null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];

      if (this.userId) {
        this.userReportsService.getByUserId(this.userId).subscribe((reports: UserReport[] | null) => {
          this.usersReports = reports;
          //console.log(this.usersReports);
        });
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,  
    });
  }

  ignoreReport(report:UserReport){
    if(!report.id){return;}
    this.userReportsService.ignoreReport(report.id).subscribe(
      (activatedReport) => {
        this.openSnackBar('Report is closed!');
        if(this.usersReports){
        this.usersReports = this.usersReports.filter(r => r.id !== report.id);
        }
      },
      (error) => {
      
      }
    );
  }

  deactivateUser(report:UserReport){
    if(!report.id){return;}
    this.userReportsService.deactivation(report.id).subscribe(
      (activatedReport) => {
        this.openSnackBar('Sucessfully deactivated user : '+report.userThatIsReported);
        if(this.usersReports){
        this.usersReports = this.usersReports.filter(r => r.id !== report.id);
        }
      },
      (error) => {
      
      }
    );
  }


}
