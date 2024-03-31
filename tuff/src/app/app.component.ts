import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ThemeService} from "./services/theme.service";
import {EventService} from "./services/event.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  title = 'TUFF';

  loading: boolean = false;
  logged: boolean = false;

  themes: Array<string> = [
    "blue",
    "green",
    "yellow",
  ];

  constructor(translate: TranslateService, private themeService: ThemeService) {
    EventService.get("loading").subscribe(data => this.loading = data);
    EventService.get("logged").subscribe(data => this.logged = data);

    const lang = translate.getBrowserCultureLang();
    translate.setDefaultLang('en');

    if (lang && ["pt-BR"].includes(lang)) {
      translate.use(lang);
    }
  }

  ngOnInit(): void {
    const theme = localStorage.getItem("tuff-theme") || "green";
    const isDarkMode = localStorage.getItem("dark-mode") || "true";

    this.themeLoader(theme);
    this.themeService.setDarkMode(isDarkMode === "true");
  }

  protected themeLoader(themeEntry: string) {
    let link = document.getElementById("tuff-theme");
    if (link) {
      link.remove();
    }

    localStorage.setItem("tuff-theme", themeEntry);

    const htmlLink = document.createElement("link");
    htmlLink.id = "tuff-theme";
    htmlLink.rel = "stylesheet";
    htmlLink.href = `/${themeEntry}.css`;

    const head = document.getElementsByTagName("head")[0];
    head.appendChild(htmlLink);
  }
}
