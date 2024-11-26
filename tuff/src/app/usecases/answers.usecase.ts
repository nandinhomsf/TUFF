import {Injectable} from "@angular/core";
import {
  ChallengeAnswerControllerService,
  CreateChallengeAnswerRequest,
  CreateChallengeAnswerResponse,
  ListChallengeAnswerResponse, ReadChallengeAnswerResponse
} from "../openapi";
import {StorageService} from "../services/storage.service";
import {firstValueFrom} from "rxjs";

@Injectable({providedIn: "root"})
export class AnswersUseCase {

  constructor(private challengeAnswerControllerService: ChallengeAnswerControllerService) {
  }

  public search(answer: CreateChallengeAnswerRequest): Promise<CreateChallengeAnswerResponse> {
    return firstValueFrom(this.challengeAnswerControllerService.create2(answer));
  }

  public get(answerId: string): Promise<ReadChallengeAnswerResponse> {
    return firstValueFrom(this.challengeAnswerControllerService.read3(answerId));
  }

  public list(page: number, size: number): Promise<ListChallengeAnswerResponse> {
    const userId = StorageService.getUser()?.userId!;
    return firstValueFrom(this.challengeAnswerControllerService.listByUser(userId, page, size));
  }

}
