import { Injectable } from '@angular/core';
import { User } from './models/user.model';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/env/env';
import {Observable} from "rxjs";
import { UserPostDTO } from './models/userPostDTO.model';
import { UserGetDTO } from './models/userGetDTO.model';
import { UserPutDTO } from './models/userPutDTO.model';
import { RoleEnum } from './models/userEnums.model';
import { MovieGetDTO } from './models/movieGetDTO.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersList: UserGetDTO[] = [];

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<UserGetDTO[]> {
    return this.httpClient.get<UserGetDTO[]>(environment.apiHost + 'users')
  }

  
  getAllMovies(): Observable<MovieGetDTO[]> {
    return this.httpClient.get<MovieGetDTO[]>(environment.cloudHost + 'movies')
  }
  activateAccount(token: string): Observable<string> {
    return this.httpClient.put<string>(environment.apiHost + 'users/activate/' + token,{});
  }

  create(user: UserPostDTO): Observable<UserPostDTO> {
    return this.httpClient.post<UserPostDTO>(environment.apiHost + 'users', user)
  }

  registerUser(user: UserPostDTO): Observable<UserPostDTO> {
    return this.httpClient.post<UserPostDTO>(environment.cloudHost+ 'registerUser', user)
  }
  update(user: UserPutDTO,username:string): Observable<User> {
    return this.httpClient.put<User>(environment.apiHost + 'users/' + username,user)
  }

  deleteUser(username:string) {
    return this.httpClient.delete(environment.apiHost + 'users/' + username)
  }

  getById(username: string): Observable<UserGetDTO> {
    return this.httpClient.get<UserGetDTO>(environment.apiHost + 'users/username/' + username)
  }
  getUserById(username:string):Observable<User>{
    return this.httpClient.get<User>(environment.apiHost+'users/user/username/'+username);
  }
  getByToken(token: string): Observable<User>{
    return this.httpClient.get<User>(environment.apiHost+'users/token/'+token)
  }

  findByRole(role: RoleEnum): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiHost + 'users/role/' + role);
  }

  addFavourite(username: string, id: number): Observable<User> {
    return this.httpClient.put<User>(environment.apiHost + 'users/addFavourite/' + username + '/' + id, {});
  }

  removeFavourite(username: string, id: number): Observable<User> {
    return this.httpClient.put<User>(environment.apiHost + 'users/removeFavourite/' + username + '/' + id, {});
  }

}