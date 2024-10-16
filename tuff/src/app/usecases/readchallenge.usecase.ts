import {ChallengeControllerService, ReadChallengeResponse} from "../openapi";
import {Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";

@Injectable({providedIn: "root"})
export class ReadChallengeUseCase {

  constructor(private challengeControllerService: ChallengeControllerService) {
  }

  public read(challengeId: string): Promise<ReadChallengeResponse> {
    return firstValueFrom(this.challengeControllerService.read2(challengeId));
  }
}
