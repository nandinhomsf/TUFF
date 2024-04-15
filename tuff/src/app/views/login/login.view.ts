import {Component} from "@angular/core";
import {EventService} from "../../services/event.service";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginControllerService} from "../../openapi";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: "login-form",
  templateUrl: "./login.view.html",
  styleUrls: ["./login.view.css"],
  providers: [MatSnackBar]
})
export class LoginView {

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.min(6), Validators.required])
  });

  constructor(private loginControllerService: LoginControllerService,
              private storageService: StorageService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  submit() {
    if (this.form.valid) {
      EventService.get("loading").emit(true);

      const request = {
        login: this.form.get("email")?.value,
        password: this.form.get("password")?.value,
      };

      this.loginControllerService
        .authenticate(request)
        .subscribe({
          next: response => {
            this.storageService.setToken(response.tokenDto);
            EventService.get("loading").emit(false);
          },
          error: error => {
            EventService.get("loading").emit(false);
            this.snackBar.open("Erro ao realizar login" + error, "Fechar", {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top",
            });
          }
        });
    }
  }

  register(event: Event) {
    event.preventDefault();
    this.router.navigate(["register"]).then(r => r || console.info("Redirect to login failed"));
  }

}
