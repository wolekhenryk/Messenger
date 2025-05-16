import { Component } from '@angular/core';
import {
  NavigationStart,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth/auth.service';
import { NotificationsService } from './services/notifications.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './home/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    private themeService: ThemeService,
    protected authService: AuthService,
    private notificationService: NotificationsService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.notificationService.handleRouteChange();
      }
    });
  }

  title = 'Messenger.Angular';
}
