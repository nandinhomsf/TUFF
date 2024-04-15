import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {LoginControllerService} from "../openapi";
import {StorageService} from "../services/storage.service";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({providedIn: "root"})
export class AuthenticationGuard {

  constructor(private loginControllerService: LoginControllerService,
              private storageService: StorageService,
              private router: Router) {}

  private navigateToLogin() {
    this.router.navigate(["login"]).then(r => r || console.info("Redirect to login failed"));
  }

  canActivate(): Observable<boolean> | boolean {
    const token = this.storageService.getToken();
    if (!token || new Date().getMilliseconds() > token.getExpiration().getMilliseconds()) {
      this.navigateToLogin();
      return false;
    }

    const request = {token: token.getAuthenticationValue()};
    return this.loginControllerService
      .verify(request)
      .pipe(
        map((data) => {
          if (data.valid) {
            return true;
          }
          this.navigateToLogin();
          return false;
        }),
        catchError((error) => {
          this.navigateToLogin();
          return of(false);
        })
      );
  }
}
