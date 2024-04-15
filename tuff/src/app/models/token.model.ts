export class TokenModel {

  private readonly login: string;
  private readonly token: string;
  private readonly roles: string[];
  private readonly expiration: Date;

  constructor(login: string, token: string, roles: string[], expiration: Date) {
    this.login = login;
    this.token = token;
    this.roles = roles;
    this.expiration = expiration;
  }

  public getLogin(): string {
    return this.login;
  }

  public getRoles(): string[] {
    return this.roles;
  }

  public getExpiration(): Date {
    return this.expiration;
  }

  public getAuthenticationKey(): string {
    return "Authorization";
  }

  public getAuthenticationValue(): string {
    return `Bearer ${this.token}`;
  }

}
