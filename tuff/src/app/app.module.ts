import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {NgModule} from "@angular/core";
import {ThemeToggleComponent} from "./components/theme-toggle/theme-toggle.component";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {provideRouter, RouterOutlet, withHashLocation} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {routes} from "./app.routes";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {RegisterView} from "./views/register/register.view";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {APIInterceptor} from "./directives/api.interceptor";
import {LoginView} from "./views/login/login.view";
import {ProfileComponent} from "./components/profile/profile.component";
import {MatDrawerContainer, MatDrawer, MatDrawerContent} from "@angular/material/sidenav";
import {HomeView} from "./views/home/home.view";
import {ResumeComponent} from "./components/resume/resume.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {ChallengesComponent} from "./components/challenges/challenges.component";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ChallengeView} from "./views/challenge/challenge.view";
import {MatTooltipModule} from '@angular/material/tooltip';
import {RunChallengeView} from "./views/run-challenge/run-challenge.view";
import {MatOption, MatSelect} from "@angular/material/select";
import {RunsComponent} from "./components/runs/runs.component";
import {AnswerView} from "./views/answer/answer.view";
import {
  MatAccordion,
  MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {EmailConfirmView} from "./views/email-confirm/email-confirm.view";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ThemeToggleComponent,
    AppComponent,
    ProfileComponent,
    LoginView,
    RegisterView,
    HomeView,
    EmailConfirmView,
    ResumeComponent,
    ChallengesComponent,
    ChallengeView,
    RunChallengeView,
    RunsComponent,
    AnswerView
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
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatFabButton,
    MatGridList,
    MatGridTile,
    MatError,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatPaginator,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatTooltipModule,
    MatSelect,
    MatOption,
    MatLabel,
    MatSuffix,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelContent,
    MatExpansionPanelDescription
  ],
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
