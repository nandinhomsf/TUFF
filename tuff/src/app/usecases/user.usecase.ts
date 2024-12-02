import {ListUserRankResponse, ReadUserResponse, UpdateUserRequest, UserAccountControllerService} from "../openapi";
import {Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";

@Injectable({providedIn: "root"})
export class UserUseCase {

  constructor(private userAccountControllerService: UserAccountControllerService) {
  }

  public rank(page: number, size: number): Promise<ListUserRankResponse> {
    return firstValueFrom(this.userAccountControllerService.rankList(page, size));
  }

  public get(): Promise<ReadUserResponse> {
    return firstValueFrom(this.userAccountControllerService.read1());
  }

  public update(request: UpdateUserRequest) {
    return firstValueFrom(this.userAccountControllerService.update(request));
  }

}
