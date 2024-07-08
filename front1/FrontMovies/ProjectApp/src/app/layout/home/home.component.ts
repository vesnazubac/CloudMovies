import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DVGetDTO } from 'src/app/accommodation/accommodation-details/dvGetDTO';
import { RecordGetDTO } from 'src/app/accommodation/accommodation-details/recordGetDTO';
import { MovieGetDTO } from 'src/app/models/movieGetDTO.model';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/env/env';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 
})
export class HomeComponent {
   moviesList: MovieGetDTO[] = []
   selectedMovie: any; // Holds details of the selected movie

   records:DVGetDTO[]=[]

   userSubscriptions: any[] = [];

   subscribedTopics:any[]=[];


   rateRecords:RecordGetDTO[]=[]

   movieHeuristicMap: Map<string, { naslov: string; score: number }> = new Map();

   topMoviesMap: Map<string, { naslov: string; score: number }> = new Map();

   fetchedMovies: MovieGetDTO[] = [];

   constructor( private userService:UserService,private snackBar:MatSnackBar, private fb: FormBuilder,private router: Router,private http: HttpClient) {
  }
  ngOnInit(): void {

    this.getRecordsByUsername();
    

    

  }

  getRecordsByUsername() {
    const url = `${environment.cloudHost}getUserDVS?username=${localStorage.getItem('username')}`;

    this.http.get<any>(url).subscribe(
      data => {
        this.records = data;
        console.log('Records:', this.records);

        this.http.get<any[]>(`${environment.cloudHost}getRecords`).subscribe(
          _records => {
            console.log('Svi zapisi:', _records);
           
      
            _records.forEach(record => {
              // Provera uslova
              if (record.username === localStorage.getItem('username')) {
                  this.rateRecords.push(record);
              }
            });
        
          })
    
          console.log("Rate records : ",this.rateRecords);


        this.calculateHeuristicScores();
        // this.extractTopMovies();
        // this.fetchTopMovies();

        

      },
      error => {
        console.error('Error fetching records:', error);
      }
    );
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

      const url = `${environment.cloudHost}searchMovies`;
      
      this.http.get(url, { params }).subscribe({
        next: (data: any) => {
          console.log('Rezultati pretrage:', data);

          const uniqueTitles = new Set<string>();
          const uniqueMoviesList: MovieGetDTO[] = [];

          data.forEach((item: any) => {
            if (!uniqueTitles.has(item.naslov)) {
              uniqueTitles.add(item.naslov);
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
            }
          });
  
          this.moviesList = uniqueMoviesList;
          this.fetchedMovies=this.moviesList;
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

  onMovieClicked(movie: any) {
    // Function to handle movie click event
    this.selectedMovie = movie;
    console.log('Clicked movie:', movie);
    // You can perform any actions here based on the clicked movie
  }

  calculateHeuristicScores() {
    this.movieHeuristicMap.clear();

    this.records.forEach((record) => {
      const { id_filma, naslov, timestamp, type } = record;
      const score = this.calculateScore(timestamp, type);

      if (this.movieHeuristicMap.has(id_filma)) {
        const current = this.movieHeuristicMap.get(id_filma)!;
        this.movieHeuristicMap.set(id_filma, {
          naslov,
          score: current.score + score,
        });
      } else {
        this.movieHeuristicMap.set(id_filma, { naslov, score });
      }
    });

    this.rateRecords.forEach((rateRecord) => {
      const { id_filma, content } = rateRecord;
      const scoreWeight = this.getScoreWeight(content); // Get weight based on rating
      if (this.movieHeuristicMap.has(id_filma)) {
        const current = this.movieHeuristicMap.get(id_filma)!;
        this.movieHeuristicMap.set(id_filma, {
          naslov: current.naslov,
          score: current.score + scoreWeight,
        });
      } else {
        // If movie not already in map (should not happen if properly fetched)
        this.movieHeuristicMap.set(id_filma, { naslov: '', score: scoreWeight });
      }
    });


    this.considerUserSubscriptions()
    

    // console.log('Movie Heuristic Map:', this.movieHeuristicMap);
  }

  calculateScore(timestamp: string, type: string): number {
    const now = new Date();
    const recordDate = new Date(timestamp);
    const timeDiff = Math.abs(now.getTime() - recordDate.getTime());
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    let baseScore = 0;

    if (type === 'download') {
      baseScore = 100;
    } else if (type === 'view') {
      baseScore = 50;
    }

    return baseScore / (1 + daysDiff);
  }


  extractTopMovies() {
    // Convert map to an array and sort by score in descending order
    const sortedEntries = Array.from(this.movieHeuristicMap.entries()).sort(
      (a, b) => b[1].score - a[1].score
    );

    // Take top 5 movies and put them into topMoviesMap
    this.topMoviesMap.clear();
    sortedEntries.slice(0, 5).forEach(([id_filma, value]) => {
      this.topMoviesMap.set(id_filma, value);
    });

    console.log('Top Movies Map:', this.topMoviesMap);
  }


  fetchTopMovies() {
    this.topMoviesMap.forEach((value, id_filma) => {
      this.userService.getMovieByIdMovies(id_filma, value.naslov).subscribe(
        (response: any) => {
          const movieData: MovieGetDTO = response.movie_data;
          if (movieData) {
            this.fetchedMovies.push(movieData);
            console.log('Fetched movie:', movieData);
          }
        },
        (error: any) => {
          console.error('Error fetching movie details:', error);
        }
      );
    });
  }


  getScoreWeight(ocena: number): number {
    switch (ocena) {
      case 3:
        return 90; 
      case 2:
        return 60; 
      case 1:
      default:
        return 30;
    }
  }

  considerUserSubscriptions(): void {
    this.http.get<any>(`${environment.cloudHost}getTopics?email=${localStorage.getItem('username')}`)
      .subscribe(response => {
        this.userSubscriptions = response; 
        console.log("User subscriptions : ", this.userSubscriptions);
  
        this.subscribedTopics = this.userSubscriptions.map(subscription => {
          const parts = subscription.TopicArn.split(':');
          return parts[5];
        });
  
        console.log("Topics : ", this.subscribedTopics);
  
        this.http.get<any[]>(`${environment.cloudHost}movies`)
          .subscribe(movies => {
            movies.forEach(movie => {
              const { id_filma, zanr, reziser, glumci } = movie;
  
              // Check if any subscribed topic matches genre, director, or actors
              this.subscribedTopics.forEach(topic => {
                if (
                  zanr.toLowerCase().includes(topic.toLowerCase()) ||
                  reziser.toLowerCase().includes(topic.toLowerCase()) ||
                  glumci.toLowerCase().includes(topic.toLowerCase())
                ) {
                  // Add score of 35 to the movie if topic matches
                  if (this.movieHeuristicMap.has(id_filma)) {
                    const current = this.movieHeuristicMap.get(id_filma)!;
                    this.movieHeuristicMap.set(id_filma, {
                      naslov: current.naslov,
                      score: current.score + 35,
                    });
                  } else {
                    this.movieHeuristicMap.set(id_filma, {
                      naslov: movie.naslov,
                      score: 35,
                    });
                  }
                }
              });
            });
  
            console.log('Movie Heuristic Map with Subscriptions:', this.movieHeuristicMap);
            this.extractTopMovies();
            this.fetchTopMovies();
          },
          error => {
            console.error('Error fetching movies:', error);
          });
      },
      error => {
        console.error('Error fetching subscriptions:', error);
      });
  }
  
}

// import { formatDate } from '@angular/common';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
// import { DVGetDTO } from 'src/app/accommodation/accommodation-details/dvGetDTO';
// import { RecordGetDTO } from 'src/app/accommodation/accommodation-details/recordGetDTO';
// import { MovieGetDTO } from 'src/app/models/movieGetDTO.model';
// import { UserService } from 'src/app/user.service';
// import { environment } from 'src/env/env';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],
// })
// export class HomeComponent {
//   moviesList: MovieGetDTO[] = [];
//   selectedMovie: any; // Holds details of the selected movie

//   records: DVGetDTO[] = [];

//   userSubscriptions: any[] = [];
//   subscribedTopics: any[] = [];

//   rateRecords: RecordGetDTO[] = [];

//   movieHeuristicMap: Map<string, { naslov: string; score: number }> = new Map();
//   topMoviesMap: Map<string, { naslov: string; score: number }> = new Map();
//   fetchedMovies: MovieGetDTO[] = [];

//   constructor(
//     private userService: UserService,
//     private snackBar: MatSnackBar,
//     private fb: FormBuilder,
//     private router: Router,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.getRecordsByUsername();
//   }

//   getRecordsByUsername() {
//     const url = `${environment.cloudHost}getUserDVS?username=${localStorage.getItem('username')}`;

//     this.http.get<any>(url).subscribe(
//       (data) => {
//         this.records = data;
//         console.log('Records:', this.records);

//         this.http.get<any[]>(`${environment.cloudHost}getRecords`).subscribe(
//           (_records) => {
//             console.log('Svi zapisi:', _records);

//             _records.forEach((record) => {
//               // Provera uslova
//               if (record.username === localStorage.getItem('username')) {
//                 this.rateRecords.push(record);
//               }
//             });

//             console.log('Rate records : ', this.rateRecords);

//             this.calculateHeuristicScores();
//             this.considerUserSubscriptions(); // Pokreće se samo jednom u getRecordsByUsername

//             // Nakon što se considerUserSubscriptions završi, izvršava se ekstrakcija top filmova
//             this.extractTopMovies();
//           },
//           (error) => {
//             console.error('Error fetching records:', error);
//           }
//         );
//       },
//       (error) => {
//         console.error('Error fetching records:', error);
//       }
//     );
//   }

//   searchMoviesForm = this.fb.group({
//     title: [''],
//     description: [''],
//     genre: [''],
//     director: [''],
//     actors: [''],
//   });

//   openSnackBar(message: string) {
//     this.snackBar.open(message, 'OK', {
//       duration: 3000,
//     });
//   }

//   searchMovies() {
//     const title = this.searchMoviesForm.get('title')?.value;
//     const description = this.searchMoviesForm.get('description')?.value;
//     const genre = this.searchMoviesForm.get('genre')?.value;
//     const director = this.searchMoviesForm.get('director')?.value;
//     const actors = this.searchMoviesForm.get('actors')?.value;

//     let params = new HttpParams()
//       .set('naslov', title ?? '')
//       .set('opis', description ?? '')
//       .set('zanr', genre ?? '')
//       .set('reziser', director ?? '')
//       .set('glumci', actors ?? '');
//     console.log(params);

//     const url = `${environment.cloudHost}searchMovies`;

//     this.http.get(url, { params }).subscribe({
//       next: (data: any) => {
//         console.log('Rezultati pretrage:', data);

//         const uniqueTitles = new Set<string>();
//         const uniqueMoviesList: MovieGetDTO[] = [];

//         data.forEach((item: any) => {
//           if (!uniqueTitles.has(item.naslov)) {
//             uniqueTitles.add(item.naslov);
//             uniqueMoviesList.push({
//               id_filma: item.id_filma,
//               rezolucija: item.rezolucija,
//               zanr: item.zanr,
//               trajanje: item.trajanje,
//               naslov: item.naslov,
//               opis: item.opis,
//               reziser: item.reziser,
//               glumci: item.glumci,
//               s3_url: item.s3_url,
//             });
//           }
//         });

//         this.moviesList = uniqueMoviesList;
//         this.fetchedMovies = this.moviesList;
//         console.log('Converted Movies:', this.moviesList);
//       },
//       error: (error) => {
//         console.error('Greška pri dohvatanju podataka:', error);
//         // Prikazivanje snackbar poruke u slučaju greške
//         this.openSnackBar('Greška pri dohvatanju podataka');
//       },
//     });
//   }

//   onMovieClicked(movie: any) {
//     // Function to handle movie click event
//     this.selectedMovie = movie;
//     console.log('Clicked movie:', movie);
//     // You can perform any actions here based on the clicked movie
//   }

//   calculateHeuristicScores() {
//     this.movieHeuristicMap.clear();

//     this.records.forEach((record) => {
//       const { id_filma, naslov, timestamp, type } = record;
//       const score = this.calculateScore(timestamp, type);

//       if (this.movieHeuristicMap.has(id_filma)) {
//         const current = this.movieHeuristicMap.get(id_filma)!;
//         this.movieHeuristicMap.set(id_filma, {
//           naslov,
//           score: current.score + score,
//         });
//       } else {
//         this.movieHeuristicMap.set(id_filma, { naslov, score });
//       }
//     });

//     this.rateRecords.forEach((rateRecord) => {
//       const { id_filma, content } = rateRecord;
//       const scoreWeight = this.getScoreWeight(content); // Get weight based on rating
//       if (this.movieHeuristicMap.has(id_filma)) {
//         const current = this.movieHeuristicMap.get(id_filma)!;
//         this.movieHeuristicMap.set(id_filma, {
//           naslov: current.naslov,
//           score: current.score + scoreWeight,
//         });
//       } else {
//         // If movie not already in map (should not happen if properly fetched)
//         this.movieHeuristicMap.set(id_filma, { naslov: '', score: scoreWeight });
//       }
//     });

//     console.log('Movie Heuristic Map:', this.movieHeuristicMap);
//   }

//   calculateScore(timestamp: string, type: string): number {
//     const now = new Date();
//     const recordDate = new Date(timestamp);
//     const timeDiff = Math.abs(now.getTime() - recordDate.getTime());
//     const daysDiff = timeDiff / (1000 * 3600 * 24);

//     let baseScore = 0;

//     if (type === 'download') {
//       baseScore = 100;
//     } else if (type === 'view') {
//       baseScore = 50;
//     }

//     return baseScore / (1 + daysDiff);
//   }

//   extractTopMovies() {
//     // Convert map to an array and sort by score in descending order
//     const sortedEntries = Array.from(this.movieHeuristicMap.entries()).sort(
//       (a, b) => b[1].score - a[1].score
//     );

//     // Take top 5 movies and put them into topMoviesMap
//     this.topMoviesMap.clear();
//     sortedEntries.slice(0, 5).forEach(([id_filma, value]) => {
//       this.topMoviesMap.set(id_filma, value);
//     });

//     console.log('Top Movies Map:', this.topMoviesMap);
//   }

//   fetchTopMovies() {
//     this.topMoviesMap.forEach((value, id_filma) => {
//       this.userService.getMovieByIdMovies(id_filma, value.naslov).subscribe(
//         (response: any) => {
//           const movieData: MovieGetDTO = response.movie_data;
//           if (movieData) {
//             this.fetchedMovies.push(movieData);
//             console.log('Fetched movie:', movieData);
//           }
//         },
//         (error: any) => {
//           console.error('Error fetching movie details:', error);
//         }
//       );
//     });
//   }

//   getScoreWeight(ocena: number): number {
//     switch (ocena) {
//       case 3:
//         return 90;
//       case 2:
//         return 60;
//       case 1:
//       default:
//         return 30;
//     }
//   }

//   considerUserSubscriptions(): void {
//     this.http
//       .get<any>(`${environment.cloudHost}getTopics?email=${localStorage.getItem('username')}`)
//       .subscribe(
//         (response) => {
//           this.userSubscriptions = response;
//           console.log('User subscriptions : ', this.userSubscriptions);

//           this.subscribedTopics = this.userSubscriptions.map((subscription) => {
//             const parts = subscription.TopicArn.split(':');
//             return parts[5];
//           });

//           console.log('Topics : ', this.subscribedTopics);

//           this.http.get<any[]>(`${environment.cloudHost}movies`).subscribe(
//             (movies) => {
//               movies.forEach((movie) => {
//                 const { id_filma, zanr, reziser, glumci } = movie;

//                 // Check if any subscribed topic matches genre, director, or actors
//                 this.subscribedTopics.forEach((topic) => {
//                   if (
//                     zanr.toLowerCase().includes(topic.toLowerCase()) ||
//                     reziser.toLowerCase().includes(topic.toLowerCase()) ||
//                     glumci.toLowerCase().includes(topic.toLowerCase())
//                   ) {
//                     // Add score of 35 to the movie if topic matches
//                     if (this.movieHeuristicMap.has(id_filma)) {
//                       const current = this.movieHeuristicMap.get(id_filma)!;
//                       this.movieHeuristicMap.set(id_filma, {
//                         naslov: current.naslov,
//                         score: current.score + 35,
//                       });
//                     } else {
//                       this.movieHeuristicMap.set(id_filma, {
//                         naslov: movie.naslov,
//                         score: 35,
//                       });
//                     }
//                   }
//                 });
//               });

//               console.log('Movie Heuristic Map with Subscriptions:', this.movieHeuristicMap);

//               // Nakon što se završi considerUserSubscriptions, izvršava se ekstrakcija top filmova
//               this.extractTopMovies();
//             },
//             (error) => {
//               console.error('Error fetching movies:', error);
//             }
//           );
//         },
//         (error) => {
//           console.error('Error fetching subscriptions:', error);
//         }
//       );
//   }
// }
