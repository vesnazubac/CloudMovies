
import { ChangeDetectorRef, Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, AbstractControl, ValidationErrors} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/user.service';
import { UserPostDTO } from 'src/app/models/userPostDTO.model';
import { RoleEnum } from 'src/app/models/userEnums.model';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatOptionSelectionChange, ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepickerActions } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,MatIconModule,MatButtonModule,MatSelectModule,
      MatSlideToggleModule,CommonModule,MatDatepickerModule]
})
export class RegisterFormComponent {

  color: string = 'primary'; // Theme color for slide toggles
  checked: boolean = false; // Default checked state for slide toggles
  disabled: boolean = false; // Default disabled state for slide toggles
  hide: boolean = true; // Hide/show password toggle

  
   passwordMatchValidator: Validators = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
  
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  // Form group definition with form controls and initial state
  createRegisterForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    birthdate: new FormControl('', Validators.required),
   
  });

  constructor(private cdr: ChangeDetectorRef, private userService: UserService, private router: Router,private snackBar: MatSnackBar) { }

  // Method to navigate to home page
  navigateToHome() {
    this.router.navigate(['home']);
  }

  // Method to handle registration
  register() {
    // Enable button indicator or loader
    // this.button_enabled = true; // You can uncomment this if you have this logic


    //treba drugacije registracija

    // Constructing UserPostDTO object from form values
    const user: UserPostDTO = {
      firstName: this.createRegisterForm.value.name,
      lastName: this.createRegisterForm.value.surname,
      username: this.createRegisterForm.value.username,
      password: this.createRegisterForm.value.password,
     
      birthdate: this.createRegisterForm.value.birthdate?.toString().slice(0, 10),
      
      email: this.createRegisterForm.value.username
      
    };

    // Calling the service method to register the user
    this.userService.registerUser(user).subscribe({
      next: (data: UserPostDTO) => {
        // Successful registration navigation logic
        console.log('User registered successfully:', data);
        this.navigateToHome(); // Example navigation to home page after registration
      },
      error: (error) => {
        // Error handling logic, if needed
        console.error('Error occurred during registration:', error);
        // Handle error feedback to the user, e.g., display error message
        this.openErrorSnackBar('Failed to register user. Please try again.');
      }
    });

  
  }

  openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Dužina prikaza snackbar poruke u milisekundama (ovde 5 sekundi)
      horizontalPosition: 'center', // Položaj snackbar poruke na ekranu
      verticalPosition: 'bottom', // Položaj snackbar poruke na ekranu
      panelClass: ['error-snackbar'] // Dodatna CSS klasa za stilizaciju snackbar poruke
    });
  }



  // Getter for form validity check
  get isFormValid(): boolean {
    return this.createRegisterForm.valid;
  }
}
