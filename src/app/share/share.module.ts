import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


import { TableComponent } from './table/table.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LeaveGuardService } from '../usr/leave.guard';

import {
  SessionStorageService,
  LocalStorageService
} from '../service/storage';

import {
  DefaultComponent,
  LayoutComponent,
  SideMenuComponent,
  TagNavComponent,
} from '../layout';

import { nullPipe, dateFormatPipe, EduPipe, SexPipe, MarryPipe, SecondsPipe, StatusPipe, PayTypePipe, paymentResult, OrderStatusPipe, WellPipe, RelationPipe, PayMoneyPipe, IncSouPipe, SocialRolePipe, PlacePipe, accountTypePipe, reviewOrderPipe } from '../pipe';

import { LoginComponent } from '../login/login.component';

import { RecordComponent } from '../record/record/record.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoginInterceptor } from '../interceptor.service';

import { BasicInfoComponent } from './basic-info/basicInfo.component';

import { ListComponent } from '../order/list/list.component'

import { ApproveComponent } from './approve/approve.component';

import { AuthComponent } from './auth/auth.component'

import { UsrAuthComponent } from '../usr/auth/auth.component';
import { letterComponent } from './letter/letter.component';
// import { authDetail } from './authDetail/authDetail.component';
const commonComponents = [
  TableComponent,
  DefaultComponent,
  LayoutComponent,
  SideMenuComponent,
  LoginComponent,
  TagNavComponent,
  BasicInfoComponent,
  ApproveComponent,
  AuthComponent,
  RecordComponent,
  UsrAuthComponent,
  letterComponent,
  ListComponent,
  // authDetail
];

const pipes = [
  nullPipe,
  dateFormatPipe,
  EduPipe,
  SexPipe,
  MarryPipe,
  SecondsPipe,
  StatusPipe,
  PayTypePipe,
  paymentResult,
  OrderStatusPipe,
  WellPipe,
  RelationPipe,
  PayMoneyPipe,
  IncSouPipe,
  SocialRolePipe,
  PlacePipe,
  accountTypePipe,
  reviewOrderPipe,
];

const services = [
  SessionStorageService,
  LocalStorageService,
  LeaveGuardService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    TranslateModule
  ],
  declarations: [
    ...commonComponents,
    ...pipes
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...commonComponents,
    NgZorroAntdModule,
    ...pipes,
    TranslateModule

  ],
  providers: [
    ...services,
    { provide: HTTP_INTERCEPTORS, useClass: LoginInterceptor, multi: true }
  ]
})
export class ShareModule {
}
