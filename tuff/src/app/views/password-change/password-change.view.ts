import {Component} from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RecoveryUseCase} from "../../usecases/authentication/recovery.usecase";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../../services/event.service";

@Component({
  selector: "password-change-form",
  templateUrl: "./password-change.view.html",
  styleUrls: ["./password-change.view.css"],
  providers: [MatSnackBar]
})
export class PasswordChangeView {

  loading: boolean = false;

  token: string = "";

  public form: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.min(6), Validators.required])
  });

  constructor(private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private recoveryUseCase: RecoveryUseCase,
              private translateService: TranslateService) {
    EventService.get("loading").subscribe(data => this.loading = data);

    this.route.params.subscribe(() => {
      this.route.queryParams.subscribe(params => {
        this.token = params["token"];
      });
    });
  }

  submit() {
    if (this.form.valid) {
      EventService.get("loading").emit(true);

      this.recoveryUseCase.changePassword(this.token, this.form.get("password")?.value)
        .then(() => {
          this.snackBar.open(
            this.translateService.instant("success.passwordChanged"),
            this.translateService.instant("close"),
            {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
          );

          this.router
            .navigate(["login"])
            .then(r => r || console.info("Redirect to login failed"));
        })
        .catch(() => {
          this.snackBar.open(
            this.translateService.instant("errors.recoveryRequest"),
            this.translateService.instant("close"),
            {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
          );
        })
        .finally(() => EventService.get("loading").emit(false));
    } else {
      this.snackBar.open(
        this.translateService.instant("errors.invalidForm"),
        this.translateService.instant("close"),
        {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
      );
    }
  }

}
