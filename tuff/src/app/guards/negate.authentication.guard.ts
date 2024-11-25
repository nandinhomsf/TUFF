import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {AuthenticationGuard} from "./authentication.guard";

@Injectable({providedIn: "root"})
export class NegateAuthenticationGuard {

  constructor(private authenticationGuard: AuthenticationGuard, private router: Router) {
  }

  private navigateToMain() {
    this.router.navigate([""]).then(r => r || console.info("Error when redirect"));
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {
    const result = this.authenticationGuard.canActivate(route);

    if (result instanceof Promise) {
      return result.then(value => {
        if (value) {
          this.navigateToMain();
        }

        return !value;
      });
    }

    if (result) {
      this.navigateToMain();
    }

    return !result;
  }
}
