import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { LoanListComponent } from './management/loanList/loanList.component' ;
import { RepayComponent } from './management/repay/repay.component' ;
import { AbnormalComponent } from './abnormal/abnormal.component' ;


import { FinancialDataComponent } from './report/financialData/financialData.component' ;
import { LoanRecordComponent } from './report/loanRecord/loanRecord.component' ;
import { RepaymentRecordComponent } from './report/repaymentRecord/repaymentRecord.component' ;
import { AccountMonitoringComponent } from './report/accountMonitoring/accountMonitoring.component' ;
import { RepaymentNoticeComponent } from './management/repaymentNotice/repaymentNotice.component' ;
import { abnormalLendingComponent } from './report/abnormalLending/abnormalLending.component' ;
import { abnormalRepaymentComponent } from './report/abnormalRepayment/abnormalRepayment.component' ;
const routes  : Routes = [
  {
    path : "report" ,
    data : {
      reuse : true ,
      title : "财务报表"
    },
    children:[
      {
        path : "financialData" ,
        component : FinancialDataComponent ,
        data : {
          reuse : true ,
          title : "财务数据"
        }
      },
      {
        path : "loanRecord" ,
        component : LoanRecordComponent ,
        data : {
          reuse : true ,
          title : "放款记录"
        }
      },
      {
        path : "abnormalLending" ,
        component : abnormalLendingComponent ,
        data : {
          reuse : true ,
          title : "异常放款记录"
        }
      },
      {
        path : "repaymentRecord" ,
        component : RepaymentRecordComponent ,
        data : {
          reuse : true ,
          title : "还款记录"
        }
      },
      {
        path : "abnormalRepayment" ,
        component : abnormalRepaymentComponent ,
        data : {
          reuse : true ,
          title : "还款记录异常"
        }
      },
      {
        path : "accountMonitoring" ,
        component : AccountMonitoringComponent ,
        data : {
          reuse : true ,
          title : "支付平台账户监测"
        }
      },
    ]
  },
  {
    path: "management",
    data: {
      reuse: true,
      title: "财务管理台"
    },
    children:[
      {
        path : "loanList" ,
        component : LoanListComponent ,
        data : {
          reuse : true ,
          title : "放款管理"
        }
      },
      {
        path : "repayList" ,
        component : RepayComponent ,
        data : {
          reuse : true ,
          title : "还款管理"
        }
      },
      {
        path : "repaymentNotice" ,
        component : RepaymentNoticeComponent ,
        data : {
          reuse : true ,
          title : "还款告知"
        }
      },
    ]
  },
  //
  // {
  //     path : "loanList" ,
  //     component : LoanListComponent ,
  //     data : {
  //         reuse : true ,
  //         title : "Administración de prestar"
  //     }
  // },
  // {
	// 	path : "repayList" ,
	// 	component : RepayComponent ,
	// 	data : {
	// 		reuse : true ,
	// 		title : "Administración de pagar"
	// 	}
	// },
  {
    path : "abnormal" ,
    component : AbnormalComponent ,
    data : {
      reuse : true ,
      title : "abnormal"//异常管理
    }
  }
];

const component = [
	LoanListComponent ,
	RepayComponent,
  AbnormalComponent,
  FinancialDataComponent,
  LoanRecordComponent,
  RepaymentRecordComponent,
  AccountMonitoringComponent,
  RepaymentNoticeComponent,
  abnormalLendingComponent,
  abnormalRepaymentComponent
];

@NgModule({
	declarations : [
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
export class FinanceModule{ }
