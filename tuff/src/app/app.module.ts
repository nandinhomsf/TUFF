import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {NgModule} from "@angular/core";
import {ThemeToggleComponent} from "./components/theme-toggle/theme-toggle.component";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {provideRouter, RouterOutlet} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {routes} from "./app.routes";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {RegisterView} from "./views/register/register.view";
import {MatFormField} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {APIInterceptor} from "./directives/api.interceptor";
import {StorageService} from "./services/storage.service";
import {LoginView} from "./views/login/login.view";
import {ProfileView} from "./views/profile/profile.view";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ThemeToggleComponent,
    AppComponent,
    LoginView,
    RegisterView,
    ProfileView,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    MatToolbar,
    MatMenuTrigger,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    NgForOf,
    MatDivider,
    MatCard,
    MatButton,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatProgressSpinner,
    MatFormField,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    ReactiveFormsModule,
    MatInput,
  ],
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
    {
      provide: StorageService,
      useClass: StorageService,
      multi: false,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
