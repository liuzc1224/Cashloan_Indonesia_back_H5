import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ShareModule } from '../share/share.module';
import { RouterModule, Router, Routes } from '@angular/router';
import { ListComponent } from './list/list.component'
import { DetailComponent } from './detail/detail.component';
import { UsrAuthComponent } from './auth/auth.component';
import { LeaveGuardService } from './leave.guard';
import { authDetail } from './authDetail/authDetail.component';
import { bankDetailComponent } from './bankDetail/bankDetail.component';
import { AccountComponent } from './account/account.component';
const routes: Routes = [
	{
		path: "list",
		component: ListComponent,
		data: {
			reuse: true,
			title: "用户列表"
		}
	}, {
		path: "detail",
		component: DetailComponent,
		data: {
			reuse: false,
			title: "详情"
		}
	}, {
		path: "auth",
		component: UsrAuthComponent,
		data: {
			reuse: false,
			title: "用户详情"
		},
		canDeactivate: [LeaveGuardService]
	}, {
		path: "authDetail",
		component: authDetail,
		data: {
			reuse: false,
			title: "认证详情"
		}
		// canDeactivate: [LeaveGuardService]
	},  {
		path: "bankDetail",
		component: bankDetailComponent,
		data: {
			reuse: false,
			title: "银行卡详情"
		}
		// canDeactivate: [LeaveGuardService]
	}, {
    path: "account",
    component: AccountComponent,
    data: {
      reuse: false,
      title: "账户详情"
    }
  }
];

const component = [
	ListComponent,
	DetailComponent,
	authDetail,
	bankDetailComponent,
  	AccountComponent
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
export class UsrModule { };
