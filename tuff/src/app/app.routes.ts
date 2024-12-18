import { Routes } from '@angular/router';
import {RegisterView} from "./views/register/register.view";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {LoginView} from "./views/login/login.view";
import {NegateAuthenticationGuard} from "./guards/negate.authentication.guard";
import {HomeView} from "./views/home/home.view";
import {ChallengeView} from "./views/challenge/challenge.view";
import {RunChallengeView} from "./views/run-challenge/run-challenge.view";
import {AnswerView} from "./views/answer/answer.view";
import {EmailConfirmView} from "./views/email-confirm/email-confirm.view";
import {RecoveryView} from "./views/recovery/recovery.view";
import {PasswordChangeView} from "./views/password-change/password-change.view";

export const routes: Routes = [
  {path: "", component: HomeView, canActivate: [AuthenticationGuard]},
  {path: "email-confirm", component: EmailConfirmView, canActivate: [NegateAuthenticationGuard]},
  {path: "login", component: LoginView, canActivate: [NegateAuthenticationGuard]},
  {path: "login/recovery", component: PasswordChangeView, canActivate: [NegateAuthenticationGuard]},
  {path: "register", component: RegisterView, canActivate: [NegateAuthenticationGuard]},
  {path: "recovery", component: RecoveryView, canActivate: [NegateAuthenticationGuard]},
  {path: "challenge", component: ChallengeView, canActivate: [AuthenticationGuard]},
  {path: "challenge/run", component: RunChallengeView, canActivate: [AuthenticationGuard]},
  {path: "answer", component: AnswerView, canActivate: [AuthenticationGuard]},
];
