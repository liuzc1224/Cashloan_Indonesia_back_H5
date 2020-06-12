import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import {Channelh5Component} from './channel/h5/channelh5.component';
import { ChannelBranchComponent } from './channel/channelBranch/channelBranch.component';
import {ChannelListComponent} from "./channel/channelList/channelList.component"
import {QRCodeModule} from 'angular2-qrcode';
import {ChannelListDataComponent} from "./channelData/channelListData/channelListData.component"
import {ChannelAfDataComponent} from "./channelData/channelAfData/channelAfData.component"
import {ChannelAfDailyDataComponent} from "./channelData/channelAfDailyData/channelAfDailyData.component"
import {ChannelH5DataComponent} from "./channelData/channelH5Data/channelH5Data.component"
import {RecommendComponent} from "./appMarketing/recommend/recommend.component";
import {PopUpsComponent} from "./appMarketing/adPush/Pop-ups/Pop-ups.component";
import {SplashScreenComponent} from "./appMarketing/adPush/splashScreen/splashScreen.component";
import {FeedBackComponent} from "./messageManagement/feedBack/feedBack.component";
import { PushComponent } from "./messageManagement/msgPush/push/push.component";
import { BulletinComponent } from "./messageManagement/msgPush/bulletin/bulletin.component";
import {ListComponent} from "./coupon/list/list.component";
import {SettingComponent} from "./coupon/setting/setting.component";



const routes  : Routes = [
  {
    path:'channel',
    data : {
      title : "渠道管理"
    },
    children:[
      {
        path: "channelList",
        component: ChannelListComponent,
        data: {
          reuse: false,
          title: "渠道管理-邀请码"
        }
      },
      {
        path : "h5" ,
        component : Channelh5Component ,
        data : {
          reuse : false ,
          title : "渠道管理-H5"
        }
      },
      {
        path: "channelBranch",
        component: ChannelBranchComponent,
        data: {
          reuse : false ,
          title : "渠道分支"
        }
      },
      {
        path: "channelData",
        data: {
          title : "渠道数据报表"
        },
        children:[
          {
            path: "channelList",
            component: ChannelListDataComponent,
            data: {
              reuse: false,
              title: "渠道数据-邀请码"
            }
          },
          {
            path : "h5" ,
            component : ChannelH5DataComponent ,
            data : {
              reuse : false ,
              title : "渠道数据-H5"
            }
          },
          {
            path: "channelAf",
            component: ChannelAfDataComponent,
            data: {
              reuse : false ,
              title : "渠道数据-AF"
            }
          },
          {
            path: "channelAfDailyData",
            component: ChannelAfDailyDataComponent,
            data: {
              reuse : false ,
              title : "渠道数据-AF每日明细"
            }
          }
        ]
      }
    ],
  },
  {
    path: 'appMarketing',
    data:{
      title:'app营销设置'
    },
    children:[
      {
        path : "recommend" ,
        component : RecommendComponent ,
        data : {
          reuse : false ,
          title : "推荐列表"
        }
      },
      {
        path: 'adPush',
        data:{
          title:'广告推送'
        },
        children:[
          {
            path: "PopUps",
            component: PopUpsComponent,
            data: {
              reuse : false ,
              title : "弹窗广告"
            },
          },
          {
            path: "splashScreen",
            component: SplashScreenComponent,
            data: {
              reuse : false ,
              title : "闪屏广告"
            },
          }
        ]
      }
    ]
  },
  {
    path:'messageManagement',
    data:{
      title:'消息管理'
    },
    children:[
      {
        path: "msgPush",
        data: {
          title: "消息推送"
        },
        children:[
          {
            path: "push",
            component: PushComponent,
            data: {
              reuse: true,
              title: "PUSH推送"
            },
          },
          {
            path: "bulletin",
            component: BulletinComponent,
            data: {
              reuse: true,
              title: "公告"
            },
          }
        ]
      },
      {
        path: "feedBack",
        component: FeedBackComponent,
        data: {
          reuse: false,
          title: "用户意见反馈"
        }
      }
    ]
  },
  {
    path:'coupon',
    data : {
      title : "优惠券"
    },
    children:[
      {
        path : "list" ,
        component : ListComponent ,
        data : {
          reuse : false ,
          title : "优惠券管理"
        }
      },{
        path: "setting",
        component: SettingComponent,
        data: {
          reuse : false ,
          title : "设置优惠券"
        }
      }
    ]
  }
];
const component = [
  ChannelListComponent,
  ChannelBranchComponent,
  Channelh5Component,
  ChannelListDataComponent,
  ChannelAfDataComponent,
  ChannelH5DataComponent,
  RecommendComponent,
  PopUpsComponent,
  FeedBackComponent,
  SplashScreenComponent,
  PushComponent,
  BulletinComponent,
  ListComponent,
  SettingComponent,
  ChannelAfDailyDataComponent
];
@NgModule({
  declarations : [
    ...component
  ],
  imports: [
    ShareModule,
    QRCodeModule,
    NgZorroAntdModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: []
})
export class OperationsCenterModule{ };
