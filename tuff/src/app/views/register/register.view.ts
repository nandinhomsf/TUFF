import {Component} from "@angular/core";
import {EventService} from "../../services/event.service";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateUserRequest} from "../../openapi";
import {TranslateService} from "@ngx-translate/core";
import {RegisterUseCase} from "../../usecases/register.usecase";

@Component({
  selector: "register-form",
  templateUrl: "./register.view.html",
  styleUrls: ["./register.view.css"],
  providers: [MatSnackBar]
})
export class RegisterView {

  loading: boolean = false;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.min(6), Validators.required])
  });

  constructor(private registerUseCase: RegisterUseCase,
              private translate: TranslateService,
              private router: Router) {
    EventService.get("loading").subscribe(data => this.loading = data);
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

      this.registerUseCase.register(request, this.home, this);
    }
  }

  login(event: Event) {
    event.preventDefault();
    this.router.navigate(["login"]).then(r => r || console.info("Redirect to login failed"));
  }

  private home() {
    this.router.navigate([""]).then(r => r || console.info("Redirect to home failed"));
  }

}
