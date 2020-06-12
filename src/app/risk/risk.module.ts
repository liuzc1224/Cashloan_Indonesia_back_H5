import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { riskListComponent } from './riskList/riskList.component';
import { riskSettingComponent } from './BusinessConfig/riskSetting/riskSetting.component';
import { riskOperaCommon } from './riskWorkbench/commissioner/riskOperaCommon/riskOperaCommon.component';
import { riskAttendanceComponent } from './riskWorkbench/commissioner/riskAttendance/riskAttendance.component';
import { riskReviewComponent } from './BusinessConfig/riskReview/riskReview.component';


import { LetterReviewComponent } from './BusinessConfig/letterReview/letterReview.component';
import { MachineReviewComponent } from './BusinessConfig/machineReview/machineReview.component';
import { ManualReviewComponent } from './BusinessConfig/manualReview/manualReview.component';

import { ConversionComponent } from './riskManagement/riskReport/conversion/conversion.component';
import { PerformanceComponent } from './riskManagement/riskReport/performance/performance.component';
import { PhaseDataComponent } from './riskManagement/riskReport/phaseData/phaseData.component';
import { RecordComponent } from './riskManagement/riskReport/record/record.component';
import { LetterRecordComponent } from './riskManagement/riskReport/letterRecord/letterRecord.component';
import { ThirdPartyComponent } from './riskManagement/riskReport/thirdParty/thirdParty.component';
import { MachineReviewRefuseComponent } from './riskManagement/riskReport/machineReviewRefuse/machineReviewRefuse.component';
import { RefusalComponent } from './riskManagement/riskReport/refusal/refusal.component';
import { LetterReviewOrderComponent } from './riskManagement/letterReviewOrder/letterReviewOrder.component';
import { LetterReviewMemberComponent } from './riskManagement/letterReviewMember/letterReviewMember.component';
import { AttendanceRecordComponent } from './riskWorkbench/administrator/attendanceRecord/attendanceRecord.component';
import { AuditedListComponent } from './riskWorkbench/administrator/auditedList/auditedList.component';
import { blackListComponent } from './blackList/blackList.component';


const routes  : Routes = [
  {
    path:'businessConfig',
    data : {
      reuse : true ,
      title : "风控业务配置"
    },
    children:[
      {
        path : "riskSetting" ,
        component : riskSettingComponent ,
        data : {
          reuse : false ,
          title : "用户认证业务参数配置"
        }
      },
      {
        path : "riskReview" ,
        component : riskReviewComponent ,
        data : {
          reuse : false ,
          title : "机审业务参数配置"
        }
      },
      {
        path : "machineReview" ,
        component : MachineReviewComponent ,
        data : {
          reuse : false ,
          title : "机审业务流程配置"
        }
      },
      {
        path : "manualReview" ,
        component : ManualReviewComponent ,
        data : {
          reuse : false ,
          title : "人工审核业务流程配置"
        }
      },
      {
        path : "letterReview" ,
        component : LetterReviewComponent ,
        data : {
          reuse : false ,
          title : "信审工作配置"
        }
      },
    ]
  },
  {
    path:'riskManagement',
    data : {
      reuse : true ,
      title : "风控管理"
    },
    children:[
      {
        path:'riskReport',
        data : {
          reuse : true ,
          title : "风控报表"
        },
        children:[
          {
            path : "thirdParty" ,
            component : ThirdPartyComponent ,
            data : {
              reuse : true ,
              title : "第三方接口调用"
            }
          },
          {
            path : "phaseData" ,
            component : PhaseDataComponent ,
            data : {
              reuse : true ,
              title : "信审阶段审核数据"
            }
          },
          {
            path : "conversion" ,
            component : ConversionComponent ,
            data : {
              reuse : true ,
              title : "信审订单转化报表"
            }
          },
          {
            path : "performance" ,
            component : PerformanceComponent ,
            data : {
              reuse : true ,
              title : "考勤绩效"
            }
          },
          {
            path : "record" ,
            component : RecordComponent ,
            data : {
              reuse : true ,
              title : "考勤记录"
            }
          },
          {
            path : "machineReviewRefuse" ,
            component : MachineReviewRefuseComponent ,
            data : {
              reuse : true ,
              title : "机审拒绝理由统计数据"
            }
          },
          {
            path : "refusal" ,
            component : RefusalComponent ,
            data : {
              reuse : true ,
              title : "人审拒绝理由统计数据"
            }
          },
          {
            path : "letterRecord" ,
            component : LetterRecordComponent ,
            data : {
              reuse : true ,
              title : "信审记录明细"
            }
          }
        ]
      },
      {
        path : "letterReviewOrder" ,
        component : LetterReviewOrderComponent ,
        data : {
          reuse : true ,
          title : "信审订单管理"
        }
      },
      {
        path : "letterReviewMember" ,
        component : LetterReviewMemberComponent ,
        data : {
          reuse : true ,
          title : "信审成员管理"
        }
      }
    ]
  },
  {
    path: 'riskWorkbench',
    data: {
      reuse: true,
      title: "信审工作台"
    },
    children: [
      {
        path : "administrator" ,
        data : {
          reuse: true,
          title: "信审小组管理员"
        },
        children:[
          {
            path : "auditedList" ,
            component :  AuditedListComponent,//attendanceRecord.component
            data : {
              reuse : true ,
              title : "组内已审核列表"
            }
          },
          {
            path : "attendanceRecord" ,
            component :  AttendanceRecordComponent,
            data : {
              reuse : true ,
              title : "组内考勤记录"
            }
          }
        ]
      },
      {
        path : "commissioner" ,
        data : {
          reuse : true ,
          title : "信审专员"
        },
        children:[
          {
            path : "operPlatCommon" ,
            component : riskOperaCommon ,
            data : {
              reuse : true ,
              title : "信审工作台(专员)"
            }
          },{
            path : "riskAttendance" ,
            component : riskAttendanceComponent ,
            data : {
              reuse : true ,
              title : "考勤"
            }
          }
        ]
      }
    ]
  },
  {
      path : "list" ,
      component : riskListComponent ,
      data : {
          reuse : true ,
          title : "风控列表"
      }
  },
  {
    path : "blackList" ,
    component : blackListComponent ,
    data : {
      reuse : true ,
      title : "自定义征信黑名单"
    }
  }
];

const component = [
	riskListComponent ,
    riskSettingComponent,
    riskOperaCommon,
    riskAttendanceComponent,
    riskReviewComponent,
  LetterReviewComponent,
  MachineReviewComponent,
  ManualReviewComponent,
  ConversionComponent,
  PerformanceComponent,
  PhaseDataComponent,
  RecordComponent,
  ThirdPartyComponent,
  LetterReviewOrderComponent,
  LetterReviewMemberComponent,
  AuditedListComponent,
  AttendanceRecordComponent,
  blackListComponent,
  MachineReviewRefuseComponent,
  RefusalComponent,
  LetterRecordComponent
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
export class RiskModule{ }
