import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Accommodation } from '../accommodation/model/accommodation.model';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { AccommodationService } from '../accommodation.service';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { LayoutModule } from "../../layout/layout.module";
import { ReservationComponent } from "../../reservation/reservation.component";
import { UserGetDTO } from 'src/app/models/userGetDTO.model';
import { RoleEnum } from 'src/app/models/userEnums.model';
import { AuthService } from 'src/app/auth/auth.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PriceCard } from '../accommodation/model/priceCard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Review } from '../accommodation/model/review.model';
import { ReviewService } from 'src/app/rating/review.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ReviewStatusEnum } from 'src/app/models/enums/reviewStatusEnum';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { MovieGetDTO } from 'src/app/models/movieGetDTO.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-accommodation-details',
    templateUrl: './accommodation-details.component.html',
    styleUrls: ['./accommodation-details.component.css'],
    standalone: true,
    imports: [MatChipsModule,MatPaginatorModule, MatIconModule,MatTableModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule, CommonModule, LayoutModule, ReservationComponent]
})
export class AccommodationDetailsComponent implements OnInit,AfterViewInit{

  id:string;
  naslov:string;
  @Input()
  movie:MovieGetDTO;
  s3Url:string;
  _response:any;
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private cdr: ChangeDetectorRef,
    private userService:UserService,
    private snackBar:MatSnackBar,
    private http:HttpClient
  ){}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 4000,
    });
  }
  ngOnInit() {

    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.naslov = params['naslov']; 

      this.userService.getMovieByIdMovies(this.id, this.naslov).subscribe(
        (response: any) => {
          this.movie = response.movie_data;
          this._response=response
          if (this.movie && this.movie.s3_url) {
            this.s3Url = this.movie.s3_url.trim();
          }
          
        },
        (error: any) => {
          console.error('Error fetching movie details:', error);
        }
      );
    });
  }
  goBack() {
    this.router.navigate(['/home']);
  }

  play(){
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
            
            document.body.appendChild(modalContent);
  
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


  // download():Observable<Blob>{
  //   return this.http.get(this.s3Url,{responseType:'blob'});
  // }


  download() {
    console.log("S3URL : ", this.s3Url);
    console.log("File type : ", this._response.movie_data.file_type);
    var headers = new HttpHeaders();
    
    headers = headers.set('skip', 'true');
    
    // Pripremite opcije za zahtev
    const options = {
      responseType: 'blob' as 'json', // Postavite responseType na 'blob'
    //  headers: new HttpHeaders().set('Authorization', '')
      headers
    };
  
    // Pošaljite HTTP GET zahtev
    this.http.get(this.s3Url, options).subscribe(
      (response: any) => {
        const blob = new Blob([response], { type: 'video/' + this._response.movie_data.file_type });
  
        // Kreirajte URL za preuzimanje
        const url = window.URL.createObjectURL(blob);
  
        // Kreirajte link za preuzimanje
        const a = document.createElement('a');
        a.href = url;
        a.download = this.movie.naslov; // Postavite naziv fajla za preuzimanje
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  
        // Oslobodite URL objekat
        window.URL.revokeObjectURL(url);
  
        // Zabeležite preuzimanje
        this.recordDownload();
      },
      (error: HttpErrorResponse) => {
        // Obradite greške
        console.error('Greška prilikom preuzimanja videa:', error);
  
        // Detaljna poruka o grešci
        let errorMessage = 'Došlo je do nepoznate greške prilikom preuzimanja.';
        if (error.error instanceof ErrorEvent) {
          // Greška na klijentskoj strani
          errorMessage = `Došlo je do greške: ${error.error.message}`;
        } else {
          // Greška na serverskoj strani
          errorMessage = `Server je vratio kod greške: ${error.status}, poruka greške je: ${error.message}`;
        }
  
        // Prikažite poruku o grešci korisniku
        this.snackBar.open(errorMessage, 'OK', {
          duration: 4000
        });
      }
    );
  }

  recordDownload() {
    const downloadRecord = {
      userId: localStorage.getItem("username"), // Postavite pravi userId ovde
      movie_id: this.movie!.id_filma,
      title: this.movie!.naslov
    };

    // this.movieService.downloadRecord(downloadRecord).subscribe(
    //   (data) => {
    //     console.log('Download record:', data);
    //     // Obrada uspešnog beleženja preuzimanja
    //   },
    //   (error) => {
    //     console.error('Error recording download:', error);
    //     // Obrada greške prilikom beleženja preuzimanja
    //   }
    // );
  }
}



