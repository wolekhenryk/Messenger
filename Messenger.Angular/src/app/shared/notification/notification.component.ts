import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AppNotification,
  NotificationsService,
} from '../../services/notifications.service';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  protected notification: AppNotification | null = null;
  constructor(private notificationsService: NotificationsService) {
    this.notificationsService.message$.subscribe((notification) => {
      this.notification = notification;
    });
  }

  dismiss() {
    this.notification = null;
  }
}
