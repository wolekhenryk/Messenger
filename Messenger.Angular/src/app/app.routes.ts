import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './home/main/main.component';
import { authGuard } from './auth/guards/auth.guard';
import { noAuthGuard } from './auth/guards/noAuth.guard';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: '', component: MainComponent, canActivate: [authGuard] },
];
