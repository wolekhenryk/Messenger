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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
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
