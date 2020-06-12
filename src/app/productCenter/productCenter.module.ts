import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import {UserLevelComponent} from './userLevel/userLevel.component';
import {ProductComponent} from './product/product.component';
import {ContractComponent} from './contract/contract.component';
import {CKEditorModule} from 'ng2-ckeditor';

import {versionUpdateComponent} from "./appConfig/versionUpdate/versionUpdate.component";
import {CalendarComponent} from "./appConfig/calendar/calendar.component";
import {HelpCenterComponent} from "./appConfig/helpCenter/helpCenter.component";
import {SMSTemplateComponent} from "./appConfig/SMSTemplate/SMSTemplate.component";
import {PushTemplateComponent} from "./appConfig/pushTemplate/pushTemplate.component";
import {ContactInfoComponent} from "./appConfig/contactInfo/contactInfo.component";
import {BankManagementComponent} from "./appConfig/bankManagement/bankManagement.component";


const routes  : Routes = [
  {
    path : "product" ,
    component : ProductComponent ,
    data : {
      reuse : false ,
      title : "贷款产品管理"
    }
  },
  {
    path: "userLevel",
    component: UserLevelComponent,
    data: {
      reuse : false ,
      title : "用户等级管理"
    }

  },
  {
    path : "contract" ,
    component : ContractComponent ,
    data : {
      reuse : false ,
      title : "合同管理"
    }
  },
  {
    path : "appConfig" ,
    data : {
      reuse : false ,
      title : "APP配置"
    },
    children:[
      {
        path : "versionUpdate" ,
        component : versionUpdateComponent ,
        data : {
          reuse : false ,
          title : "版本更新"
        }
      },
      {
        path : "calendar" ,
        component : CalendarComponent ,
        data : {
          reuse : false ,
          title : "工作日历管理"
        }
      },
      {
        path: "helpCenter",
        component: HelpCenterComponent,
        data: {
          reuse: true,
          title: "帮助中心"
        }
      },
      {
        path: "SMSTemplate",
        component: SMSTemplateComponent,
        data: {
          reuse: true,
          title: "短信模板"
        }
      },
      {
        path: "pushTemplate",
        component: PushTemplateComponent,
        data: {
          reuse: true,
          title: "push推送模板"
        }
      },
      {
        path: "contactInfo",
        component: ContactInfoComponent,
        data: {
          reuse: true,
          title: "联系方式"
        }
      }, {
        path: "bankManagement",
        component: BankManagementComponent,
        data: {
          reuse: true,
          title: "银行管理"
        }
      }
    ]
  }
];
const component = [
  ProductComponent,
  UserLevelComponent ,
  ContractComponent,
  CalendarComponent,
  HelpCenterComponent,
  SMSTemplateComponent,
  PushTemplateComponent,
  ContactInfoComponent,
  BankManagementComponent,
  versionUpdateComponent
];
@NgModule({
  declarations : [
    ...component
  ],
  imports: [
    ShareModule,
    CKEditorModule,
    NgZorroAntdModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: []
})
export class ProductCenterModule{ };
