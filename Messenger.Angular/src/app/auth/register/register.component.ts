import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  passwordMatchValidator,
  strongPasswordValidator,
} from '../../shared/validators/validators';
import { UserRegister } from './regisyer.types';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        strongPasswordValidator,
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: passwordMatchValidator,
    }
  );

  constructor(private auth: AuthService) {}

  // Add this getter for easier access in the template
  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  // Mark all controls as touched on submit to show errors
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const userRegister: UserRegister = {
      firstName: this.registerForm.value.firstName || '',
      lastName: this.registerForm.value.lastName || '',
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.password || '',
    };
    this.auth.registerUser(userRegister).subscribe({
      next: (response) => {
        console.log('User registered successfully', response);
        // Handle successful registration, e.g., navigate to login page
      },
      error: (error) => {
        console.error('Error registering user', error);
        // Handle error, e.g., show a message to the user
      },
    });
  }
}
