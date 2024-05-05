import { Routes } from '@angular/router';
import {RegisterView} from "./views/register/register.view";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {LoginView} from "./views/login/login.view";
import {NegateAuthenticationGuard} from "./guards/negate.authentication.guard";
import {ProfileView} from "./views/profile/profile.view";

export const routes: Routes = [
  {path: "", component: ProfileView, canActivate: [AuthenticationGuard]},
  {path: "login", component: LoginView, canActivate: [NegateAuthenticationGuard]},
  {path: "register", component: RegisterView, canActivate: [NegateAuthenticationGuard]},
];
