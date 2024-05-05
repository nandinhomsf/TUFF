import {AfterViewInit, Component} from "@angular/core";
import {EventService} from "../../services/event.service";
import {UpdateUserRequest, UserAccountControllerService, UserDto} from "../../openapi";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: "profile",
  templateUrl: "./profile.view.html",
  styleUrls: ["./profile.view.css"],
})
export class ProfileView implements AfterViewInit {

  loading: boolean = true;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
  });

  constructor(private userAccountControllerService: UserAccountControllerService,
              private storageService: StorageService,
              private translate: TranslateService,
              private snackBar: MatSnackBar) {
    EventService.get("loading").subscribe(data => this.loading = data);
  }

  private updateForm(userDto: UserDto) {
    this.storageService.setUser(userDto);
    this.form.get("email")?.setValue(userDto.login);
    this.form.get("name")?.setValue(userDto.name);
    this.form.get("surname")?.setValue(userDto.surname);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      EventService.get("loading").next(true)

      this.userAccountControllerService
        .read1()
        .subscribe({
          next: response => {
            this.updateForm(response.userDto);
            EventService.get("loading").next(false);
          },
          error: _ => {
            EventService.get("loading").next(false);
            this.snackBar.open(
              this.translate.instant("errors.loadingUser"),
              this.translate.instant("close"),
              {
                duration: 2000,
                horizontalPosition: "right",
                verticalPosition: "top"
              }
            );
          }
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

      this.userAccountControllerService
        .update(request)
        .subscribe({
          next: response => {
            this.updateForm(response.user);
            EventService.get("loading").emit(false);
            this.snackBar.open(
              this.translate.instant("success.userUpdate"),
              this.translate.instant("close"),
              {
                duration: 2000,
                horizontalPosition: "right",
                verticalPosition: "top"
              }
            );
          },
          error: _ => {
            EventService.get("loading").emit(false);
            this.snackBar.open(
              this.translate.instant("errors.updateUser"),
              this.translate.instant("close"),
              {
                duration: 2000,
                horizontalPosition: "right",
                verticalPosition: "top"
              }
            );
          }
        });
    }
  }

}
