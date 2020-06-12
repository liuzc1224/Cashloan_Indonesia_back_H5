import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {dataFormat} from '../../../format';
import {CommonMsgService} from '../../../service/msg';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage';
import {ObjToArray} from '../../../share/tool';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model';
import {CouponService} from '../../../service/operationsCenter';

let __this;

@Component({
  selector: '',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: CouponService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  tableData: TableData;
  offer: Array<String>;
  receive: Array<String>;
  receiveData: Array<String>;
  activityStatus: Array<String>;
  couponIdname: Array<String>;
  couponIdnameValue: Number = 0;
  Idname: String;
  isDelete: Boolean = false;
  isPush: Boolean = false;
  isRule: Boolean = false;
  isOkLoading: Boolean = false;
  ruleInfo: Array<String>;

  ngOnInit() {
    __this = this;
    this.getLanguage();
  };

  getLanguage() {
    this.translateSer.stream(['coupon.list', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['coupon.list']
          };


          let activity = this.languagePack['list']['couponIdname'];
          this.couponIdname = Object.values(activity);

          let activityStatus = this.languagePack['list']['activityStatus'];
          this.activityStatus = Object.values(activityStatus);

          let offer = this.languagePack['list']['offer'];
          this.offer = Object.values(offer);

          let info = this.languagePack['list']['ruleInfo']['CouponList']['info'];
          this.ruleInfo = Object.values(info);

          let receive = this.languagePack['list']['receive'];
          this.receiveData = this.languagePack['list']['receiveData'];
          this.receive = Object.values(receive);
          this.receive.splice(0, 1);


          this.initialTable();
        }
      );
  };

  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['list']['table']['couponId'],
          reflect: 'id',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['table']['couponName'],
          reflect: 'couponName',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['table']['createTime'],
          reflect: 'createTime ',
          type: 'text',
          filter: (item) => {
            let name;
            const status = item['createTimeToString'];
            name = status;
            // function timestampToTime(timestamp) {
            //   var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            //   var Y = date.getFullYear() + '-';
            //   var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            //   var D = date.getDate() + ' ';
            //   var h = date.getHours() + ':';
            //   var m = date.getMinutes() + ':';
            //   var s = date.getSeconds();
            //   return Y+M+D+h+m+s;
            // }
            return (name) ? name : '';
          }
        },
        {
          name: __this.languagePack['list']['table']['receiveType'],
          reflect: 'obtainType',
          type: 'text',
          filter: (item) => {
            let name;
            const status = item['obtainType'];
            switch (status) {
              case 1: {
                name = __this.languagePack['list']['receive']['initiativeReceive'];
                break;
              }
              case 2: {
                name = __this.languagePack['list']['receive']['systemDistribution'];
                break;
              }
              case 3: {
                name = __this.languagePack['list']['receive']['activityAcquisition'];
                break;
              }
            }
            return (name) ? name : '';
          }
        },
        {
          name: __this.languagePack['list']['table']['offerType'],
          reflect: 'couponType',
          type: 'text',
          filter: (item) => {
            let name;
            const status = item['couponType'];
            switch (status) {
              case 1: {
                name = __this.languagePack['list']['offer']['interestReduction'];
                break;
              }
              case 2: {
                name = __this.languagePack['list']['offer']['interestrateReduction'];
                break;
              }
              case 3: {
                name = __this.languagePack['list']['offer']['dayFree'];
                break;
              }
            }
            return (name) ? name : '';
          }
        },
        {
          name: __this.languagePack['list']['table']['preferentialConditions'],
          reflect: 'couponCondition ',
          // reflect : "conditionsToString" ,
          type: 'text',
          filter: (item) => {
            let name;
            const status = item['couponCondition'];
            const type = item['couponType'];
            if (status) {
              switch (type) {
                case 1: {
                  name = __this.languagePack['list']['setting']['loan'] + status + __this.languagePack['common']['unit'] + '，' + __this.languagePack['list']['setting']['interestReduction'] + item['couponValue'] + __this.languagePack['common']['unit'];
                  break;
                }
                case 2: {
                  name = __this.languagePack['list']['setting']['loan'] + status + __this.languagePack['common']['unit'] + '，' + __this.languagePack['list']['offertips']['interestReduction'] + item['couponValue'].toFixed(2) + '%';
                  break;
                }
                case 3: {
                  name = __this.languagePack['list']['setting']['loan'] + status + __this.languagePack['common']['unit'] + '，' + item['couponDays'] + __this.languagePack['list']['offertips']['dayFree'];
                  break;
                }
              }
            } else {
              switch (type) {
                case 1: {
                  name = __this.languagePack['list']['setting']['nothreshold'] + '，' + __this.languagePack['list']['setting']['interestReduction'] + item['couponValue'] + __this.languagePack['common']['unit'];
                  break;
                }
                case 2: {
                  name = __this.languagePack['list']['setting']['nothreshold'] + '，' + __this.languagePack['list']['offertips']['interestReduction'] + item['couponValue'].toFixed(2) + '%';
                  break;
                }
                case 3: {
                  name = __this.languagePack['list']['setting']['nothreshold'] + '，' + item['couponDays'] + __this.languagePack['list']['offertips']['dayFree'];
                  break;
                }
              }
            }

            return (name) ? name : '';
          }


        },
        {
          name: __this.languagePack['list']['table']['circulation'],
          reflect: 'couponCirculation',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['table']['received'],
          reflect: 'receiveCount',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['table']['used'],
          reflect: 'usedCount',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['table']['effectiveTime'],
          reflect: 'expDays',
          type: 'text',
          filter: (item) => {
            let name;
            if (item['beginDate'] && item['endDate']) {
              let aa = item['beginDate'];
              let bb = item['endDate'];
              name = aa + '---' + bb;
            }

            return (name) ? name : '';
          }
        },
        // {
        //   name: __this.languagePack['list']['table']['validityPeriod'],
        //   reflect: 'validityPeriod',
        //   type: 'text',
        //   filter: (item) => {
        //     let name;
        //     const status = item['expDays'];
        //     name = status;
        //     if (status != null) {
        //       const dateType = item['dateType'];
        //       switch (dateType) {
        //         case 0: {
        //           name = status + __this.languagePack['list']['type']['day'];
        //           break;
        //         }
        //         case 1: {
        //           name = status + __this.languagePack['list']['type']['week'];
        //           break;
        //         }
        //         case 2: {
        //           name = status + __this.languagePack['list']['type']['month'];
        //           break;
        //         }
        //         case 3: {
        //           name = status + __this.languagePack['list']['type']['year'];
        //           break;
        //         }
        //       }
        //     }
        //     return (name) ? name : '';
        //   }
        // },
        {
          name: __this.languagePack['list']['table']['emergencySuspension'],
          reflect: 'pauseButton',
          type: 'switch',
          filter: (item) => {
            let name, checked, hidden;
            const status = item['pauseButton'];
            switch (status) {
              case 0: {
                checked = false;
                break;
              }
              case 1: {
                checked = true;
                break;
              }
            }
            name = {
              'checked': checked,
              'hidden': hidden
            };
            return (name) ? name : false;
          },
          fn: (item) => {
            let status;
            if (item.pauseButton == 0) {
              status = 1;
            } else {
              status = 0;
            }
            let data = {
              id: item.id,
              pauseButton: status,
              effectiveDate: item.effectiveDate,
              expDate: item.expDate,
            };
            console.log(data);
            this.pauseButton(data);
          },
        },
        {
          name: __this.languagePack['list']['table']['Status'],
          reflect: 'couponStatus ',
          type: 'text',
          filter: (item) => {
            let name;
            const status = item['couponStatus'];
            switch (status) {
              case 1: {
                name = __this.languagePack['list']['status']['noStarted'];
                break;
              }
              case 2: {
                name = __this.languagePack['list']['status']['ongoing'];
                break;
              }
              case 3: {
                name = __this.languagePack['list']['status']['ended'];
                break;
              }
              case 4: {
                name = __this.languagePack['list']['status']['suspended'];
                break;
              }
            }
            return (name) ? name : '';
          },
        }
      ],
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [{
          textColor: '#0000ff',
          name: __this.languagePack['list']['btnGroup']['couponStting'],
          bindFn: (item) => {
            this.router.navigate(['/operationsCenter/coupon/setting'], {
              queryParams: {
                id: item.id
              }
            });
          }
        }, {
          textColor: '#0000ff',
          name: __this.languagePack['common']['operate']['delete'],
          bindFn: (item) => {
            __this.isDelete = true;
            this.sgo.set('CouponId', {
              id: item.id,
            });
          }
        }, {
          textColor: '#0000ff',
          name: __this.languagePack['list']['btnGroup']['appPush'],
          bindFn: (item) => {
            __this.isPush = true;
            this.sgo.set('CouponId', {
              id: item.id,
            });
          }
        }]
      }
    };
    this.getList();
  }

  totalSize: number = 0;

  pauseButton(data) {
    this.tableData.loading = true;
    this.service.pauseButton(data)
      .pipe(
        filter((res: Response) => {
          this.tableData.loading = false;
          if (res.success === false) {
            this.msg.fetchFail(res.message);
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          // console.log(res.data);
          // this.totalSize = res.page.totalNumber ;
          this.getList();
        }
      );
  }
  getList(){
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      id:model.id,
      couponName:model.couponName,
      couponStatus:model.couponStatus,
      couponType:model.couponType,
      currentPage:model.currentPage,
      obtainType:model.obtainType,
      pageSize:model.pageSize,
    };
    this.service.getList(data)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize = 0;
          }
        }
      );
  }
  deleteCoupon(){
    let data = {
      id:this.sgo.get("CouponId").id
    }
    this.service.delete(data)
      .pipe(
        filter( (res : Response) => {

          this.isOkLoading = false;

          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          };

          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          // this.totalSize = res.page.totalNumber ;
          __this.isDelete=false;
          this.getList();
        }
      );
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    };

    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    };
    this.getList() ;
  };
  handleCancel(){
    this.isDelete = false;
    this.isOkLoading = false;
  }
  handleOk(){
    this.isOkLoading = true;
    this.deleteCoupon();
    this.getList();
  }
  pushCancel(){
    this.isPush = false;
    this.isOkLoading = false;
  }
  pushOk(){
    this.isOkLoading = true;
    this.pushCoupon();
    this.getList();
  }
  ruleCancel(){
    this.isRule=false;
  }
  ruleOk(){
    this.isRule=false;
  }
  reset(){
    this.couponIdnameValue = 0;
    this.Idname=null;
    this.searchModel = new SearchModel ;
    this.getList() ;
  };
  pushCoupon(){
    let data = this.sgo.get("CouponId");
    this.service.push(data)
      .pipe(
        filter( (res : Response) => {

          this.isOkLoading = false;

          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          // this.totalSize = res.page.totalNumber ;
          __this.isPush=false;
        }
      );
  }
  search(){
    this.searchModel.id=null;
    this.searchModel.couponName=null;
    if(this.Idname){
      if(this.couponIdnameValue==0){
        let id=parseInt(__this.Idname);
        console.log(id);
        if(isNaN(id)){
          this.searchModel.id=null;
        }else{
          this.searchModel.id=id;
        }

      }else{
        this.searchModel.couponName=this.Idname;
      }
    }
    console.log(this.searchModel);
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  };

  add() {
    this.router.navigate(['/operationsCenter/coupon/setting']);
  }

  view() {
    this.isRule = true;
  }
}
