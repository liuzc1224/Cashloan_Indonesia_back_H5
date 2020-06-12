import { Injectable } from '@angular/core'
import { CanDeactivate, ActivatedRouteSnapshot } from '@angular/router'
import { DetailComponent } from './detail/detail.component'
import { Observable } from 'rxjs';
import { RiskListService } from '../service/risk';

@Injectable()
export class LeaveGuardService implements CanDeactivate<DetailComponent>{
    constructor(
        private service: RiskListService
    ) { }
    canDeactivate(c: DetailComponent, router : ActivatedRouteSnapshot): Observable<boolean> {
        // console.log('router',router);
        return new Observable(obser => {
            obser.next(true)
        });
    };
};
