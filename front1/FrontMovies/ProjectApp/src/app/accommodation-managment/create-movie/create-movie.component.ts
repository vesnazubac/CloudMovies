import { Component,QueryList,ViewChild, ViewChildren } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import { LayoutModule } from 'src/app/layout/layout.module';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormArray} from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'src/env/env';
import { HttpHeaders, HttpClient } from '@angular/common/http';


interface MovieData {
  naslov: string;
  glumci: string;
  opis: string;
  reziser: string;
  zanr: string;
  video_data: string;
  file_type: string;
  file_name: string;
  file_size: number;
  file_modified: string;
}

interface SeriesData extends MovieData {
  episode: number;
}

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.css'],
  standalone: true,
  imports: [CommonModule,MatTableModule,MatPaginatorModule,MatFormFieldModule, MatInputModule, MatIconModule,MatButtonModule,MatChipsModule,MatRadioModule,LayoutModule,ReactiveFormsModule,MatDatepickerModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,MatButtonModule,MatSnackBarModule],
})
export class CreateMovieComponent {
  @ViewChildren('episodeFileInput') episodeFileInputs!: QueryList<any>;

  images:string[]=[]

  accessToken: any = localStorage.getItem('user');
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(this.accessToken);
  ownerId:string=""
  selectedFile:string

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private snackBar:MatSnackBar, private http:HttpClient) {}

  ngOnInit() {
      this.ownerId=this.decodedToken.sub;
  }

  createMovieForm=new FormGroup({
    name: new FormControl('',Validators.required),
    actors:new FormControl('',Validators.required),
    description:new FormControl('',Validators.required),
    director:new FormControl('',Validators.required),
    genre:new FormControl('',Validators.required),
    episodes: new FormControl('', [Validators.min(2)]),
    episodeFiles: new FormArray([])
  })

  get episodeFiles() {
    return this.createMovieForm.get('episodeFiles') as FormArray;
  }

  // File upload function
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

  async onFileSelected(event: any, index: number = -1): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      const base64String = await this.uploadFile(file);
      if (index >= 0) {
        this.episodeFiles.at(index).setValue(base64String);
      } else {
        this.selectedFile = base64String;
      }
    }
  }
  

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }

  formValidation():boolean{
    if (this.createMovieForm.get('name')?.value === '') {
      console.error('Movie name is required.');
      this.openSnackBar('Movie name is required.');
      return false;
    }

    if (this.createMovieForm.get('genre')?.value === '') {
      console.error('Genre is required.');
      this.openSnackBar('Genre is required.');
      return false;
    }

    if (this.createMovieForm.get('director')?.value === '') {
      console.error('Director is required.');
      this.openSnackBar('Director is required.');
      return false;
    }

    if (this.createMovieForm.get('actors')?.value === '') {
      console.error('Actors are required.');
      this.openSnackBar('Actors are required.');
      return false;
    }

    if (this.createMovieForm.get('description')?.value === '') {
      console.error('Description is required.');
      this.openSnackBar('Description is required.');
      return false;
    }
    return true;
  }

  confirmEpisodes() {
    const episodeCount = parseInt(this.createMovieForm.get('episodes')?.value ?? '0',10);
    if (isNaN(episodeCount) || episodeCount < 2) {
      this.openSnackBar('Please enter a valid number of episodes (greater than 1).');
      return;
    }
    this.episodeFiles.clear();
    for (let i = 0; i < episodeCount; i++) {
      this.episodeFiles.push(new FormControl(''));
    }
  }


  async register() {
    if (!this.formValidation()) {
      return;
    }

    const fileInput = (document.querySelector('input[type="file"]') as HTMLInputElement);
    var file = null;
    if(fileInput.files){
      file = fileInput.files[0];
    }
    

    if (!file) {
      this.openSnackBar('File is required.');
      return;
    }

    const video_data = await this.uploadFile(file);
    
    const movieData: MovieData = {
      naslov: this.createMovieForm.get('name')?.value ?? '',
      glumci: this.createMovieForm.get('actors')?.value ?? '',
      opis: this.createMovieForm.get('description')?.value ?? '',
      reziser: this.createMovieForm.get('director')?.value ?? '',
      zanr: this.createMovieForm.get('genre')?.value ?? '',
      video_data: video_data,
      file_type: file.type.split('/')[1],
      file_name: file.name,
      file_size: file.size,
      file_modified: new Date(file.lastModified).toISOString(),
    };

    console.log(movieData);

    this.http
      .post(environment.cloudHost + 'postMovies', JSON.stringify(movieData), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .subscribe(
        (response) => {
          console.log(response);
          this.openSnackBar('Movie posted successfully.');
        },
        (error) => {
          console.error(error);
          this.openSnackBar('An error occurred while posting the movie.');
        }
      );
  }

  async registerSeries() {
    if (!this.formValidation()) {
      return;
    }
    const episodeFileInputsArray = this.episodeFileInputs.toArray();

    const episodeCount = parseInt(this.createMovieForm.get('episodes')?.value ?? '0', 10);
    if (isNaN(episodeCount) || episodeCount < 2) {
      this.openSnackBar('Please enter a valid number of episodes (greater than 1).');
      return;
    }
  
    for (let i = 0; i < episodeCount; i++) {
      const fileInput = episodeFileInputsArray[i].nativeElement;
      let file = null;
      if (fileInput.files) {
        file = fileInput.files[0];
      }

      if (!file) {
        this.openSnackBar(`File for episode ${i + 1} is required.`);
        return;
      }
  
      const video_data = await this.uploadFile(file);
      
      const seriesData = {
        naslov: this.createMovieForm.get('name')?.value ?? '',
        glumci: this.createMovieForm.get('actors')?.value ?? '',
        opis: this.createMovieForm.get('description')?.value ?? '',
        reziser: this.createMovieForm.get('director')?.value ?? '',
        zanr: this.createMovieForm.get('genre')?.value ?? '',
        video_data: video_data,
        file_type: file.type.split('/')[1],
        file_name: file.name,
        file_size: file.size,
        file_modified: new Date(file.lastModified).toISOString(),
        episode: i + 1
      };
  
      // Log the details of the file
      console.log(`Episode ${i + 1}:`);
      console.log(`File Type: ${seriesData.file_type}`);
      console.log(`File Name: ${seriesData.file_name}`);
      console.log(`File Size: ${seriesData.file_size}`);
      console.log(`File Modified: ${seriesData.file_modified}`);
      console.log('Pozivam servis')
      this.http
        .post(environment.cloudHost + 'postMovies', JSON.stringify(seriesData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        })
        .subscribe(
          (response) => {
            console.log(response);
            if (i === episodeCount - 1) {
              this.openSnackBar('Series posted successfully.');
            }
          },
          (error) => {
            console.error(error);
            this.openSnackBar(`An error occurred while posting episode ${i + 1}.`);
          }
        );
    }
  }
  }


