import {Injectable} from "@angular/core";
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from "@angular/common/http";
import { Observable } from "rxjs";
import {StorageService} from "../services/storage.service";


@Injectable()
export class APIInterceptor implements HttpInterceptor {

  constructor(private storageService: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storageService.getToken();
    if (token) {
      req.headers.append(token.getAuthenticationKey(), token.getAuthenticationValue());
    }

    return next.handle(req);
  }

}
