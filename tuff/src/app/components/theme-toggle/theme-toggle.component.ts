import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  isDarkMode: boolean;

  constructor() {
    this.isDarkMode = ThemeService.isDarkMode();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    ThemeService.setDarkMode(this.isDarkMode);
  }
}
