import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {Configuration, LoginControllerService, UserAccountControllerService} from "../openapi";
import {StorageService} from "../services/storage.service";
import {catchError, map, Observable, of} from "rxjs";
import {TokenModel} from "../models/token.model";

@Injectable({providedIn: "root"})
export class AuthenticationGuard {

  private readonly validNegate: Set<string> = new Set(["login", "register", "email-confirm"]);

  constructor(private userAccountControllerService: UserAccountControllerService,
              private loginControllerService: LoginControllerService,
              private router: Router) {}

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

  private setAuthorization() {
    const token = StorageService.getToken();

    this.setConfiguration(this.userAccountControllerService.configuration, token);
    this.setConfiguration(this.loginControllerService.configuration, token);
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const token = StorageService.getToken();
    const currentDate = new Date();
    const expirationDate = token?.getExpiration();

    if (!token || !expirationDate || currentDate > expirationDate) {
      this.navigateToInvalid(route);
      return false;
    }

    const request = {token: token.getAuthenticationValue()};
    return this.loginControllerService
      .verify(request)
      .pipe(
        map((data) => {
          if (data.valid) {
            this.setAuthorization();
            return true;
          }
          this.navigateToInvalid(route);
          return false;
        }),
        catchError(() => {
          this.navigateToInvalid(route);
          return of(false);
        })
      );
  }
}
