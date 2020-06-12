import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ParaModel } from './paraModel';
import { Adaptor } from '../../share/tool';
import { TableData } from '../../share/table/table.model';
import {dataFormat, accountTypetransform, unixTime} from '../../format';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { BasicInfoComponent } from '../../share/basic-info/basicInfo.component';
import { ApproveComponent } from '../../share/approve/approve.component';
import { AuthComponent } from '../../share/auth/auth.component'
import { RecordComponent } from '../../record/record/record.component';
import { OrderService, UserService } from '../../service/order';
import { filter } from 'rxjs/operators'
import { SessionStorageService } from '../../service/storage';
import { Router } from '@angular/router';
let __this;
@Component({
  selector: "",
  templateUrl: "./detail.component.html",
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private routerInfo: ActivatedRoute,
    private orderSer: OrderService,
    private sgo: SessionStorageService,
    private usrSer: UserService,
    private router: Router
  ) { };
  loanOrderInfoData: any;
  withdrawalInfoData: any = [];
  loanData: any = [];
  repaymentData: any = [];
  streamData: any = [];
  para : any;
  tobefore :string;
  toafter :string;
  ngOnInit() {
    this.translateSer.stream(["orderDetail" , 'common'])
    .subscribe(
        data => {
          // console.log(data)
            this.tobefore=data['orderDetail']['tobefore']
            this.toafter=data['orderDetail']['toafter']
        }
    );
    this.routerInfo.queryParams
      .subscribe(
        (para) => {
          // console.log(para)
          this.para = para;
          this.initOrderTableData(this.para['order']);
          this.initAccountInfoData(this.para['order']);
          this.initRepaymentInfoData(this.para['order']);
          this.initLoanInfoData(this.para['order']);
          this.initStreamInfoData(this.para['order']);
        }
      );
  }
  //订单详情
  initOrderTableData(orderId : number | string) {
    this.orderSer.orderDetail(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            this.loanOrderInfoData = res.data;
            console.log(this.loanOrderInfoData,'loanOrderInfoData');
          } else {
            this.msg.fetchFail(res.message);
          }
        }
      )
  }

  //取款账户信息
  initAccountInfoData(orderId : number | string){
    this.orderSer.bankcardByOrderId(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            this.withdrawalInfoData = res.data;
            console.log(this.withdrawalInfoData,'withdrawalInfoData');

            // data[0]['accountType'] = accountTypetransform(data[0]['accountType']);

          } else {
            this.msg.fetchFail(res.message);
          }
        }
      )
  }

  //放款详情 & 放款流水
  initLoanInfoData(orderId : number | string){
    this.orderSer.loan(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            this.loanData = res.data;
            console.log(this.loanData,'loanData');
            // data[0]['accountType'] = accountTypetransform(data[0]['accountType']);
          } else {
            this.msg.fetchFail(res.message);
          }
        }
      )
  }

  //还款详情
  initRepaymentInfoData(orderId : number | string){
    this.orderSer.repayment(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            this.repaymentData = res.data;
            console.log(this.repaymentData,'repaymentData');
            // data[0]['accountType'] = accountTypetransform(data[0]['accountType']);
          } else {
            this.msg.fetchFail(res.message);
          }
        }
      )
  }

  //还款流水
  initStreamInfoData(orderId : number | string){
    this.orderSer.getStream(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            console.log(res.data)
            this.streamData = res.data;
            console.log(this.streamData,'streamData');
          } else {
            this.msg.fetchFail(res.message);
          }
        }
      )
  }
  dateToString(data){
    if(data){
      return unixTime(new Date(data));
    }else {
      return;
    }
  }

  toRepaymentCode(orderid){
    // console.log(orderid)
    this.sgo.set("routerInfo" , {
      parentName :this.tobefore,
      menuName :this.toafter
  }) ;
    this.router.navigate(['/order/repaymentCode'], {
      queryParams: {
        orderid:orderid
      }
    });
  }

}
