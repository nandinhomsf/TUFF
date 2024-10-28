import {Injectable} from "@angular/core";
import {ChallengeControllerService} from "../../openapi";
import {firstValueFrom} from "rxjs";

@Injectable({providedIn: "root"})
export class DeleteChallengeUseCase {

  constructor(private challengeControllerService: ChallengeControllerService) {
  }

  public delete(challengeId: string): Promise<void> {
    return firstValueFrom(this.challengeControllerService.delete1(challengeId));
  }
}
