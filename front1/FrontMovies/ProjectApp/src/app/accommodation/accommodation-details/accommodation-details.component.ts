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
import { environment } from 'src/env/env';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { RecordPostDTO } from './recordPost';
import { DVPostDTO } from './dvPostDTO';
@Component({
    selector: 'app-accommodation-details',
    templateUrl: './accommodation-details.component.html',
    styleUrls: ['./accommodation-details.component.css'],
    standalone: true,
    imports: [FormsModule,MatRadioModule,ReactiveFormsModule,MatChipsModule,MatPaginatorModule, MatIconModule,MatTableModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule, CommonModule, LayoutModule, ReservationComponent]
})
export class AccommodationDetailsComponent implements OnInit,AfterViewInit{

  id:string;
  naslov:string;
  @Input()
  movie:MovieGetDTO;
  s3Url:string;
  _response:any;

  rating: number = 1;

  movie_id:string;
  movie_naslov:string;

  averageRating:number=0;


  actorsDataSource: MatTableDataSource<string>;
  displayedColumns: string[] = ['Name', 'actions'];
  

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

  editMovieForm=new FormGroup({
    actors:new FormControl('',Validators.required),
    description:new FormControl('',Validators.required),
    director:new FormControl('',Validators.required),
    genre:new FormControl('',Validators.required),
  })
  selectedFile:string;
  showEditForm = false;
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
            this.movie_id=this.movie.id_filma
            console.log("ID FILMA : ",this.movie_id)
            this.movie_naslov=this.movie.naslov
            console.log("NASLOV FILMA : ",this.movie_naslov)
          }

          if (this.movie && this.movie.glumci) {
            const actorsList = this.movie.glumci.split(',');
            this.actorsDataSource = new MatTableDataSource<string>(actorsList);
          }
          this.rateAverageGrade();
          
        },
        (error: any) => {
          console.error('Error fetching movie details:', error);
        }
      );
    });
  }

subscribeActor(actor:string){

  const username = localStorage.getItem('username'); // Dohvati korisničko ime iz Local Storage-a
  if (!username) {
    console.error('Username not found in Local Storage.');
    return;
  }

  const data = {
    username: username,
    actor:actor
    
  };
  console.log("USENRAME ", username)
  console.log("ACTOR   ",actor)
  this.http.post<any>(`${environment.cloudHost}subscribeActor`, data).subscribe(
    response => {
      console.log(`Subscribed to ${actor} successfully:`, response);
      this.openSnackBar('Uspesna pretplata na glumca!');
    },
    error => {
      console.error(`Subscription to ${actor} failed:`, error);
    }
  );

}

subscribeDirector(director:string|undefined){
  const username = localStorage.getItem('username'); // Dohvati korisničko ime iz Local Storage-a
  if (!username) {
    console.error('Username not found in Local Storage.');
    return;
  }

  const data = {
    username: username,
    director : director
    
  };
  console.log("USENRAME ", username)
  console.log("DIRECTOR   ",director)
  this.http.post<any>(`${environment.cloudHost}subscribeDirector`, data).subscribe(
    response => {
      console.log(`Subscribed to ${director} successfully:`, response);
      this.openSnackBar('Uspesna pretplata!');
    },
    error => {
      console.error(`Subscription to ${director} failed:`, error);
    }
  );

}


subscribeGenre(genre: string | undefined): void {
  const username = localStorage.getItem('username'); // Dohvati korisničko ime iz Local Storage-a
  if (!username) {
    console.error('Username not found in Local Storage.');
    return;
  }

  const data = {
    username: username,
    genre: genre
    
  };
  console.log("USENRAME ", username)
  console.log("GENRE   ",genre)
  this.http.post<any>(`${environment.cloudHost}subscribeGenre`, data).subscribe(
    response => {
      console.log(`Subscribed to ${genre} successfully:`, response);
      this.openSnackBar('Uspesna pretplata!');
    },
    error => {
      console.error(`Subscription to ${genre} failed:`, error);
    }
  );
}

  goBack() {
    this.router.navigate(['/home']);
  }

  isAdmin(): boolean {
    let userGroups = localStorage.getItem('Group');
    if (userGroups) {
        //let groupsArray = JSON.parse(userGroups); // Pretvaranje stringa u JavaScript objekat (niz)
        return userGroups.includes('Admins');
    }
    return false; // Vraća false ako nije pronađen 'Admins' u nizu
  }

  async onFileSelected(event: any, index: number = -1): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      const base64String = await this.uploadFile(file);
      this.selectedFile = base64String;
      
    }
  }

  async uploadFile(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if(reader.result){
          const base64String = reader.result.toString().split(',')[1];
          resolve(base64String);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }
  edit() {
    this.showEditForm = !this.showEditForm;

    console.log(this.movie)
    console.log(this._response)
    if (this.showEditForm) {
      // Set the form values to arbitrary strings
      this.editMovieForm.patchValue({
        actors: this.movie.glumci,
        description: this.movie.opis,
        director: this.movie.reziser,
        genre: this.movie.zanr
      });
    }
  }
  async confirmEdit(){
    //console.log(this.selectedFile)

    const fileInput = (document.querySelector('input[type="file"]') as HTMLInputElement);
    var file = null;
    if(fileInput.files){
      file = fileInput.files[0];
    }
    console.log(file)
    const url = `${environment.cloudHost}putMovie`;

    if(file){
      // poziv put sa fajlom
      const video_data = await this.uploadFile(file);
    
      var movieData = {
        id_filma: this.id,
        naslov: this.naslov,
        glumci: this.editMovieForm.get('actors')?.value ?? '',
        opis: this.editMovieForm.get('description')?.value ?? '',
        reziser: this.editMovieForm.get('director')?.value ?? '',
        zanr: this.editMovieForm.get('genre')?.value ?? '',
        video_data: video_data,
        file_type: file.type.split('/')[1],
        file_name: file.name,
        file_size: file.size,
        file_modified: new Date(file.lastModified).toISOString(),
        combined_key:""
      };
      movieData['combined_key'] = movieData.naslov+"|"+movieData.glumci+"|"+movieData.opis+"|"+movieData.reziser+"|"+movieData.zanr;
      console.log(movieData)

      this.http
      .put(url, movieData)
      .subscribe(
        (response: any) => {
          console.log('Edit response:', response);
          this.openSnackBar('Film uspešno izmenjen.');
          
        },
        (error: any) => {
          console.error('Error editing movie:', error);
          this.openSnackBar('Greška prilikom izmene filma.');
        }
      );
    }

    else{
      // poziv put bez izmene fajla
      var editMovie = {
        'id_filma':this.id,
        'naslov':this.naslov,
        'glumci':this.editMovieForm.get('actors')?.value ?? '',
        'opis':this.editMovieForm.get('description')?.value ?? '',
        'reziser':this.editMovieForm.get('director')?.value ?? '',
        'zanr':this.editMovieForm.get('genre')?.value ?? '',
        'combined_key':""
      }
      editMovie['combined_key'] = editMovie.naslov+"|"+editMovie.glumci+"|"+editMovie.opis+"|"+editMovie.reziser+"|"+editMovie.zanr;
      console.log(editMovie['combined_key'])

      

      this.http
      .put(url, editMovie)
      .subscribe(
        (response: any) => {
          console.log('Edit response:', response);
          this.openSnackBar('Film uspešno izmenjen.');
          
        },
        (error: any) => {
          console.error('Error editing movie:', error);
          this.openSnackBar('Greška prilikom izmene filma.');
        }
      );
    }
    
  }
  delete(): void{
    console.log('Kliknuo button')
    var deleteData={
      'id_filma':this.id,
      'naslov':this.naslov
    }

    console.log(deleteData)
    const url = `${environment.cloudHost}deleteMovie`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        id_filma: this.id,
        naslov: this.naslov
      }
    };

    this.http
      .delete(url, options)
      .subscribe(
        (response: any) => {
          console.log('Delete response:', response);
          this.openSnackBar('Film uspešno obrisan.');
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error('Error deleting movie:', error);
          this.openSnackBar('Greška prilikom brisanja filma.');
        }
      );
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



            const username=localStorage.getItem('username')

          if (username === null) {
            console.error('Username is not set in localStorage');
            return;
          }


            const record = new DVPostDTO(username, 'view',this.movie_id,this.movie_naslov);

        console.log(record);

        this.http.post<any>(`${environment.cloudHost}postDV`, record, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }).subscribe(
          response => {
            console.log('Zapis uspesno dodat:', response);
          
          },
          error => {
            console.error('Greška prilikom ubacivanja zapisa:', error);
          
          }
        );


         

        //   const record = new RecordPostDTO(username, 'view', 1,this.movie_id,this.movie_naslov);

        // console.log(record);

        // this.http.post<any>(`${environment.cloudHost}postRecord`, record, {
        //   headers: new HttpHeaders({
        //     'Content-Type': 'application/json'
        //   })
        // }).subscribe(
        //   response => {
        //     console.log('Zapis uspesno dodat:', response);
          
        //   },
        //   error => {
        //     console.error('Greška prilikom ubacivanja zapisa:', error);
          
        //   }
        // );


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

        const username=localStorage.getItem('username')

        if (username === null) {
          console.error('Username is not set in localStorage');
          return;
        }


        const record = new DVPostDTO(username, 'download',this.movie_id,this.movie_naslov);

        console.log(record);

        this.http.post<any>(`${environment.cloudHost}postDV`, record, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }).subscribe(
          response => {
            console.log('Zapis uspesno dodat:', response);
          
          },
          error => {
            console.error('Greška prilikom ubacivanja zapisa:', error);
          
          }
        );
        // const record = new RecordPostDTO(username, 'download', 1,this.movie_id,this.movie_naslov);

        // console.log(record);

        // this.http.post<any>(`${environment.cloudHost}postRecord`, record, {
        //   headers: new HttpHeaders({
        //     'Content-Type': 'application/json'
        //   })
        // }).subscribe(
        //   response => {
        //     console.log('Zapis uspesno dodat:', response);
          
        //   },
        //   error => {
        //     console.error('Greška prilikom ubacivanja zapisa:', error);
          
        //   }
        // );
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


  submitRating(){
    console.log('Rating submitted:', this.rating);
    
    const username=localStorage.getItem('username')

    if (username === null) {
      console.error('Username is not set in localStorage');
      return;
    }

    const record = new RecordPostDTO(username, 'rate', this.rating,this.movie_id,this.movie_naslov);

    console.log(record);

    this.http.post<any>(`${environment.cloudHost}postRecord`, record, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(
      response => {
        console.log('Zapis uspesno dodat:', response);
        this.openSnackBar('Uspesno dodata ocena!');
       
      },
      error => {
        console.error('Greška prilikom ubacivanja zapisa:', error);
      
      }
    );
  
  }


  rateAverageGrade() {
    let sum = 0;
    let count = 0;
  
    this.http.get<any[]>(`${environment.cloudHost}getRecords`).subscribe(
      records => {
        console.log('Svi zapisi:', records);
  
        records.forEach(record => {
          // Provera uslova
          if (
              record.id_filma === this.movie_id &&
              record.naslov === this.movie_naslov &&
              record.type === 'rate') {
            
            sum += parseInt(record.content, 10); 

            count++;
          }
        });

        console.log("Suma  ",sum)
        console.log("Count  ",count)
  
        // Prosečna ocena
        this.averageRating = count > 0 ? sum / count : 0;
        console.log('Prosečna ocena filma:', this.averageRating);
      },
      error => {
        console.error('Greška prilikom dohvatanja zapisa:', error);
      }
    );
  }

}



