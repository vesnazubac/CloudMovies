import { Component, Input } from '@angular/core';
import { Accommodation } from './model/accommodation.model';
import { MovieGetDTO } from 'src/app/models/movieGetDTO.model';
import { UserService } from 'src/app/user.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env';


@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css'],
})
export class AccommodationComponent {
  @Input() 
  movie:MovieGetDTO;
  truncateDescription(description: string, words: number): string {
    const wordArray = description.split(' ');
    if (wordArray.length > words) {
      return wordArray.slice(0, words).join(' ') + '...';
    }
    return description;
  }
  moviesList: MovieGetDTO[] = []
  constructor(private userService: UserService, private http:HttpClient) {}
  ngOnInit():void{
    if(this.movie.episode){
      let params = new HttpParams()
      .set('naslov', this.movie.naslov ?? '')
      .set('opis', this.movie.opis ?? '')
      .set('reziser',this.movie.reziser ?? '')
      .set('glumci',this.movie.glumci ?? '');
      console.log(params)

      const url = `${environment.cloudHost}searchMovies`;
      
      this.http.get(url, { params }).subscribe({
        next: (data: any) => {
          console.log('Rezultati pretrage:', data);

          const uniqueMoviesList: MovieGetDTO[] = [];

          data.forEach((item: any) => {
              uniqueMoviesList.push({
                id_filma: item.id_filma,
                rezolucija: item.rezolucija,
                zanr: item.zanr,
                trajanje: item.trajanje,
                naslov: item.naslov,
                opis: item.opis,
                reziser: item.reziser,
                glumci: item.glumci,
                s3_url:item.s3_url,
                episode:item.episode
              });
          });
  
          this.moviesList = uniqueMoviesList;
          console.log('Converted SERIES:', this.moviesList);
        },
        error: (error) => {
          console.error('Greška pri dohvatanju podataka:', error);
          // Prikazivanje snackbar poruke u slučaju greške
        }
      });
    }
  }
  showMovieContent() {
    // Fetch movie details including S3 URL from the server if needed
    this.userService.getAllMovies().subscribe(
      (movies: MovieGetDTO[]) => {
        const movieWithS3Url = movies.find((m) => m.id_filma === this.movie.id_filma);
        if (movieWithS3Url && movieWithS3Url.s3_url) {
          const s3Url = movieWithS3Url.s3_url.trim();
          if (s3Url !== '') {
            console.log("S3 URL JE ", s3Url);
  
            // Stvorite element modala ili lightboxa
            const modalContent = document.createElement('div');
            modalContent.innerHTML = `
              <div class="modal">
                <div class="modal-content">
                  <span class="close-button">&times;</span>
                  <iframe src="${s3Url}" frameborder="0"></iframe>
                </div>
              </div>
            `;
            
            // Dodajte modalski sadržaj u body dokumenta
            document.body.appendChild(modalContent);
  
            // Dodajte stilove za modal
            const style = document.createElement('style');
            style.textContent = `
              .modal {
                display: block;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.8);
              
              }
  
              .modal-content {
                position: relative;
               /* background-color: #fefefe;*/
                background-color: #add8e6;
                margin: 5% auto 0; /* Promenjeno margin-top na 5% */
              padding: 20px;;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
                max-width: 800px;
              }
  
              .close-button {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
              }
  
              .close-button:hover,
              .close-button:focus {
                color: black;
                text-decoration: none;
                cursor: pointer;
              }
  
              iframe {
                width: 100%;
                height: 80vh; /* Adjust as needed */
                border: none;
              }
            `;
            document.head.appendChild(style);
  
            // Dodajte logiku za zatvaranje modala na klik dugmeta za zatvaranje
            const closeButton = modalContent.querySelector('.close-button');
            closeButton?.addEventListener('click', () => {
              document.body.removeChild(modalContent);
            });
          } else {
            console.error(`Invalid S3 URL for movie with id ${this.movie.id_filma}`);
          }
        } else {
          console.error(`Movie with id ${this.movie.id_filma} not found in the list or missing S3 URL.`);
        }
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }
  
}
