import {AfterViewInit, Component} from "@angular/core";
import {EventService} from "../../services/event.service";
import {UpdateUserRequest, UserDto} from "../../openapi";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StorageService} from "../../services/storage.service";
import {UpdateUserUseCase} from "../../usecases/user/updateuser.usecase";
import {ReadUserUseCase} from "../../usecases/user/readuser.usecase";

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

  constructor(private updateUserUseCase: UpdateUserUseCase,
              private readUserUseCase: ReadUserUseCase) {
    EventService.get("loading").subscribe(data => this.loading = data);
  }

  private updateForm(userDto: UserDto) {
    StorageService.setUser(userDto);
    this.form.get("email")?.setValue(userDto.login);
    this.form.get("name")?.setValue(userDto.name);
    this.form.get("surname")?.setValue(userDto.surname);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      EventService.get("loading").next(true)

      this.readUserUseCase.read(this.updateForm, this);
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

      this.updateUserUseCase.update(request, this.updateForm, this);
    }
  }

}
