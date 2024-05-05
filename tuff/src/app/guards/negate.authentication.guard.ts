import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {catchError, map, Observable, of} from "rxjs";
import {AuthenticationGuard} from "./authentication.guard";

@Injectable({providedIn: "root"})
export class NegateAuthenticationGuard {

  constructor(private authenticationGuard: AuthenticationGuard, private router: Router) {}

  private navigateToMain() {
    this.router.navigate([""]).then(r => r || console.info("Error when redirect"));
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const result = this.authenticationGuard.canActivate(route);

    if (result instanceof Promise) {
      return result.then(value => {
        if (value) this.navigateToMain();
        return !value;
      });
    }
    if (result instanceof Observable) {
      return result
        .pipe(
          map((value) => {
            if (value) this.navigateToMain();
            return !value;
          }),
          catchError(() => {
            this.navigateToMain();
            return of(false);
          })
        );
    }

    if (result) this.navigateToMain();
    return !result;
  }
}
