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

  public static userAdmin(): boolean {
    const roles = this.getUser()?.roles;

    return !!roles && roles.includes("ADMIN");
  }

  public static setUser(user: UserDto) {
    localStorage.setItem("userDto", JSON.stringify(user));
  }

  public static removeUser() {
    localStorage.removeItem("userDto");
    localStorage.removeItem("tokenModel");
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
