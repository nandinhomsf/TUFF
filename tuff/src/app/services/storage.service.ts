import {TokenModel} from "../models/token.model";
import {TokenDto, UserDto} from "../openapi";

export class StorageService {

  private static tokenStrToDto(tokenDtoStr: string): TokenDto {
    return JSON.parse(tokenDtoStr);
  }

  public static getUser(): UserDto | undefined {
    const userDtoStr = localStorage.getItem("userDto");
    if (userDtoStr === null) {
      return;
    }

    return JSON.parse(userDtoStr);
  }

  public static userLogin(): string  {
    const login = this.getToken()?.getLogin();
    if (login === undefined) {
      throw new Error("Invalid usage of userLogin()");
    }

    return login;
  }

  public static setUser(user: UserDto) {
    localStorage.setItem("userDto", JSON.stringify(user));
  }

  public static getToken(): TokenModel | undefined {
    const tokenDtoStr = localStorage.getItem("tokenModel");
    if (tokenDtoStr === null) {
      return;
    }

    const tokenDto = this.tokenStrToDto(tokenDtoStr);
    return new TokenModel(tokenDto.login, tokenDto.token, tokenDto.roles, new Date(tokenDto.expiration));
  }

  public static setToken(token: TokenDto) {
    localStorage.setItem("tokenModel", JSON.stringify(token));
  }

}
