import { Component, Input } from '@angular/core';
import { Accommodation } from './model/accommodation.model';
import { MovieGetDTO } from 'src/app/models/movieGetDTO.model';
import { UserService } from 'src/app/user.service';


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

  constructor(private userService: UserService) {}

  // showMovieContent() {
  //   // Fetch movie details including S3 URL from the server if needed
  //   this.userService.getAllMovies().subscribe(
  //     (movies: MovieGetDTO[]) => {
  //       const movieWithS3Url = movies.find((m) => m.id_filma === this.movie.id_filma);
  //       if (movieWithS3Url && movieWithS3Url.s3_url) {
  //         console.log("USAO 30 LINIJA ")
  //         const s3Url = movieWithS3Url.s3_url.trim();
  //         if (s3Url !== '') {
  //           console.log("S3 URL JE ",s3Url);
  //           //window.open(s3Url, '_blank'); // Opens the S3 content in a new tab or window
  //           window.location.href = s3Url;
  //         } else {
  //           console.error(`Invalid S3 URL for movie with id ${this.movie.id_filma}`);
  //         }
  //       } else {
  //         console.error(`Movie with id ${this.movie.id_filma} not found in the list or missing S3 URL.`);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching movies:', error);
  //     }
  //   );
  // }
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
