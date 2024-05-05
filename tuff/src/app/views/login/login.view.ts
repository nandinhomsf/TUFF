import {Component} from "@angular/core";
import {EventService} from "../../services/event.service";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginUseCase} from "../../usecases/login.usecase";

@Component({
  selector: "login-form",
  templateUrl: "./login.view.html",
  styleUrls: ["./login.view.css"],
  providers: [MatSnackBar]
})
export class LoginView {

  loading: boolean = false;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.min(6), Validators.required])
  });

  constructor(private loginUserCase: LoginUseCase,
              private router: Router) {
    EventService.get("loading").subscribe(data => this.loading = data);
  }

  submit() {
    if (this.form.valid) {
      EventService.get("loading").emit(true);

      const request = {
        login: this.form.get("email")?.value,
        password: this.form.get("password")?.value,
      };

      this.loginUserCase.login(request, this.home, this);
    }
  }

  register(event: Event) {
    event.preventDefault();
    this.router.navigate(["register"]).then(r => r || console.info("Redirect to login failed"));
  }

  private home() {
    this.router.navigate([""]).then(r => r || console.info("Redirect to home failed"));
  }

}
