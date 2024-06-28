// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { RegisterFormComponent } from './register-form.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatError, MatFormFieldModule } from '@angular/material/form-field';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { ActivatedRoute, Router } from '@angular/router';
// import { UserService } from 'src/app/user.service';
// import { RoleEnum, StatusEnum } from 'src/app/models/userEnums.model';
// import { UserPutDTO } from 'src/app/models/userPutDTO.model';
// import { User } from 'src/app/models/user.model';
// import { UserGetDTO } from 'src/app/models/userGetDTO.model';
// import { CommonModule } from '@angular/common';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { tap } from 'rxjs/operators';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
// import { MatSelectHarness } from '@angular/material/select/testing';
// import { MatOptionHarness } from '@angular/material/core/testing';
// import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';


// import { By } from '@angular/platform-browser';
// import { ChangeDetectorRef, Component } from '@angular/core';
// import {FormControl, Validators,FormGroup, FormBuilder, AbstractControl, ValidationErrors} from '@angular/forms';
// import {MatSelectChange} from '@angular/material/select';
// import { UserPostDTO } from 'src/app/models/userPostDTO.model';
// import {MatSlideToggleChange} from '@angular/material/slide-toggle';
// import { MatOption, MatOptionSelectionChange, ThemePalette } from '@angular/material/core';
// import { NgZone } from '@angular/core';
// import { HarnessLoader } from '@angular/cdk/testing';



// describe('RegisterFormComponent', () => {
//   let component: RegisterFormComponent;
//   let fixture: ComponentFixture<RegisterFormComponent>;
  

//   let loader:HarnessLoader;
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [],
//       imports: [
//         RegisterFormComponent,
//         FormsModule,
//         ReactiveFormsModule,
//         MatIconModule,
//         MatInputModule,
//         MatFormFieldModule,
//         MatButtonModule,
//         MatSelectModule,
//         MatSlideToggleModule,
//         HttpClientModule,
//         BrowserAnimationsModule,
//         CommonModule,
//         MatSelectModule
//       ],
//       providers: [
//         { provide: ActivatedRoute, useValue: {} },
//         { provide: Router, useValue: {} },
//         UserService,
//         JwtHelperService,
//         MatSnackBar,
//       ],
//     });

//     fixture = TestBed.createComponent(RegisterFormComponent);
//     component = fixture.componentInstance;
//     loader = TestbedHarnessEnvironment.loader(fixture);
//     fixture.detectChanges();
//   });

//   it('Should create', () => {
//     expect(component).toBeTruthy();
//   })


//   it('Should form fields controls be initially empty/disabled', () => {
//     expect(component.createRegisterForm.get('name')?.value).toEqual('');
//     expect(component.createRegisterForm.get('surname')?.value).toEqual('');
//     expect(component.createRegisterForm.get('username')?.value).toEqual('');
//     expect(component.createRegisterForm.get('password')?.value).toEqual('');
//     expect(component.createRegisterForm.get('confirmPassword')?.value).toEqual('');
//     expect(component.createRegisterForm.get('address')?.value).toEqual('');
//     expect(component.createRegisterForm.get('phoneNumber')?.value).toEqual('');
//     expect(component.createRegisterForm.get('role')?.value).toEqual('');
//     expect(component.createRegisterForm.get('requestNotification')?.disabled).toBeTruthy();
//     expect(component.createRegisterForm.get('cancellationNotification')?.disabled).toBeTruthy();
//     expect(component.createRegisterForm.get('ownerRatingNotification')?.disabled).toBeTruthy();
//     expect(component.createRegisterForm.get('accommodationRatingNotification')?.disabled).toBeTruthy();
//     expect(component.createRegisterForm.get('ownerRepliedNotification')?.disabled).toBeTruthy();

//   });



//   it('should make input into all form fields', () => {
//     let el = fixture.debugElement.query(By.css('[formControlName=\'username\']')).nativeElement;
//     expect(el.getAttribute('readonly')).toEqual(null);
//     el = fixture.debugElement.query(By.css('[formControlName=\'name\']')).nativeElement;
//     expect(el.getAttribute('readonly')).toEqual(null);
//     el = fixture.debugElement.query(By.css('[formControlName=\'surname\']')).nativeElement;
//     expect(el.getAttribute('readonly')).toEqual(null);
//     el = fixture.debugElement.query(By.css('[formControlName=\'phoneNumber\']')).nativeElement;
//     expect(el.getAttribute('readonly')).toEqual(null);
//     el = fixture.debugElement.query(By.css('[formControlName=\'address\']')).nativeElement;
//     expect(el.getAttribute('readonly')).toEqual(null);
//     el = fixture.debugElement.query(By.css('[formControlName=\'password\']')).nativeElement;
//     expect(el.getAttribute('readonly')).toEqual(null);
//     el = fixture.debugElement.query(By.css('[formControlName=\'confirmPassword\']')).nativeElement;
//     expect(el.getAttribute('readonly')).toEqual(null);

//   });


  
//   it('should set form validity to false if invalid phone data is provided - incorrect digits number', () => {
//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '123', // ne postujemo regex
//       address: 'Test Address',
//       username: 'test@example.com',
//       password: 'password123',
//       confirmPassword: 'password123',
//       role: 'GUEST',
//       requestNotification: true,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });

//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeTruthy();
//   });


//   it('should be false when password mismatch', fakeAsync(() => {
//     component.ngOnInit();
//     tick();
  
   
//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '1234567890', 
//       address: 'Test Address',
//       username: 'test@example.com',
//       password: 'password123',
//       confirmPassword: 'password456', // Različit od passworda koji treba da je unet
//       role: 'GUEST',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeTruthy();
 
//   }));


//   it('Should be false for empty password field', fakeAsync(() => {
//     component.ngOnInit();
//     tick();
  
    
//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '1234567890', 
//       address: 'Test Address',
//       username: 'test@example.com',
//       password: '',
//       confirmPassword: 'password456', 
//       role: 'GUEST',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeTruthy();
    
//   }));

//   it('Should be false for empty confirm password field', fakeAsync(async () => {
//     component.ngOnInit();
//     tick();
  
//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '1234567890', 
//       address: 'Test Address',
//       username: 'test@example.com',
//       password: 'password123',
//       confirmPassword: '', 
//       role: 'GUEST',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeTruthy();
      
    
//   }));
  
//   it('Should be false for empty confirm name field', fakeAsync(async () => {
//     component.ngOnInit();
//     tick();
  
//     component.createRegisterForm.setValue({
//       name: '',
//       surname: 'Doe',
//       phoneNumber: '1234567890', 
//       address: 'Test Address',
//       username: 'test@example.com',
//       password: 'password123',
//       confirmPassword: 'password123',
//       role: 'GUEST',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeTruthy();
      
//   }));

//   it('Should be false for empty surname field', fakeAsync(async () => {
//     component.ngOnInit();
//     tick();
  
//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: '',
//       phoneNumber: '1234567890', 
//       address: 'Test Address',
//       username: 'test@example.com',
//       password: 'password123',
//       confirmPassword: 'password123',
//       role: 'GUEST',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeTruthy();
      
//   }));

//   it('Should be false for empty  address field', fakeAsync(async () => {
//     component.ngOnInit();
//     tick();
  
  
//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '1234567890', 
//       address: '',
//       username: 'test@example.com',
//       password: 'password123',
//       confirmPassword: 'password123',
//       role: 'GUEST',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeTruthy();
      
    
//   }));

//   it('Should be false for invalid email format', fakeAsync(async () => {
//     component.ngOnInit();
//     tick();
  

//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '1234567890', 
//       address: 'Test Address', 
//       username: 'test', //bez @gmail.com
//       password: 'password123',
//       confirmPassword: 'password123', 
//       role: 'GUEST',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeTruthy();
      
    
//   }));

//   it('Should be false for invalid email format', fakeAsync(async () => {
//     component.ngOnInit();
//     tick();
  
    
//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '1234567890', 
//       address: 'Test Address',
//       username: '688555',  //samo cifre
//       password: 'password123',
//       confirmPassword: 'password123', 
//       role: 'GUEST',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeTruthy();
      
    
//   }));

//   it('Should be false for empty email field', fakeAsync(async () => {
//     component.ngOnInit();
//     tick();
  
    
//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '1234567890', 
//       address: 'Test Address',
//       username: '',  //samo cifre
//       password: 'password123',
//       confirmPassword: 'password123', 
//       role: 'GUEST',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
  
      
    
//   }));

//   it('Should be false for not selected role', fakeAsync(async () => {
//     component.ngOnInit();
//     tick();
  
    
//     component.createRegisterForm.setValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '1234567890', 
//       address: 'Test Address',
//       username: 'vesna@gmail.com',  //samo cifre
//       password: 'password123',
//       confirmPassword: 'password123', 
//       role: '',
//       requestNotification: false,
//       cancellationNotification: false,
//       accommodationRatingNotification: false,
//       ownerRatingNotification: false,
//       ownerRepliedNotification: true,
//     });
  
//     expect(component.isFormValid).toBeFalse();
//     const registerButton = fixture.debugElement.query(By.css('button'));
//     expect(registerButton.nativeElement.disabled).toBeFalsy();
      
//   }));

 

//   it('Test toggle button depending on roles', fakeAsync(async () => {
//     component.ngOnInit();
//     fixture.detectChanges();
//     tick();
//     //kad je role ADMIN

//     const matSelect2 = await loader.getHarness(MatSelectHarness.with({ selector: '#role' }));

//     // Odaberi opciju po tekstu
//     await matSelect2.clickOptions({ text: 'Admin' });
//     expect(component.createRegisterForm.get('role')?.value).toBe('ADMIN');
    
      
//     // Ažuriranje UI
//     fixture.detectChanges();
//     tick();


//     const slideToggles2 = await loader.getAllHarnesses(MatSlideToggleHarness);
  
//     for (const toggle of slideToggles2) {
//       const isDisabled = await toggle.isDisabled();
     
//       expect(isDisabled).toBe(true);

//     }
   
   
//     // Ažuriranje UI
//     fixture.detectChanges();
//     tick();

//     //role je gost
    
//     const matSelect1 = await loader.getHarness(MatSelectHarness.with({ selector: '#role' }));

//     // Odaberi opciju po tekstu
//     await matSelect1.clickOptions({ text: 'Guest' });
//     expect(component.createRegisterForm.get('role')?.value).toBe('GUEST');
    
      
//     // Ažuriranje UI
//     fixture.detectChanges();
//     tick();

  
//     const slideToggles1 = await loader.getAllHarnesses(MatSlideToggleHarness);
//     let brojg=1
//     for (const toggle of slideToggles1) {
//       const isDisabled = await toggle.isDisabled();
//       if(brojg==5){
//         expect(isDisabled).toBe(false);
//       }
//      else{
//       expect(isDisabled).toBe(true);
//      }
//       brojg++
//     }
   
//     //kad je role OWNER
//     const matSelect = await loader.getHarness(MatSelectHarness.with({ selector: '#role' }));

//     // Odaberi opciju po tekstu
//     await matSelect.clickOptions({ text: 'Owner' });
//     expect(component.createRegisterForm.get('role')?.value).toBe('OWNER');
    
      
//     // Ažuriranje UI
//     fixture.detectChanges();
//     tick();

  
//     //expect(component.isFormValid).toBeFalse();
//     const slideToggles = await loader.getAllHarnesses(MatSlideToggleHarness);
//    let broj=1
//     // Iterirajte kroz pronađene slide toggle elemente i proverite omogućenost
//     for (const toggle of slideToggles) {
//       const isDisabled = await toggle.isDisabled();
//       if(broj==5){
//         expect(isDisabled).toBe(true);
//       }
//      else{
//       expect(isDisabled).toBe(false);
//      }
//       broj++
//     }
      
//   }));


//   it('Should be valid for all valid data', fakeAsync(async () => {
//     component.ngOnInit();
//     tick();
  
//     // Simulacija unosa u sva polja
//     component.createRegisterForm.patchValue({
//       name: 'John',
//       surname: 'Doe',
//       phoneNumber: '1234567890',
//       address: 'Sample Address',
//       username: 'john.doe@gmail.com',
//       password: 'password123',
//       confirmPassword: 'password123',
//       role: 'OWNER',
//       requestNotification: true,
//       cancellationNotification: false,
//       ownerRatingNotification: true,
//       accommodationRatingNotification: false,
//       ownerRepliedNotification: false
//     });
     
//     //kad je role OWNER
//     const matSelect = await loader.getHarness(MatSelectHarness.with({ selector: '#role' }));

//     // Odaberi opciju po tekstu
//     await matSelect.clickOptions({ text: 'Owner' });
//     expect(component.createRegisterForm.get('role')?.value).toBe('OWNER');
    
      
  
//     // Ažuriranje UI
//     fixture.detectChanges();
//     tick();
  
//     // Provera da li je forma validna
//     expect(component.createRegisterForm.valid).toBeTruthy();
    
//     fixture.detectChanges();
//     tick();
  
//     // Provera da li je dugme omogućeno kada je forma validna
//     const registerButton = fixture.debugElement.query(By.css('#button'));
//     expect(registerButton.nativeElement.disabled).toBeFalsy();
//     //trebao bi da pozove register fju
//     spyOn(component,'register');
//     registerButton.nativeElement.click();
//     tick();
//     fixture.detectChanges();
//     expect(component.register).toHaveBeenCalled();
   
//   }));

  

  

 



//  });


