import {UserAccountControllerService, UserDto} from "../../openapi";
import {TranslateService} from "@ngx-translate/core";
import {EventService} from "../../services/event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class ReadUserUseCase {

  constructor(private userAccountControllerService: UserAccountControllerService,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {
  }

  public read(callback: ((userDto: UserDto) => void), context: object) {
    this.userAccountControllerService
      .read1()
      .subscribe({
        next: response => {
          callback.call(context, response.userDto);
          EventService.get("loading").next(false);
        },
        error: _ => {
          EventService.get("loading").next(false);
          this.snackBar.open(
            this.translateService.instant("errors.loadingUser"),
            this.translateService.instant("close"),
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
