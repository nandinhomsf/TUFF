import {UpdateUserRequest, UserAccountControllerService, UserDto} from "../../openapi";
import {TranslateService} from "@ngx-translate/core";
import {EventService} from "../../services/event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class UpdateUserUseCase {

  constructor(private userAccountControllerService: UserAccountControllerService,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {
  }

  public update(request: UpdateUserRequest, callBack: ((user: UserDto) => void), context: object) {

    this.userAccountControllerService
      .update(request)
      .subscribe({
        next: response => {
          EventService.get("loading").emit(false);
          callBack.call(context, response.user);
          this.snackBar.open(
            this.translateService.instant("success.userUpdate"),
            this.translateService.instant("close"),
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
            this.translateService.instant("errors.updateUser"),
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
