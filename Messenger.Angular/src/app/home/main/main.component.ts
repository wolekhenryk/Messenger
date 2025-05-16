import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SignalrService } from '../../services/signalr.service';

@Component({
  selector: 'app-main',
  imports: [SidebarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  constructor(private signalRService: SignalrService) {}
}
