import { Routes } from '@angular/router';
import {RegisterView} from "./views/register/register.view";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {LoginView} from "./views/login/login.view";

export const routes: Routes = [
  {path: "", component: RegisterView, canActivate: [AuthenticationGuard]},
  {path: "login", component: LoginView},
  {path: "register", component: RegisterView},
];
