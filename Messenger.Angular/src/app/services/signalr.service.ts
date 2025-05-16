import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { TokenService } from './auth/token.service';
import { Subject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService implements OnDestroy {
  private hubConnection: signalR.HubConnection | null = null;
  private hubAddress = 'http://localhost:4300/app/messages';

  private tokenSubscription!: Subscription;
  private connected = false;

  private subjects: Map<string, Subject<any>> = new Map();

  constructor(private tokenService: TokenService) {
    this.tokenSubscription = this.tokenService.accessToken$.subscribe(
      (token) => {
        if (token) {
          this.startConnection(token);
        } else {
          this.stopConnection();
        }
      }
    );
  }

  private startConnection(token: string): void {
    if (this.hubConnection && this.connected) {
      this.stopConnection();
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubAddress, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.connected = true;
        console.log('[SignalR] Connected');
        for (const [methodName, subject] of this.subjects) {
          this.hubConnection!.on(methodName, (data: any) => subject.next(data));
        }
      })
      .catch((err) => {
        console.error('[SignalR] Connection error:', err);
        this.connected = false;
      });
  }

  private stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
      this.connected = false;
      console.log('[SignalR] Disconnected');
    }
  }

  public subscribeTo<T>(methodName: string): Observable<T> {
    if (!this.subjects.has(methodName)) {
      const subject = new Subject<T>();
      this.subjects.set(methodName, subject);

      if (this.hubConnection) {
        this.hubConnection.on(methodName, (data: T) => subject.next(data));
      }
    }

    return this.subjects.get(methodName)!.asObservable();
  }

  public unsubscribeFrom(methodName: string): void {
    if (this.subjects.has(methodName)) {
      if (this.hubConnection) {
        this.hubConnection.off(methodName);
      }
      this.subjects.get(methodName)!.complete();
      this.subjects.delete(methodName);
    }
  }

  public send<T>(methodName: string, payload: T): void {
    if (this.hubConnection && this.connected) {
      this.hubConnection
        .invoke(methodName, payload)
        .catch((err) =>
          console.error(`[SignalR] Send failed (${methodName}):`, err)
        );
    }
  }

  ngOnDestroy(): void {
    this.stopConnection();
    this.tokenSubscription.unsubscribe();
    for (const subject of this.subjects.values()) {
      subject.complete();
    }
    this.subjects.clear();
  }
}
