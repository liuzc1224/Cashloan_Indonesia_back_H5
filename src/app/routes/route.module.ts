import { NgModule } from '@angular/core';
import { RouteRoutingModule } from './routes-routing.module';
import { ShareModule } from '../share/share.module';
@NgModule({
    imports: [
        ShareModule,
        RouteRoutingModule
    ],
    exports : [RouteRoutingModule]
})
export class RoutesModule {}
