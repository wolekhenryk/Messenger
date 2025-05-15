import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum NotificationType {
  Success = 'success',
  Error = 'danger',
  Info = 'info',
  Warning = 'warning',
}

export interface AppNotification {
  type: NotificationType;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private messageSubject = new BehaviorSubject<AppNotification | null>(null);
  private keepAfterRouteChange = false;

  constructor() {}

  show(message: string, type: NotificationType, keep = false): void {
    this.keepAfterRouteChange = keep;
    this.messageSubject.next({ type, message });
  }

  get message$() {
    return this.messageSubject.asObservable();
  }

  clear(): void {
    this.messageSubject.next(null);
  }

  handleRouteChange(): void {
    if (this.keepAfterRouteChange) {
      this.keepAfterRouteChange = false;
    } else {
      this.clear();
    }
  }
}
