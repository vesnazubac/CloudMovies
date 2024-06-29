import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccommodationDataService } from 'src/app/accommodation/accommodation-data.service.module';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { Accommodation } from 'src/app/accommodation/accommodation/model/accommodation.model';
import { AccommodationDetails } from 'src/app/accommodation/accommodation/model/accommodationDetails.model';
import { environment } from 'src/env/env';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 
})
export class HomeComponent {
   accommodationList: Accommodation[] = []


   searchedAccommodations: AccommodationDetails[] | undefined
   constructor(private service: AccommodationService, private snackBar:MatSnackBar, private fb: FormBuilder,
    private dataService: AccommodationDataService,private router: Router,private http: HttpClient) {
  }
  ngOnInit(): void {

    this.service.getAllApproved().subscribe({
       next: (data: Accommodation[]) => {
        this.accommodationList = data
       },
      error: (_) => {console.log("Greska!")}
     })
  }
  searchMoviesForm = this.fb.group({
    title: [''],
    description: [''],
    genre: [''],
    director: [''],
    actors: ['']
  });

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
  

  searchAccommodations() {

    const title = this.searchMoviesForm.get('title')?.value;
    const description = this.searchMoviesForm.get('description')?.value;
    const genre = this.searchMoviesForm.get('genre')?.value;
    const director = this.searchMoviesForm.get('director')?.value;
    const actors = this.searchMoviesForm.get('actors')?.value;
    
    let params = new HttpParams()
      .set('naslov', title ?? '')
      .set('opis', description ?? '')
      .set('zanr', genre ?? '')
      .set('reziser',director ?? '')
      .set('glumci',actors ?? '');
      console.log(params)

      const url = `${environment.cloudHost}/searchMovies`;
      
      this.http.get(url, { params }).subscribe({
        next: (data: any) => {
          console.log('Rezultati pretrage:', data);
          // Ažuriranje rezultata u servisu ako je potrebno
          // this.dataService.updateSearchedAccommodations(data);
          // Navigacija na željenu stranicu
          // this.router.navigate(['/searched-accommodation-cards']);
        },
        error: (error) => {
          console.error('Greška pri dohvatanju podataka:', error);
          // Prikazivanje snackbar poruke u slučaju greške
          this.openSnackBar('Greška pri dohvatanju podataka');
        }
      });
   // this.service.search(params).subscribe({
     // next: (data: AccommodationDetails[]) => {
     //   this.dataService.updateSearchedAccommodations(data);
      //  this.router.navigate(['/searched-accommodation-cards']);
     // },
     // error: (error) => {
     //   console.error('Error fetching accommodations:', error);
    //  },
    //});
  }
  }

