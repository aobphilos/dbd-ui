import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { IndicatorService } from '../../ui/indicator/indicator.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class BusyInterceptor implements HttpInterceptor {

    constructor(private indicatorService: IndicatorService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        let statusMessage: string;

        this.indicatorService.showBusy();
        return next.handle(req)
            .pipe(
                tap(
                    // Succeeds when there is a response; ignore other events
                    (event) => statusMessage = event instanceof HttpResponse ? 'succeeded' : '',
                    // Operation failed; error is an HttpErrorResponse
                    (error) => statusMessage = 'failed'
                ),
                finalize(() => {
                    this.indicatorService.hideBusy();
                })
            );
    }
}
