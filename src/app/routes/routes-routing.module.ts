import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { RouteguardService } from './route-guard';
import { ErrorPageComponent } from './errorPage.component';
import { DefaultComponent } from '../layout/default/default.component';
import { SimpleReuseStrategy } from './router-strategy';
import { LoginComponent } from '../login/login.component';
import {
    RouteReuseStrategy,
    DefaultUrlSerializer,
    ActivatedRouteSnapshot,
    DetachedRouteHandle,
} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [{
            path: "default",
            component: DefaultComponent
        }, {
            path: "system",
            loadChildren: 'src/app/system/system.module#SystemModule'
        }, {
            path: 'finance',
            loadChildren: "src/app/finance/finance.module#FinanceModule"
        }, {
            path: "usr",
            loadChildren: "src/app/usr/usr.module#UsrModule"
        }, {
            path: "risk",
            loadChildren: "src/app/risk/risk.module#RiskModule"
        }, {
            path: "order",
            loadChildren: "src/app/order/order.module#OrderModule"
        }, {
            path: "statistics",
            loadChildren: "src/app/statistics/statistics.module#StatisticsModule"
        }, {
            path : "bank" ,
            loadChildren : "src/app/bank/bank.module#BankModule"
        }, {
            path : "operationsCenter" ,
            loadChildren : "src/app/operationsCenter/operationsCenter.module#OperationsCenterModule"
        }, {
            path: "reportCenter",
            loadChildren: "src/app/reportCenter/reportCenter.module#ReportCenterModule"
        }, {
            path: "productCenter",
            loadChildren: "src/app/productCenter/productCenter.module#ProductCenterModule"
        }, {
            path: "collectionCenter",
            loadChildren: "src/app/collectionCenter/collectionCenter.module#CollectionCenterModule"
        }, {
            path: "msgCenter",
            loadChildren: "src/app/msgCenter/msgCenter.module#MsgCenterModule"
        }],
        canActivate: [RouteguardService]
    }, {
        path: "login",
        component: LoginComponent
    }, {
        path: "error/:code",
        component: ErrorPageComponent
    }
];

@NgModule({
    declarations: [ErrorPageComponent],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        RouteguardService,
        // { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }
    ]
})
export class RouteRoutingModule { };
// { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }
