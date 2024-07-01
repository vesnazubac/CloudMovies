import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovieGetDTO } from 'src/app/models/movieGetDTO.model';
import { environment } from 'src/env/env';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 
})
export class HomeComponent {
   moviesList: MovieGetDTO[] = []

   constructor( private snackBar:MatSnackBar, private fb: FormBuilder,private router: Router,private http: HttpClient) {
  }
  ngOnInit(): void {
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
  

  searchMovies() {

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

          this.moviesList = data.map((item: any) => ({
            id_filma: item.id_filma,
            rezolucija: item.rezolucija,
            zanr: item.zanr,
            trajanje: item.trajanje,
            naslov: item.naslov,
            opis: item.opis,
            reziser: item.reziser,
            glumci: item.glumci,
          }));
          console.log('Converted Movies:', this.moviesList);
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

