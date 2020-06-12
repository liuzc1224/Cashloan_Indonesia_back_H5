import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { platformCurrentDataComponent } from './platformCurrentData/platformCurrentData.component';
import { platformConversionDataComponent } from './platformConversionData/platformConversionData.component';
import { PlatformUsersBuriedComponent } from './platformUsersBuried/platformUsersBuried.component';
import { NgxEchartsModule } from "ngx-echarts";

const routes  : Routes = [
  {
      path : "platformCurrentData" ,
      component : platformCurrentDataComponent ,
      data : {
          reuse : false ,
          title : "平台当前数据"
      }
  },
  {
    path : "platformConversionData" ,
    component : platformConversionDataComponent ,
    data : {
      reuse : false ,
      title : "平台转化数据"
    }
  },
  {
    path : "platformUsersBuried" ,
    component : PlatformUsersBuriedComponent ,
    data : {
      reuse : false ,
      title : "平台用户埋点"
    }
  }
];

const component = [
  platformCurrentDataComponent ,
  platformConversionDataComponent,
  PlatformUsersBuriedComponent,
];

@NgModule({
	declarations : [
		...component
	],
	imports: [
    ShareModule,
		NgZorroAntdModule,
    RouterModule.forChild(routes),
    NgxEchartsModule
	],
	providers: [],
	bootstrap: []
})
export class ReportCenterModule{ }
