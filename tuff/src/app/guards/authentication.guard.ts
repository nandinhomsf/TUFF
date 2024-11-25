import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {Configuration, LoginControllerService, ReadUserResponse, UserAccountControllerService} from "../openapi";
import {StorageService} from "../services/storage.service";
import {firstValueFrom, Observable} from "rxjs";
import {TokenModel} from "../models/token.model";

@Injectable({providedIn: "root"})
export class AuthenticationGuard {

  private readonly validNegate: Set<string> = new Set(["login", "register", "email-confirm"]);

  constructor(private userAccountControllerService: UserAccountControllerService,
              private loginControllerService: LoginControllerService,
              private router: Router) {
  }

  private navigateToInvalid(route: ActivatedRouteSnapshot) {
    if (!this.validNegate.has(route.routeConfig?.path!)) {
      this.router.navigate(["login"]).then(r => r || console.info("Error when redirect"));
    }
  }

  private setConfiguration(configuration: Configuration, token: TokenModel | undefined) {
    if (token) {
      configuration.credentials["bearerAuth"] = token.getToken();
    }
  }

  private setAuthorization(): Observable<ReadUserResponse> {
    const token: TokenModel | undefined = StorageService.getToken();

    this.setConfiguration(this.userAccountControllerService.configuration, token);
    this.setConfiguration(this.loginControllerService.configuration, token);

    return this.userAccountControllerService.read1();
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {
    const token = StorageService.getToken();
    const currentDate = new Date();
    const expirationDate = token?.getExpiration();

    if (!token || !expirationDate || currentDate > expirationDate) {
      StorageService.removeUser()
      this.navigateToInvalid(route);
      return false;
    }

    const request = {token: token.getAuthenticationValue()};

    return firstValueFrom(this.loginControllerService.verify(request))
      .then(data => {
        if (data.valid) {
          return firstValueFrom(this.setAuthorization())
            .then(response => {
              StorageService.setUser(response.userDto);
              return true;
            })
            .catch(() => {
              this.navigateToInvalid(route);
              return false;
            });
        }

        this.navigateToInvalid(route);
        return false;
      })
      .catch(() => {
        this.navigateToInvalid(route);
        return false;
      });
  }
}
