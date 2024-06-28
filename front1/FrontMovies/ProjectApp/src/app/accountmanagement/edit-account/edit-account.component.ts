import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { LayoutModule } from 'src/app/layout/layout.module';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors} from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RoleEnum, StatusEnum } from 'src/app/models/userEnums.model';
import { UserPutDTO } from 'src/app/models/userPutDTO.model';
import { User } from 'src/app/models/user.model';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { UserGetDTO } from 'src/app/models/userGetDTO.model';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule,MatInputModule, MatIconModule,MatButtonModule,
    MatSlideToggleModule,LayoutModule,FormsModule, ReactiveFormsModule,CommonModule],
})
export class EditAccountComponent implements OnInit {
  user:UserGetDTO;
  color: ThemePalette = 'primary';
  disabled=true;
  checked=false;
  reservationRequestNotification:boolean=false;
  reservationCancellationNotification:boolean=false;
  ownerRatingNotification:boolean=false;
  accommodationRatingNotification:boolean=false;
  ownerRepliedToRequestNotification:boolean=false;
  jwt: string = "";

  editAccountDataForm=new FormGroup({
    name: new FormControl('', Validators.required),
    surname:new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    address: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', Validators.required),
    confirmPassword:new FormControl('', Validators.required),
    status:new FormControl(),
    role:new FormControl('', Validators.required),
    requestNotification:new FormControl(),
    cancellationNotification:new FormControl(),
    accommodationRatingNotification:new FormControl(),
    ownerRatingNotification:new FormControl(),
    ownerRepliedNotification:new FormControl(),
  },
  { validators: this.passwordMatchValidator })
  hide=true;

  constructor(private route:ActivatedRoute,
    private userService:UserService,private router: Router, private snackBar:MatSnackBar) {
      this.editAccountDataForm.get('requestNotification')?.disable();
      this.editAccountDataForm.get('cancellationNotification')?.disable();
      this.editAccountDataForm.get('ownerRatingNotification')?.disable();
      this.editAccountDataForm.get('accommodationRatingNotification')?.disable();
      this.editAccountDataForm.get('ownerRepliedNotification')?.disable();
     }
  
  ngOnInit() {
   
    const accessToken: any = localStorage.getItem('user');
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(accessToken);

    if (decodedToken) {
      this.userService.getById(decodedToken.sub).subscribe(
        (user: UserGetDTO) => {
          if (user) {
            console.log('User:', user);

            this.editAccountDataForm.get('name')?.setValue(user.firstName);
            this.editAccountDataForm.get('surname')?.setValue(user.lastName);
            this.editAccountDataForm.get('phoneNumber')?.setValue(user.phoneNumber);
            this.editAccountDataForm.get('address')?.setValue(user.address);
            this.editAccountDataForm.get('username')?.setValue(user.username);
            this.editAccountDataForm.get('password')?.setValue('');
            this.editAccountDataForm.get('confirmPassword')?.setValue('');
            this.editAccountDataForm.get('status')?.setValue(user.status);
            this.editAccountDataForm.get('role')?.setValue(user.role);

            this.setNotificationControls(user.role);

          } else {
            console.error('User not found');
          }
        },
        error => {
          console.error('Error fetching user:', error);
        }
      );
    } else {
      console.error('Error decoding JWT token');
    }
      
    }

  setNotificationControls(role: RoleEnum): void {
    if (role === RoleEnum.ADMIN) {
      this.editAccountDataForm.get('requestNotification')?.disable();
      this.editAccountDataForm.get('cancellationNotification')?.disable();
      this.editAccountDataForm.get('ownerRatingNotification')?.disable();
      this.editAccountDataForm.get('accommodationRatingNotification')?.disable();
      this.editAccountDataForm.get('ownerRepliedNotification')?.disable();
    } else if (role === RoleEnum.GUEST) {
      this.editAccountDataForm.get('requestNotification')?.disable();
      this.editAccountDataForm.get('cancellationNotification')?.disable();
      this.editAccountDataForm.get('ownerRatingNotification')?.disable();
      this.editAccountDataForm.get('accommodationRatingNotification')?.disable();
      this.editAccountDataForm.get('ownerRepliedNotification')?.enable();
    } else if (role === RoleEnum.OWNER) {
      this.editAccountDataForm.get('requestNotification')?.enable();
      this.editAccountDataForm.get('cancellationNotification')?.enable();
      this.editAccountDataForm.get('ownerRatingNotification')?.enable();
      this.editAccountDataForm.get('accommodationRatingNotification')?.enable();
      this.editAccountDataForm.get('ownerRepliedNotification')?.disable();
    }
  }

  saveChanges(){
  
    const userRoleValue: string | undefined= this.editAccountDataForm.get('role')?.value ?? undefined;
    const userStatusValue: string | undefined= this.editAccountDataForm.get('status')?.value;
    const userGet =this.userService.getById(this.editAccountDataForm.value.username?? '');

    if(userRoleValue!==undefined && userStatusValue!==undefined){

      const userRoleEnum: RoleEnum = RoleEnum[userRoleValue as keyof typeof RoleEnum];
      const userStatusEnum: StatusEnum = StatusEnum[userStatusValue as keyof typeof StatusEnum];
      
      const changedUser: UserPutDTO = {
        firstName: this.editAccountDataForm.value.name ?? '',
        lastName:this.editAccountDataForm.value.surname ?? '',
        phoneNumber: this.editAccountDataForm.value.phoneNumber ?? '',
        address: this.editAccountDataForm.value.address ?? '',
        password:this.editAccountDataForm.value.password ?? '',
        passwordConfirmation:this.editAccountDataForm.value.confirmPassword ?? '',
        status:userStatusEnum,
        reservationRequestNotification:this.reservationRequestNotification,
        reservationCancellationNotification:this.reservationCancellationNotification,
        ownerRatingNotification:this.ownerRatingNotification,
        accommodationRatingNotification:this.accommodationRatingNotification,
        ownerRepliedToRequestNotification:this.ownerRepliedToRequestNotification,
        deleted:false,
        token:'',
        favouriteAccommodations:this.user?.favouriteAccommodations
      }

      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(accessToken);

      this.userService.update(changedUser,decodedToken.sub).subscribe(
        {
          next: (data: User) => {
            this.openSnackBar("User sucessfully updated!");
            this.router.navigate(['home'])
          },
        } 
      );
    } 
    }

    openSnackBar(message: string) {
      this.snackBar.open(message, 'OK', {
        duration: 3000,
      });
    }
    
    delete(){
      const username=this.editAccountDataForm.value.username ?? ''
      this.userService.deleteUser(username).subscribe(
        
          (response:any) => {
            this.router.navigate(['home'])
            this.openSnackBar("USER SUCCESSFULLY DELETED");
          },
          
        (error: { error: { error: string; }; }) => {
          console.error('Error deleting user:', error);
          if (error.error.error) {
            this.openSnackBar(error.error.error);
          } else {
            this.openSnackBar('An error occurred while creating the reservation. Check the number of guests and dates of your reservations');
          } 
        })
      }
    

    onSlideToggleChangeRequestNotification(event: MatSlideToggleChange) {
      const reservationRequestNotificationChecked = event.checked;
      this.reservationRequestNotification=reservationRequestNotificationChecked.valueOf();

    }
    onSlideToggleChangeCancellationNotification(event: MatSlideToggleChange){
      const reservationRequestNotificationChecked = event.checked;
      this.reservationRequestNotification=reservationRequestNotificationChecked.valueOf();
    }
    onSlideToggleChangeOwnerRatingNotification(event:MatSlideToggleChange){
      const ownerRatingNotification = event.checked;
      this.ownerRatingNotification=ownerRatingNotification.valueOf();
    }
    onSlideToggleChangeAccommodationRatingNotification(event:MatSlideToggleChange){
      const accommodationRatingNotification = event.checked;
      this.accommodationRatingNotification=accommodationRatingNotification.valueOf();
    }
    onSlideToggleChangeOwnerRepliedRequestNotification(event:MatSlideToggleChange){
      const ownerRepliedToRequestNotification = event.checked;
      this.ownerRepliedToRequestNotification=ownerRepliedToRequestNotification.valueOf();
    }

    onRoleSelectionChange(event:MatSelectChange){
      const selectedRole = event.source.value;
      if (selectedRole === 'ADMIN') {
        this.editAccountDataForm.get('requestNotification')?.disable();
        this.editAccountDataForm.get('cancellationNotification')?.disable();
        this.editAccountDataForm.get('ownerRatingNotification')?.disable();
        this.editAccountDataForm.get('accommodationRatingNotification')?.disable();
        this.editAccountDataForm.get('ownerRepliedNotification')?.disable();
      } else if (selectedRole === 'GUEST') {
        this.editAccountDataForm.get('requestNotification')?.disable();
        this.editAccountDataForm.get('cancellationNotification')?.disable();
        this.editAccountDataForm.get('ownerRatingNotification')?.disable();
        this.editAccountDataForm.get('accommodationRatingNotification')?.disable();
        this.editAccountDataForm.get('ownerRepliedNotification')?.enable();
      } else if (selectedRole === 'OWNER') {
        this.editAccountDataForm.get('requestNotification')?.enable();
        this.editAccountDataForm.get('cancellationNotification')?.enable();
        this.editAccountDataForm.get('ownerRatingNotification')?.enable();
        this.editAccountDataForm.get('accommodationRatingNotification')?.enable();
        this.editAccountDataForm.get('ownerRepliedNotification')?.disable();
      }
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
  
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
  
    get isFormValid(): boolean {
      return this.editAccountDataForm.valid;
  }
}
