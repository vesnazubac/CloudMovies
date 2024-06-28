import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserReportPostDTO } from 'src/app/models/dtos/userReportPostDTO.model';
import { UserReportsService } from '../reports.service';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-guests-reporting-owners',
  templateUrl: './guests-reporting-owners.component.html',
  styleUrls: ['./guests-reporting-owners.component.css'],
  standalone:true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,MatIconModule,
    MatButtonModule,MatSelectModule,
    MatSlideToggleModule,CommonModule,MatRadioModule]

})
export class GuestsReportingOwnersComponent {

  reportOwnerForm: FormGroup;
  ownerId:String;
  

  

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reportService:UserReportsService,
    private snackBar:MatSnackBar

  ) { }
  

  ngOnInit(): void {
    this.reportOwnerForm = this.formBuilder.group({
      ownerId: [''],
      reason: [null]
     
    });
    
    
 
  }
  

 



  reportOwner() {
    const ownerUsername = this.reportOwnerForm.value.ownerId;
    const reason = this.reportOwnerForm.value.reason;
   
    const accessToken: any = localStorage.getItem('user');
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(accessToken);

    const report: UserReportPostDTO = {
      userThatReportsId:decodedToken.sub,
     userThatIsReported:ownerUsername,
     reason:reason
    }
    this.reportService.create(report).pipe(
      catchError((error) => {
        console.error('Error, possibly invalid username :', error);
  
        // Provera da li je greška tipa Bad Request (HTTP 400)
        if (error.status === 400) {
          // Prikazivanje Snackbar-a sa porukom o grešci
          this.snackBar.open('It is impossible to report the user because there have been no reservations with them.', 'Close', {
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
    ).subscribe({
      next: (data: UserReportPostDTO) => {
        // Ovaj blok će se izvršiti kada operacija bude uspešna
        if (data) {
          this.router.navigate(['home']);
        } else {
          
        }
      },
    });
  }
}


