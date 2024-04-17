import { Routes } from '@angular/router';
import {RegisterView} from "./views/register/register.view";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {LoginView} from "./views/login/login.view";
import {NegateAuthenticationGuard} from "./guards/negate.authentication.guard";

export const routes: Routes = [
  {path: "", component: RegisterView, canActivate: [AuthenticationGuard]},
  {path: "login", component: LoginView, canActivate: [NegateAuthenticationGuard]},
  {path: "register", component: RegisterView, canActivate: [NegateAuthenticationGuard]},
];
