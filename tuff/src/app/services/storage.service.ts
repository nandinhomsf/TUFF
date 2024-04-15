import {TokenModel} from "../models/token.model";
import {TokenDto} from "../openapi";

export class StorageService {

  private tokenStrToDto(tokenDtoStr: string): TokenDto {
    return JSON.parse(tokenDtoStr);
  }

  public getToken(): TokenModel | undefined {
    const tokenDtoStr = localStorage.getItem("tokenModel");
    if (tokenDtoStr == null) {
      return;
    }

    const tokenDto = this.tokenStrToDto(tokenDtoStr);
    return new TokenModel(tokenDto.login, tokenDto.token, tokenDto.roles, new Date(tokenDto.expiration));
  }

  public setToken(token: TokenDto) {
    localStorage.setItem("tokenModel", JSON.stringify(token));
  }

}
