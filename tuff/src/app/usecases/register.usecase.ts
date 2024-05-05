import {AuthenticateRequest, CreateUserRequest, UserAccountControllerService} from "../openapi";
import {TranslateService} from "@ngx-translate/core";
import {EventService} from "../services/event.service";
import {LoginUseCase} from "./login.usecase";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class RegisterUseCase {

  constructor(private userAccountControllerService: UserAccountControllerService,
              private translateService: TranslateService,
              private loginUseCase: LoginUseCase,
              private snackBar: MatSnackBar) {
  }

  public register(request: CreateUserRequest, callback: (() => void), context: object) {
    this.userAccountControllerService
      .create(request)
      .subscribe({
        next: _ => {
          const loginRequest: AuthenticateRequest = {login: request.login, password: request.password}
          this.loginUseCase.login(loginRequest, callback, context);
        },
        error: _ => {
          EventService.get("loading").emit(false);
          this.snackBar.open(
            this.translateService.instant("errors.register"),
            this.translateService.instant("close"),
            {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top",
            }
          );
        }
      });
  }

}
