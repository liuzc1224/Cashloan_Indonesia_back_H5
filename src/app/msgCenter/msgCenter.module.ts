import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ShareModule } from '../share/share.module';
import { RouterModule, Router, Routes } from '@angular/router';
import { RepaymentComponent } from './repayment/repayment.component'
const routes: Routes = [
  {
    path: "repayment",
    component: RepaymentComponent,
    data: {
      reuse: true,
      title: "还款信息"
    }
  }
];

const component = [
  RepaymentComponent
];

@NgModule({
  declarations: [
    ...component
  ],
  imports: [
    ShareModule,
    NgZorroAntdModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: []
})
export class MsgCenterModule { }
