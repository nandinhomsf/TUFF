import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class ThemeService {
  private darkMode = false;

   constructor() {
     const isDarkMode = localStorage.getItem("dark-mode");
     if (isDarkMode) {
       this.darkMode = isDarkMode === "true";
     }
   }

  isDarkMode() {
    return this.darkMode;
  }

  setDarkMode(isDarkMode: boolean) {
    this.darkMode = isDarkMode;

    if (isDarkMode) {
      document.body.classList.add("theme-alternate");
      document.body.style.background = "#2c2c2c";
    } else {
      document.body.classList.remove("theme-alternate");
      document.body.style.background = "#fafafa";
    }

    localStorage.setItem("dark-mode", String(isDarkMode));
  }
}
