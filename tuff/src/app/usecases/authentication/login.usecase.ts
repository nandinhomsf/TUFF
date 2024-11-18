import {AuthenticateRequest, LoginControllerService, TokenDto} from "../../openapi";
import {TranslateService} from "@ngx-translate/core";
import {StorageService} from "../../services/storage.service";
import {EventService} from "../../services/event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({providedIn: "root"})
export class LoginUseCase {

  constructor(private loginControllerService: LoginControllerService,
              private translateService: TranslateService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  public login(request: AuthenticateRequest, callback: ((tokenDto: TokenDto | null) => void), context: object) {
    this.loginControllerService
      .authenticate(request)
      .subscribe({
        next: response => {
          StorageService.setToken(response.tokenDto);
          EventService.get("loading").emit(false);
          callback.call(context, response.tokenDto);
        },
        error: error => {
          EventService.get("loading").emit(false);
          if (error.error.message !== "label.invalid.not-verified") {
            this.snackBar.open(
              this.translateService.instant("errors.login"),
              this.translateService.instant("close"),
              {
                duration: 2000,
                horizontalPosition: "right",
                verticalPosition: "top"
              }
            );
          } else {
            this.router.navigate(["email-confirm"], {queryParams: {email: request.login}})
              .then(r => r || console.info("Redirect to email confirm failed"));
          }
        }
      });
  }

}
