import {AfterViewInit, Component} from "@angular/core";
import {EventService} from "../../services/event.service";
import {UpdateUserRequest, UserDto} from "../../openapi";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StorageService} from "../../services/storage.service";
import {UserUseCase} from "../../usecases/user.usecase";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements AfterViewInit {

  loading: boolean = true;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
  });

  constructor(private snackBar: MatSnackBar,
              private userUseCase: UserUseCase,
              private translateService: TranslateService) {
    EventService.get("loading").subscribe(data => this.loading = data);
  }

  private updateForm(userDto: UserDto) {
    StorageService.setUser(userDto);

    this.form.get("email")?.setValue(userDto.login);
    this.form.get("name")?.setValue(userDto.name);
    this.form.get("surname")?.setValue(userDto.surname);

    EventService.get("loading").next(false)
  }

  ngAfterViewInit() {
    setTimeout(() => {
      EventService.get("loading").next(true)

      this.userUseCase.get()
        .then(response => {
          this.updateForm(response.userDto)
        })
        .catch(() => {
          this.snackBar.open(
            this.translateService.instant("errors.loadingUser"),
            this.translateService.instant("close"),
            {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
          );

          EventService.get("loading").next(false)
        });
    }, 10)
  }

  save() {
    if (this.form.valid) {
      EventService.get("loading").emit(true);

      const request: UpdateUserRequest = {
        login: this.form.get("email")?.value,
        name: this.form.get("name")?.value,
        surname: this.form.get("surname")?.value,
      }

      this.userUseCase.update(request)
        .then(response => {
          this.updateForm(response.user)

          this.snackBar.open(
            this.translateService.instant("success.userUpdate"),
            this.translateService.instant("close"),
            {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
          );
        })
        .catch(() => {
          this.snackBar.open(
            this.translateService.instant("errors.updateUser"),
            this.translateService.instant("close"),
            {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
          );

          EventService.get("loading").next(false)
        });
    }
  }

}
