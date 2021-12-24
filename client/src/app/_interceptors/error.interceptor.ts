import { BasketService } from 'src/app/_services/basket.service';
import { AccountService } from 'src/app/_services/account.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,private accountService: AccountService,private basketService: BasketService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              this.router.navigateByUrl("error");
              this.accountService.logout2();
              this.basketService.deleteBasket();
              break;
            case 401:
              this.router.navigateByUrl("error");
              this.accountService.logout2();
              this.basketService.deleteBasket();
              break;
            case 404:
              this.router.navigateByUrl("error");
              this.accountService.logout2();
              this.basketService.deleteBasket();
              break;
            case 500:
              this.router.navigateByUrl("error");
              this.accountService.logout2();
              this.basketService.deleteBasket();
              break;
            default:
              // this.router.navigateByUrl("error");
              // this.accountService.logout2();
              this.basketService.deleteBasket();
              break;
          }
        }
        return throwError(error);
      })
    )
  }
}