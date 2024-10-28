import {Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {
  ChallengeAnswerControllerService,
  CreateChallengeAnswerRequest,
  CreateChallengeAnswerResponse
} from "../../openapi";

@Injectable({providedIn: "root"})
export class AnswerUseCase {

  constructor(private challengeAnswerControllerService: ChallengeAnswerControllerService) {
  }

  public answer(answer: CreateChallengeAnswerRequest): Promise<CreateChallengeAnswerResponse> {
    return firstValueFrom(this.challengeAnswerControllerService.create2(answer));
  }
}
