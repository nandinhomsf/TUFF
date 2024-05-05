import {Component} from "@angular/core";
import {EventService} from "../../services/event.service";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateUserRequest, UserAccountControllerService} from "../../openapi";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "register-form",
  templateUrl: "./register.view.html",
  styleUrls: ["./register.view.css"],
  providers: [MatSnackBar]
})
export class RegisterView {

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.min(6), Validators.required])
  });

  constructor(private userAccountControllerService: UserAccountControllerService,
              private translate: TranslateService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  submit() {
    if (this.form.valid) {
      EventService.get("loading").emit(true);

      const lang = this.translate.getBrowserCultureLang();
      const locale = lang && lang === "pt-BR" ? "PORTUGUESE" : "ENGLISH";

      const request: CreateUserRequest = {
        login: this.form.get("email")?.value,
        password: this.form.get("password")?.value,
        name: this.form.get("name")?.value,
        surname: this.form.get("surname")?.value,
        locale: locale,
      };

      this.userAccountControllerService
        .create(request)
        .subscribe({
          next: _ => {
            EventService.get("loading").emit(false);
          },
          error: error => {
            EventService.get("loading").emit(false);
            this.snackBar.open("Erro ao realizar registro" + error, "Fechar", {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top",
            });
          }
        });
    }
  }

  login(event: Event) {
    event.preventDefault();
    this.router.navigate(["login"]).then(r => r || console.info("Redirect to login failed"));
  }

}
