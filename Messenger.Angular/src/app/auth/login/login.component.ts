import { Component } from '@angular/core';
import { NotificationComponent } from '../../shared/notification/notification.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import {
  NotificationsService,
  NotificationType,
} from '../../services/notifications.service';
import { BehaviorSubject } from 'rxjs';
import { UserLogin } from '../register/register.types';

@Component({
  selector: 'app-login',
  imports: [
    NotificationComponent,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: AuthService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading$.next(true);

    const userLogin: UserLogin = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };

    this.auth.loginUser(userLogin).subscribe({
      next: () => {
        this.notificationsService.show(
          'Login successful',
          NotificationType.Success
        );
        this.loading$.next(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.notificationsService.show(
          `Login failed: ${error.error}`,
          NotificationType.Error
        );
        console.error('Login error:', error);
        this.loading$.next(false);
      },
    });
  }
}
