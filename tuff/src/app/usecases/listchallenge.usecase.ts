import {ChallengeControllerService, ListChallengeResponse} from "../openapi";
import {TranslateService} from "@ngx-translate/core";
import {EventService} from "../services/event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class ListChallengeUseCase {

  constructor(private challengeControllerService: ChallengeControllerService,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {
  }

  public list(page: number, size: number, callback: ((listChallengeResponse: ListChallengeResponse) => void), context: object) {
    EventService.get("loading").emit(true);

    this.challengeControllerService
      .list(page, size)
      .subscribe({
        next: response => {
          callback.call(context, response);
          EventService.get("loading").emit(false);
        },
        error: _ => {
          EventService.get("loading").emit(false);
          this.snackBar.open(
            this.translateService.instant("errors.listChallenge"),
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
