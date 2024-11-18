import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {TokenDto} from "../../openapi";

@Component({
  selector: 'email-confirm',
  templateUrl: './email-confirm.view.html',
  styleUrl: './email-confirm.view.css'
})
export class EmailConfirmView implements AfterViewInit {

  error: string = "";

  email: string = "";

  login: string = "";
  token: string = "";
  roles: string[] = [];
  expiration: Date | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.route.params.subscribe(() => {
      this.route.queryParams.subscribe(params => {
        this.error = params["error"];
        this.email = params["email"];
        this.login = params["login"];
        this.token = params["token"];
        if (params["roles"]) {
          this.roles = params["roles"].split(",");
        }
        if (params["expiration"]) {
          this.expiration = new Date(parseInt(params["expiration"]));
        }
      });
    });
  }

  redirectToLogin() {
    this.router.navigate(["login"])
      .then(r => r || console.info("Redirect to login failed"));
  }

  ngAfterViewInit(): void {
    if (this.login && this.token) {
      const tokenDto: TokenDto = {
        login: this.login,
        token: this.token,
        roles: this.roles,
        expiration: this.expiration?.toISOString()!
      }

      StorageService.setToken(tokenDto);

      this.router.navigate([""])
        .then(r => r || console.info("Redirect to home failed"));
    }
  }

}
