import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import {CollectionBusinessComponent} from './collectionBusiness/collectionBusiness.component';
import {CaseManagementComponent} from './collectionManagement/caseManagement/caseManagement.component';
import {MemberManagementComponent} from './collectionManagement/memberManagement/memberManagement.component';
import {RecordComponent} from './collectionManagement/record/record.component';
import {ReportComponent} from './collectionManagement/report/report.component';
import {AmountBreakdownComponent} from './collectionManagement/amountBreakdown/amountBreakdown.component';
import {StageReportComponent} from './collectionManagement/stageReport/stageReport.component';
import {GroupReportComponent} from './collectionManagement/groupReport/groupReport.component';
import {CollectionWorkbenchComponent} from './collectionWorkbench/collectionWorkbench.component';
import {CollectionManagebenchComponent} from './collectionManagebench/collectionManagebench.component';
import {CollectDetailComponent} from './collectDetail/collectDetail.component';
import {TeamPerformanceComponent} from './teamPerformance/teamPerformance.component';
const routes  : Routes = [
  {
    path : "collectionBusiness" ,
    component : CollectionBusinessComponent ,
    data : {
      reuse : false ,
      title : "催收业务配置"
    }
  },
  {
    path: "report",
    component: ReportComponent,
    data: {
      reuse : false ,
      title : "催收数据总览"
    },
  },
  {
    path: "groupReport",
    component: GroupReportComponent,
    data: {
      reuse : false ,
      title : "催收小组报表"
    },
  },
  {
    path: "stageReport",
    component: StageReportComponent,
    data: {
      reuse : false ,
      title : "催收阶段报表"
    },
  },
  {
    path: "amountBreakdown",
    component: AmountBreakdownComponent,
    data: {
      reuse : false ,
      title : "催回金额明细"
    },
  },
  {
    path: "caseManagement",
    component: CaseManagementComponent,
    data: {
      reuse : false ,
      title : "催收案件管理"
    },
  },
  {
    path: "record",
    component: RecordComponent,
    data: {
      reuse : false ,
      title : "催收记录-通话记录"
    },
  },
  {
    path: "memberManagement",
    component: MemberManagementComponent,
    data: {
      reuse : false ,
      title : "催收成员管理-催收人员管理"
    },
  },
  {
    path : "collectionWorkbench" ,
    component : CollectionWorkbenchComponent ,
    data : {
      reuse : false ,
      title : "催收工作台"
    }
  },
  {
    path : "collectionManagebench" ,
    component : CollectionManagebenchComponent ,
    data : {
      reuse : false ,
      title : "催收管理台"
    }
  },
  {
    path : "collectDetail" ,
    component : CollectDetailComponent ,
    data : {
      reuse : false ,
      title : "催收详情"
    }
  },
  {
    path : "teamPerformance" ,
    component : TeamPerformanceComponent ,
    data : {
      reuse : false ,
      title : "小组绩效"
    }
  }
];
const component = [
  CollectionBusinessComponent,
  CollectionWorkbenchComponent,
  ReportComponent,
  CaseManagementComponent,
  AmountBreakdownComponent,
  RecordComponent,
  MemberManagementComponent,
  CollectionManagebenchComponent,
  CollectDetailComponent,
  TeamPerformanceComponent,
  StageReportComponent,
  GroupReportComponent
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
export class CollectionCenterModule{ }
