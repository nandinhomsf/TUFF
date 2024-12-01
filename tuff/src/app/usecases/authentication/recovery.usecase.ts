import {ChangeUserPasswordRequest, LoginControllerService} from "../../openapi";
import {Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";

@Injectable({providedIn: "root"})
export class RecoveryUseCase {

  constructor(private loginControllerService: LoginControllerService) {
  }

  public recovery(email: string) {
    firstValueFrom(this.loginControllerService.recoveryPassword(email))
      .then(_ => console.info("Recovery request sent"));
  }

  public changePassword(token: string, password: string): Promise<void> {
    const request: ChangeUserPasswordRequest = {
      token: token,
      password: password
    }

    return firstValueFrom(this.loginControllerService.changePassword(request));
  }

}
