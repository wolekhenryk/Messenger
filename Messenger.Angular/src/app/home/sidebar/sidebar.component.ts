import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  protected contacts: string[] = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
  ];
}
