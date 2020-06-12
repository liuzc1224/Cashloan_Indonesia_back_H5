
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ShareModule } from '../share/share.module';
import { RouterModule, Router, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
// import { ListComponent } from './list/list.component'
import { OrderListComponent } from './orderList/orderList.component'
import { RepaymentCodeComponent } from './repaymentCode/repaymentCode.component'
const routes: Routes = [
	{
		path: "detail",
		component: DetailComponent,
		data: {
			reuse: false,
			title: "详情"
		}
	}, {
		path: "orderList",
		component: OrderListComponent,
		data: {
			reuse: true,
			title: "列表"
		}
	}, {
    path: "repaymentCode",
    component: RepaymentCodeComponent,
    data: {
      reuse: false,
      title: "还款码管理"
    }
  }
];

const component = [
	DetailComponent,
	OrderListComponent,
	RepaymentCodeComponent
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
export class OrderModule { };
