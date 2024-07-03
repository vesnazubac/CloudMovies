import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken: any = localStorage.getItem('idToken');
    
    const skipHeader = req.headers.get('skip');
    // ako je postavljeno skip zaglavlje, ne postavljaj Authorization zaglavlje
    if (skipHeader === 'true') {
      const headers = req.headers.delete('Authorization');
      const cloned = req.clone({ headers });
      return next.handle(cloned);
    }
    // ako je postavljen skip header, ne postavljaj Authorization header

    if (accessToken) {
      const cloned = req.clone({
       headers: req.headers.set('Authorization', 'Bearer ' + accessToken),
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
