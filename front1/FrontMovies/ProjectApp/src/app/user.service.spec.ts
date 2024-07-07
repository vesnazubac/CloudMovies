// import { TestBed, inject } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { UserService } from './user.service';
// import { RoleEnum, StatusEnum } from './models/userEnums.model';
// import { UserPutDTO } from './models/userPutDTO.model';
// import { environment } from 'src/env/env';
// import { UserServiceMock } from './mocks/user.mock.service';
// import { User } from './models/user.model';
// import { UserPostDTO } from './models/userPostDTO.model';

// describe('UserService', () => {
//   let userService: UserService;
//   let httpTestingController: HttpTestingController;
//   let userServiceMock: UserServiceMock; 

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         UserService,
//         UserServiceMock
//       ]
//     });

//     userService = TestBed.inject(UserService);
//     httpTestingController = TestBed.inject(HttpTestingController);
//     userServiceMock = TestBed.inject(UserServiceMock);  
//   });

//   afterEach(() => {
//     httpTestingController.verify();
//   });

//   it('should be created', () => {
//     expect(userService).toBeTruthy();
//   });

//   it('should update user', () => {
//     const username = 'testuser';
//     const userPutDTO: UserPutDTO = {
//         firstName: 'UpdatedFirstName',
//         lastName: 'UpdatedLastName',
//         password: 'UpdatedPassword',
//         passwordConfirmation: 'UpdatedPassword',
//         address: 'UpdatedAddress',
//         phoneNumber: 'UpdatedPhoneNumber',
//         status: StatusEnum.ACTIVE, 
//         reservationRequestNotification: true,
//         reservationCancellationNotification: false,
//         ownerRatingNotification: true,
//         accommodationRatingNotification: false,
//         ownerRepliedToRequestNotification: true,
//         deleted: false,
//         token: 'UpdatedToken',
//         favouriteAccommodations: 'acc1,acc2',
//       };
      
//       const mockUpdatedUser: User = {
//         firstName: 'UpdatedFirstName',
//         lastName: 'UpdatedLastName',
//         username: 'UpdatedUsername',
//         password: 'UpdatedPassword',
//         role: RoleEnum.ADMIN,
//         address: 'UpdatedAddress',
//         phoneNumber: 'UpdatedPhoneNumber',
//         status: StatusEnum.ACTIVE,
//         reservationRequestNotification: true,
//         reservationCancellationNotification: false,
//         ownerRatingNotification: true,
//         accommodationRatingNotification: false,
//         ownerRepliedToRequestNotification: true,
//         deleted: false,
//         token: 'UpdatedToken',
//         jwt: 'UpdatedJwt',
//         favouriteAccommodations: 'acc1,acc2',
//       };
      

//     spyOn(userServiceMock, 'getUsers').and.returnValue([mockUpdatedUser]);

//     userService.update(userPutDTO, username).subscribe(updatedUser => {
//       expect(updatedUser).toEqual(mockUpdatedUser);
//     });

//     const req = httpTestingController.expectOne(`${environment.apiHost}users/${username}`);
//     expect(req.request.method).toEqual('PUT');
//     req.flush(mockUpdatedUser);
//   });

//   it('should get user by username', () => {
//     const username = 'testuser';
//     const mockUser = userServiceMock.getUsers()[0];

//     userService.getById(username).subscribe(user => {
//       expect(user).toEqual(mockUser);
//     });

//     const req = httpTestingController.expectOne(`${environment.apiHost}users/username/${username}`);
//     expect(req.request.method).toEqual('GET');
//     req.flush(mockUser);
//   });


//   it('should create user', () => {
//     const newUserPost: UserPostDTO = {
//       firstName: 'FirstName',
//       lastName: 'LastName',
//       username: 'Username',
//       password: 'Password',
//       role: RoleEnum.OWNER,
//       address: 'Address',
//       phoneNumber: 'PhoneNumber',
//       reservationRequestNotification: true,
//       reservationCancellationNotification: false,
//       ownerRatingNotification: true,
//       accommodationRatingNotification: false,
//       ownerRepliedToRequestNotification: true,
//       deleted: false,
//       passwordConfirmation: 'Password'
//     };
  
//     const createdUserPost: UserPostDTO = {
//       ...newUserPost,
//     };
  
//     userService.create(newUserPost).subscribe(createdUser => {
//       expect(createdUser).toEqual(createdUserPost);
//     });
  
//     const req = httpTestingController.expectOne(`${environment.apiHost}users`);
//     expect(req.request.method).toEqual('POST');
//     req.flush(createdUserPost);
//   });

//   it('should delete user', () => {
//     const username = 'testuser';
  
//     userService.deleteUser(username).subscribe(() => {
      
//     });
  
//     const req = httpTestingController.expectOne(`${environment.apiHost}users/${username}`);
//     expect(req.request.method).toEqual('DELETE');
//     req.flush(null);
//   });

  
// });


