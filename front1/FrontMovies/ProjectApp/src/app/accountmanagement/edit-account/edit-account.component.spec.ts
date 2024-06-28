import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { EditAccountComponent } from './edit-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { RoleEnum, StatusEnum } from 'src/app/models/userEnums.model';
import { UserPutDTO } from 'src/app/models/userPutDTO.model';
import { User } from 'src/app/models/user.model';
import { UserGetDTO } from 'src/app/models/userGetDTO.model';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';


describe('EditAccountComponent', () => {
  let component: EditAccountComponent;
  let fixture: ComponentFixture<EditAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        EditAccountComponent,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        MatSlideToggleModule,
        HttpClientModule,
        BrowserAnimationsModule,
        CommonModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        UserService,
        JwtHelperService,
        MatSnackBar,
      ],
    });

    fixture = TestBed.createComponent(EditAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  })


  it('Should form fields controls be initially empty/disabled', () => {
    expect(component.editAccountDataForm.get('name')?.value).toEqual('');
    expect(component.editAccountDataForm.get('surname')?.value).toEqual('');
    expect(component.editAccountDataForm.get('username')?.value).toEqual('');
    expect(component.editAccountDataForm.get('password')?.value).toEqual('');
    expect(component.editAccountDataForm.get('confirmPassword')?.value).toEqual('');
    expect(component.editAccountDataForm.get('address')?.value).toEqual('');
    expect(component.editAccountDataForm.get('phoneNumber')?.value).toEqual('');
    expect(component.editAccountDataForm.get('role')?.value).toEqual('');
    expect(component.editAccountDataForm.get('requestNotification')?.disabled).toBeTruthy();
    expect(component.editAccountDataForm.get('cancellationNotification')?.disabled).toBeTruthy();
    expect(component.editAccountDataForm.get('ownerRatingNotification')?.disabled).toBeTruthy();
    expect(component.editAccountDataForm.get('accommodationRatingNotification')?.disabled).toBeTruthy();
    expect(component.editAccountDataForm.get('ownerRepliedNotification')?.disabled).toBeTruthy();

  });

  it('Should not make input into username input field', () => {
    let el = fixture.debugElement.query(By.css('[formControlName=\'username\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual('true');
  });


  it('Should make input into another form fields (except username) field', () => {

    let el = fixture.debugElement.query(By.css('[formControlName=\'name\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
    el = fixture.debugElement.query(By.css('[formControlName=\'surname\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
    el = fixture.debugElement.query(By.css('[formControlName=\'phoneNumber\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
    el = fixture.debugElement.query(By.css('[formControlName=\'address\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
    el = fixture.debugElement.query(By.css('[formControlName=\'password\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
    el = fixture.debugElement.query(By.css('[formControlName=\'confirmPassword\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);

  });

  it('Should call saveChanges when Save changes button is clicked with valid form data', fakeAsync(() => {
 
    component.editAccountDataForm.patchValue({
      name: 'ValidName',
      surname: 'ValidSurname',
      phoneNumber: '1234567890', 
      address: 'ValidAddress',
      username: 'valid@email.com',
      password: 'ValidPassword',
      confirmPassword: 'ValidPassword',
      role:'ADMIN'
    });
  
    fixture.detectChanges();
  
    expect(component.editAccountDataForm.valid).toBe(true);
  
    spyOn(component, 'saveChanges');
  
    const saveButton = fixture.debugElement.nativeElement.querySelector('#saveButton');
    saveButton.click();

    tick();
    fixture.detectChanges();

    expect(component.saveChanges).toHaveBeenCalled();
  }));


  it('Should NOT call saveChanges when Save changes button is clicked with valid form data', fakeAsync(() => {
 
    component.editAccountDataForm.patchValue({
      name: 'ValidName',
      surname: 'ValidSurname',
      phoneNumber: '12345678', 
      address: 'ValidAddress',
      username: 'valid@email.com',
      password: 'ValidPassword',
      confirmPassword: 'ValidPassword',
      role:'ADMIN'
    });
  
    fixture.detectChanges();
  
    expect(component.editAccountDataForm.valid).toBe(false);
  
    spyOn(component, 'saveChanges');
  
    const saveButton = fixture.debugElement.nativeElement.querySelector('#saveButton');
    saveButton.click();

    tick();
    fixture.detectChanges();

    expect(component.saveChanges).not.toHaveBeenCalled();
  }));

  it('Should call delete when delete button is clicked', fakeAsync(() => {
 
    component.editAccountDataForm.patchValue({
      name: 'ValidName',
      surname: 'ValidSurname',
      phoneNumber: '1234567890', 
      address: 'ValidAddress',
      username: 'valid@email.com',
      password: 'ValidPassword',
      confirmPassword: 'ValidPassword',
      role:'ADMIN'
    });//NOT PERFECT BUT ALWAYS BY MYSELF- QUOTE OF THE YEAR
  
    fixture.detectChanges();
  
    spyOn(component, 'delete');
  
    const deleteButton = fixture.debugElement.nativeElement.querySelector('#deleteButton');
    deleteButton.click();

    tick();
    fixture.detectChanges();

    expect(component.delete).toHaveBeenCalled();
  }));


  it('Should set form values based on user data', fakeAsync(() => {
    const mockUser: UserGetDTO = {
      firstName: "FirstNameTest",
      lastName: "LastNameTest",
      username: "username@test.com",
      role: RoleEnum.GUEST,
      address: "AddressTest",
      phoneNumber: "1234567890",
      status: StatusEnum.ACTIVE,
      reservationRequestNotification:false,
      reservationCancellationNotification:false,
      ownerRatingNotification:false,
      accommodationRatingNotification:false,
      ownerRepliedToRequestNotification:true,
      deleted:false,
      token:"tokenTest",
      jwt:"jwtTest",
      favouriteAccommodations:"acc1,acc2"
    };

    const userServiceSpy = jasmine.createSpyObj('UserService', ['getById']);
    userServiceSpy.getById.and.returnValue({ subscribe: (callback: (user: UserGetDTO) => void) => callback(mockUser) });

    component['userService'] = userServiceSpy;

    component.ngOnInit();
    tick(); 

    fixture.detectChanges(); 

    component.editAccountDataForm.patchValue({
      name: mockUser.firstName,
      surname: mockUser.lastName,
      username: mockUser.username,
      phoneNumber: mockUser.phoneNumber,
      address: mockUser.address,
      status:mockUser.status, 
    });

    component.setNotificationControls(mockUser.role);

    expect(component.editAccountDataForm.get('name')?.value).toEqual('FirstNameTest');
    expect(component.editAccountDataForm.get('surname')?.value).toEqual('LastNameTest');
    expect(component.editAccountDataForm.get('username')?.value).toEqual('username@test.com');
    expect(component.editAccountDataForm.get('password')?.value).toEqual('');
    expect(component.editAccountDataForm.get('confirmPassword')?.value).toEqual('');
    expect(component.editAccountDataForm.get('address')?.value).toEqual('AddressTest');
    expect(component.editAccountDataForm.get('phoneNumber')?.value).toEqual('1234567890');

    const usernameInput = fixture.debugElement.query(By.css('input[formControlName="username"]'));
    expect(usernameInput.nativeElement.readOnly).toBeTruthy;

    expect(component.editAccountDataForm.get('requestNotification')?.enabled).toBe(
      mockUser.role === RoleEnum.OWNER
    );
    expect(component.editAccountDataForm.get('cancellationNotification')?.enabled).toBe(
      mockUser.role === RoleEnum.OWNER
    );
    expect(component.editAccountDataForm.get('ownerRatingNotification')?.enabled).toBe(
      mockUser.role === RoleEnum.OWNER
    );
    expect(component.editAccountDataForm.get('accommodationRatingNotification')?.enabled).toBe(
      mockUser.role === RoleEnum.OWNER
    );
    expect(component.editAccountDataForm.get('ownerRepliedNotification')?.enabled).toBe(
      mockUser.role === RoleEnum.GUEST
    );

  }));

  it('Toggle button tests by roles', fakeAsync(() => {

    const mockUser: UserGetDTO = {
      firstName: "FirstNameTest",
      lastName: "LastNameTest",
      username: "username@test.com",
      role: RoleEnum.GUEST,
      address: "AddressTest",
      phoneNumber: "1234567890",
      status: StatusEnum.ACTIVE,
      reservationRequestNotification: false,
      reservationCancellationNotification: false,
      ownerRatingNotification: false,
      accommodationRatingNotification: false,
      ownerRepliedToRequestNotification: true,
      deleted: false,
      token: "tokenTest",
      jwt: "jwtTest",
      favouriteAccommodations: "acc1,acc2"
    };

    const userServiceSpy = jasmine.createSpyObj('UserService', ['getById']);
    userServiceSpy.getById.and.returnValue({ subscribe: (callback: (user: UserGetDTO) => void) => callback(mockUser) });

    component['userService'] = userServiceSpy;

    component.ngOnInit();
    tick(); 

    fixture.detectChanges(); 

    component.setNotificationControls(mockUser.role);

    if (mockUser.role === RoleEnum.OWNER) {

      component.onSlideToggleChangeRequestNotification({ checked: true } as MatSlideToggleChange);
      component.onSlideToggleChangeCancellationNotification({ checked: true } as MatSlideToggleChange);
      component.onSlideToggleChangeOwnerRatingNotification({ checked: true } as MatSlideToggleChange);
      component.onSlideToggleChangeAccommodationRatingNotification({ checked: true } as MatSlideToggleChange);
     
      expect(component.reservationRequestNotification).toBeTrue();
      expect(component.reservationCancellationNotification).toBeTrue();
      expect(component.ownerRatingNotification).toBeTrue();
      expect(component.accommodationRatingNotification).toBeTrue();

    } else if (mockUser.role === RoleEnum.GUEST) {
      component.onSlideToggleChangeOwnerRepliedRequestNotification({ checked: true } as MatSlideToggleChange);
      expect(component.ownerRepliedToRequestNotification).toBeTrue();
    }

  }));

  it('Should set form validity to false if invalid phone data is provided - incorrect digits number', () => {
    component.editAccountDataForm.setValue({
      name: 'John',
      surname: 'Doe',
      phoneNumber: '123', // ne postujemo regex
      address: 'Test Address',
      username: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      status: 'active',
      role: 'GUEST',
      requestNotification: true,
      cancellationNotification: false,
      accommodationRatingNotification: false,
      ownerRatingNotification: false,
      ownerRepliedNotification: true,
    });

    expect(component.isFormValid).toBeFalse();
  });

  
  it('Password mismatch error', fakeAsync(() => {
    component.ngOnInit();
    tick();
  
    component.editAccountDataForm.setValue({
      name: 'John',
      surname: 'Doe',
      phoneNumber: '1234567890', 
      address: 'Test Address',
      username: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password456', // missmatching passwords
      status: 'active',
      role: 'GUEST',
      requestNotification: false,
      cancellationNotification: false,
      accommodationRatingNotification: false,
      ownerRatingNotification: false,
      ownerRepliedNotification: true,
    });

    expect(component.isFormValid).toBeFalse();
   
  }));


  it('Empty required field name', fakeAsync(() => {
    component.ngOnInit();
    tick();
  
    component.editAccountDataForm.setValue({
      name: '',
      surname: 'Doe',
      phoneNumber: '1234567890', 
      address: 'Test Address',
      username: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123', // missmatching passwords
      status: 'active',
      role: 'GUEST',
      requestNotification: false,
      cancellationNotification: false,
      accommodationRatingNotification: false,
      ownerRatingNotification: false,
      ownerRepliedNotification: true,
    });

    expect(component.isFormValid).toBeFalse();
   
  }));

  it('Empty required field surname', fakeAsync(() => {
    component.ngOnInit();
    tick();
  
    component.editAccountDataForm.setValue({
      name: 'Joe',
      surname: '',
      phoneNumber: '1234567890', 
      address: 'Test Address',
      username: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123', // missmatching passwords
      status: 'active',
      role: 'GUEST',
      requestNotification: false,
      cancellationNotification: false,
      accommodationRatingNotification: false,
      ownerRatingNotification: false,
      ownerRepliedNotification: true,
    });

    expect(component.isFormValid).toBeFalse();
   
  }));

  it('Empty required field phone number', fakeAsync(() => {
    component.ngOnInit();
    tick();
  
    component.editAccountDataForm.setValue({
      name: 'Joe',
      surname: 'Doe',
      phoneNumber: '', 
      address: 'Test Address',
      username: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123', // missmatching passwords
      status: 'active',
      role: 'GUEST',
      requestNotification: false,
      cancellationNotification: false,
      accommodationRatingNotification: false,
      ownerRatingNotification: false,
      ownerRepliedNotification: true,
    });

    expect(component.isFormValid).toBeFalse();
   
  }));

  it('Empty required field phone number', fakeAsync(() => {
    component.ngOnInit();
    tick();
  
    component.editAccountDataForm.setValue({
      name: 'Joe',
      surname: 'Doe',
      phoneNumber: '1234567890', 
      address: '',
      username: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      status: 'active',
      role: 'GUEST',
      requestNotification: false,
      cancellationNotification: false,
      accommodationRatingNotification: false,
      ownerRatingNotification: false,
      ownerRepliedNotification: true,
    });

    expect(component.isFormValid).toBeFalse();
   
  }));

  it('Should show Snackbar after successful user update', fakeAsync(() => {
    const mockUser: UserGetDTO = {
      firstName: "FirstNameTest",
      lastName: "LastNameTest",
      username: "username@test.com",
      role: RoleEnum.GUEST,
      address: "AddressTest",
      phoneNumber: "1234567890",
      status: StatusEnum.ACTIVE,
      reservationRequestNotification: false,
      reservationCancellationNotification: false,
      ownerRatingNotification: false,
      accommodationRatingNotification: false,
      ownerRepliedToRequestNotification: true,
      deleted: false,
      token: "tokenTest",
      jwt: "jwtTest",
      favouriteAccommodations: "acc1,acc2"
    };
  
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getById', 'update']);
    userServiceSpy.getById.and.returnValue({ subscribe: (callback: (user: UserGetDTO) => void) => callback(mockUser) });
    userServiceSpy.update.and.returnValue(of({mockUser})); 
  
    component['userService'] = userServiceSpy;
  
    component.ngOnInit();
    tick();
  
    component.editAccountDataForm.setValue({
      name: "FirstNameTest",
      surname: "LastNameTest",
      username: "username@test.com",
      role: 'GUEST',
      address: "AddressTest",
      phoneNumber: "1234567890",
      status: StatusEnum.ACTIVE,
      requestNotification: false,
      cancellationNotification: false,
      ownerRatingNotification: false,
      accommodationRatingNotification: false,
      ownerRepliedNotification: true,
      password:"pass",
      confirmPassword:"pass"
    });
  
    spyOn(component, 'openSnackBar');

    expect(component.isFormValid).toBeTruthy();
  
    const saveButton = fixture.debugElement.nativeElement.querySelector('#saveButton');
    saveButton.click();
  
    tick();
    
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.openSnackBar).toHaveBeenCalledWith("User sucessfully updated!");
  
      const snackBarElement = document.querySelector('.mat-simple-snackbar') as HTMLElement;
      expect(snackBarElement.textContent).toContain('User sucessfully updated!');
    });
  }));
  
});

