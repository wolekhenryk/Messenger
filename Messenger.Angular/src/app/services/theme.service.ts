import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {
    this.setDarkTheme();
  }

  setDarkTheme() {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }

  setLightTheme() {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-bs-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', next);
  }
}
