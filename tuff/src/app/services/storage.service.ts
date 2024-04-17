import {TokenModel} from "../models/token.model";
import {TokenDto, UserDto} from "../openapi";

export class StorageService {

  private tokenStrToDto(tokenDtoStr: string): TokenDto {
    return JSON.parse(tokenDtoStr);
  }

  public getUser(): UserDto | undefined {
    const userDtoStr = localStorage.getItem("userDto");
    if (userDtoStr === null) {
      return;
    }

    return JSON.parse(userDtoStr);
  }

  public setUser(user: UserDto) {
    localStorage.setItem("userDto", JSON.stringify(user));
  }

  public getToken(): TokenModel | undefined {
    const tokenDtoStr = localStorage.getItem("tokenModel");
    if (tokenDtoStr === null) {
      return;
    }

    const tokenDto = this.tokenStrToDto(tokenDtoStr);
    return new TokenModel(tokenDto.login, tokenDto.token, tokenDto.roles, new Date(tokenDto.expiration));
  }

  public setToken(token: TokenDto) {
    localStorage.setItem("tokenModel", JSON.stringify(token));
  }

}
