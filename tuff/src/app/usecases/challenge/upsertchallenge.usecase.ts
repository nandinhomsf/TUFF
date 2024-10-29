import {ChallengeControllerService, CreateChallengeRequest, UpdateChallengeRequest} from "../../openapi";
import {TranslateService} from "@ngx-translate/core";
import {EventService} from "../../services/event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";
import DifficultyEnum = UpdateChallengeRequest.DifficultyEnum;

@Injectable({providedIn: "root"})
export class UpsertChallengeUseCase {

  constructor(private challengeControllerService: ChallengeControllerService,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {
  }

  public upsert(callback: ((challengeId: string) => void),
              context: object,
              name: string,
              description: string,
              code: string,
              difficulty: DifficultyEnum,
              challengeId: string | undefined) {

    EventService.get("loading").next(true);

    if (challengeId) {
      const updateRequest: UpdateChallengeRequest = {name, description, code, difficulty};

      this.challengeControllerService
        .update1(challengeId, updateRequest)
        .subscribe({
          next: _ => {
            callback.call(context, challengeId);
            EventService.get("loading").next(false);
          },
          error: _ => {
            EventService.get("loading").next(false);
            this.snackBar.open(
              this.translateService.instant("errors.updateChallenge"),
              this.translateService.instant("close"),
              {
                duration: 2000,
                horizontalPosition: "right",
                verticalPosition: "top"
              }
            );
          }
        });
    } else {
      const createRequest: CreateChallengeRequest = {name, description, code, difficulty};

      this.challengeControllerService
        .create1(createRequest)
        .subscribe({
          next: response => {
            callback.call(context, response.id!);
            EventService.get("loading").next(false);
          },
          error: _ => {
            EventService.get("loading").next(false);
            this.snackBar.open(
              this.translateService.instant("errors.createChallenge"),
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
}
