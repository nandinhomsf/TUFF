import {
  ChallengeControllerService,
  ListChallengeResponse,
  ReadChallengeResponse,
  UpdateChallengeRequest
} from "../openapi";
import {Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";
import DifficultyEnum = UpdateChallengeRequest.DifficultyEnum;

@Injectable({providedIn: "root"})
export class ChallengeUseCase {

  constructor(private challengeControllerService: ChallengeControllerService) {
  }

  public list(page: number, size: number): Promise<ListChallengeResponse> {
    return firstValueFrom(this.challengeControllerService.list(page, size));
  }

  public get(challengeId: string): Promise<ReadChallengeResponse> {
    return firstValueFrom(this.challengeControllerService.read2(challengeId));
  }

  public async upsert(name: string,
                      description: string,
                      code: string,
                      difficulty: DifficultyEnum,
                      challengeId: string | undefined): Promise<string> {
    const request = {name, description, code, difficulty};

    if (challengeId) {
      await firstValueFrom(this.challengeControllerService.update1(challengeId, request));
      return challengeId;
    } else {
      const response = await firstValueFrom(this.challengeControllerService.create1(request));
      challengeId = response.id!;
    }

    return challengeId!;
  }

  public delete(challengeId: string): Promise<void> {
    return firstValueFrom(this.challengeControllerService.delete1(challengeId));
  }

}
