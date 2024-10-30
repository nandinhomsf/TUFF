import {ChallengeAnswerControllerService, ReadChallengeAnswerResponse} from "../../openapi";
import {Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";

@Injectable({providedIn: "root"})
export class ReadAnswerUseCase {

  constructor(private challengeAnswerControllerService: ChallengeAnswerControllerService) {
  }

  public read(answerId: string): Promise<ReadChallengeAnswerResponse> {
    return firstValueFrom(this.challengeAnswerControllerService.read3(answerId));
  }
}
