import {Injectable} from "@angular/core";
import {ChallengeAnswerControllerService, ListChallengeAnswerResponse} from "../../openapi";
import {StorageService} from "../../services/storage.service";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({providedIn: "root"})
export class ListAnswersUseCase {

  constructor(private challengeAnswerControllerService: ChallengeAnswerControllerService,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {
  }

  public listAnswers(page: number, size: number, callback: ((listAnswerResponse: ListChallengeAnswerResponse) => void), context: object) {
    this.challengeAnswerControllerService
      .listByUser(StorageService.getUser()?.userId!, page, size)
      .subscribe({
        next: response => {
          callback.call(context, response);
        },
        error: _ => {
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
