import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TableData } from '../../../../share/table/table.model';

import {RiskListService, RiskReviewService} from '../../../../service/risk';
import { CommonMsgService } from '../../../../service/msg/commonMsg.service';
import { Response } from '../../../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../../service/storage';
import {SearchModel} from './searchModel';
import {MsgService} from '../../../../service/msg';
import {NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd";
import { unixTime} from "../../../../format";

let __this;
@Component({
  selector: "",
  templateUrl: "./attendanceRecord.component.html",
  styleUrls: ['./attendanceRecord.component.less']
})
export class AttendanceRecordComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private msg : MsgService ,
    private Cmsg: CommonMsgService,
    private fb: FormBuilder,
    private sgo : SessionStorageService,
    private service: RiskListService,
    private RiskReviewService: RiskReviewService
  ) { };

  ngOnInit() {
    __this = this;
    this.getAllOverdueFirm();
    this.getAllGroup();
    this.getStatusData();
    this.getLanguage();

  };
  NzTreeNodes : NzTreeNode[];
  languagePack: Object;
  searchModel : SearchModel = new SearchModel() ;
  allOverdueFirm;
  allOverdueGroup : Array<Object>;
  status : Array<Object>;
  statusData ;
  isOkLoading : Boolean=false;
  totalSize : number ;

  getLanguage() {
    this.translateSer.stream(["administrator.attendanceRecord", 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table:data['administrator.attendanceRecord'],
          };
          // this.statusEum=this.languagePack['data']['state'];
          // this.status=this.languagePack['data']['status'];
          // this.reviewType=this.languagePack['data']['reviewType'];
          this.initialTable();
        }
      )
  };

  tableData: TableData;
  getStatusData(){
    this.service.listAuditStage()
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };

          if (res.data && res.data['length'] == 0) {
            this.statusData = this.languagePack['table']['status'];
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {
          this.statusData = (<Array<Object>>res.data);
          this.statusData=this.statusData.concat(this.languagePack['table']['status']);
          let obj=[{
            flowName:this.languagePack['common']['all'],
            id:""
          }];
          this.statusData=obj.concat(this.statusData);
          console.log(this.statusData);
        }
      )
  }
  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack['table']['id'],
          reflect: "staffId",
          type: "text"
        },
        {
          name: __this.languagePack['table']['account'],
          reflect: "riskEmployeeAccount",
          type: "text"
        },{
          name: __this.languagePack['table']['name'],
          reflect: "riskEmployeeName",
          type: "text"
        }, {
          name: __this.languagePack['table']['group'],
          reflect: "groupName",
          type: "text"
        }, {
          name: __this.languagePack['table']['manualReviewStage'],
          reflect: "stageName",
          type: "text"
        }, {
          name: __this.languagePack['table']['company'],
          reflect: "firmName",
          type: "text"
        }, {
          name: __this.languagePack['table']['companyType'],
          reflect: "firmType",
          type: "text",
          filter: (item) => {
            const firmType = item['firmType'];
            if(firmType!=null){
              let str = __this.languagePack['table']['companyTypes'].filter(item => {
                return item['value'] == firmType;
              });
              return (str && str[0]['desc']) ? str[0]['desc'] : "";
            }

          }
        }, {
          name: __this.languagePack['table']['checkInTime'],
          reflect: "signInDate",
          type: "text"
        }, {
          name: __this.languagePack['table']['checkOutTime'],
          reflect: "signOutDate",
          type: "text"
        }, {
          name: __this.languagePack['table']['allocatedOrders'],
          reflect: "totalAllocateCount",
          type: "text",
          filter: (item) => {
            const totalAllocateCount = item['totalAllocateCount'];
            return totalAllocateCount ? totalAllocateCount : 0;
          }
        }, {
          name: __this.languagePack['table']['reviews'],
          reflect: "auditCount",
          type: "text",
          filter: (item) => {
            const auditCount = item['auditCount'];
            return auditCount ? auditCount : 0;
          }
        }, {
          name: __this.languagePack['table']['audits'],
          reflect: "auditPassCount",
          type: "text",
          filter: (item) => {
            const auditPassCount = item['auditPassCount'];
            return auditPassCount ? auditPassCount : 0;
          }
        }, {
          name: __this.languagePack['table']['reviewRejection'],
          reflect: "auditRefuseCount",
          type: "text",
          filter: (item) => {
            const auditRefuseCount = item['auditRefuseCount'];
            return auditRefuseCount ? auditRefuseCount : 0;
          }
        }, {
          name: __this.languagePack['table']['unReviewed'],
          reflect: "unAuditCount",
          type: "text",
          filter: (item) => {
            const unAuditCount = item['unAuditCount'];
            return unAuditCount ? unAuditCount : 0;
          }
        }, {
          name: __this.languagePack['table']['workingHours'],
          reflect: "workTime",
          type: "text",
          filter: (item) => {
            const workTime = item['workTime'];
            return workTime ? workTime : 0;
          }
        }, {
          name: __this.languagePack['table']['trialsTime'],
          reflect: "workTime",
          type: "text",
          filter:(item)=>{
              return (item['workTime'] && item['auditCount'] && item['workTime']>0) ? (item['auditCount']/item['workTime']).toFixed(2) : 0;
          }
        }, {
          name: __this.languagePack['table']['auditPassRate'],
          reflect: "auditPassRate",
          type: "text",
          filter: (item) => {
            const auditPassRate = item['auditPassRate'];
            return auditPassRate ? auditPassRate : 0;
          }
        }
      ],
      loading: false,
      showIndex: true,
    };
    this.getList();
  };

  selectItem: object;
  getList() {
    this.tableData.loading = true;
    let data = this.searchModel;
    if(data.signInBeginDate){
      data.signInBeginDate = unixTime((<Date>data.signInBeginDate),"y-m-d")+" 00:00:00";
    }
    if(data.signInEndDate){
      data.signInEndDate = unixTime((<Date>data.signInEndDate),"y-m-d")+" 23:59:59";
    }
    this.service.attendance(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };

          this.tableData.loading = false;

          if (res.data && res.data['length'] == 0) {
            this.tableData.data = [];
            this.totalSize = 0;
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {

          let data_arr = res.data;
          if (res.page && res.page.totalNumber)
            this.totalSize = res.page.totalNumber;
          else
            this.totalSize = 0;

          this.tableData.data = (<Array<Object>>data_arr);

        }
      )
  };
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  export(){
    let data = this.searchModel;
    if(data.signInBeginDate){
      data.signInBeginDate = unixTime((<Date>data.signInBeginDate),"y-m-d")+" 00:00:00";
    }
    if(data.signInEndDate){
      data.signInEndDate = unixTime((<Date>data.signInEndDate),"y-m-d")+" 23:59:59";
    }
    this.service.exportRecord(data);
  }
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    }
    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    }
    this.getList() ;
  };
  getAllOverdueFirm(){
    this.RiskReviewService.getAllCreditReviewFirm()
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allOverdueFirm = (< Array<Object> >res.data).filter(item=>{
            return item['status']==1;
          });
          let obj=[{
            firmName:this.languagePack['common']['all'],
            id:""
          }];
          this.allOverdueFirm=obj.concat(this.allOverdueFirm);
        }
      );
  };
  getAllGroup(){
    let $this=this;
    this.RiskReviewService.getAllCreditReviewGroup()
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allOverdueGroup=(< Array<Object> >res.data);
          let arr=[];
          this.allOverdueGroup.map(item=>{
            if(!arr.includes(item['firmId'])){
              arr.push(item['firmId']);
            }
          });
          console.log(arr);
          let node = new Array<NzTreeNode>();
          for (let v of arr) {
            let children = new Array<NzTreeNodeOptions>();
            let a=this.allOverdueGroup.filter(item=>{
              return item['firmId']==v;
            });
            for (let child of a) {
              children.push(
                {
                  title: child['groupName'],
                  key: child['id'],
                  isLeaf:true
                }
              )
            }
            if(this.allOverdueFirm){
              let name=this.allOverdueFirm.filter(aa=>{
                return aa['id']==v
              });
              let firmName=name && name[0] && name[0]['firmName'] ? name[0]['firmName'] : 0;
              node.push(new NzTreeNode({
                title: firmName,
                key: null,
                disabled:true,
                children:children
              }));
            }
          }
          $this.NzTreeNodes=node;
        }
      );
  };
}
