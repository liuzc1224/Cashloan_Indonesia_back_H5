import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableData } from '../../../../share/table/table.model';

import {RiskListService, RiskReviewService} from '../../../../service/risk';
import { CommonMsgService } from '../../../../service/msg/commonMsg.service';
import { Response } from '../../../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../../service/storage';
import {SearchModel} from './searchModel';
import {NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd";
import { unixTime} from '../../../../format';

let __this;
@Component({
  selector: "",
  templateUrl: "./performance.component.html",
  styleUrls: ['./performance.component.less']
})
export class PerformanceComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private service: RiskListService,
    private riskReviewService: RiskReviewService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private sgo : SessionStorageService
  ) { };

  ngOnInit() {
    __this = this;

    this.getLanguage();

  };

  languagePack: Object;
  searchModel : SearchModel = new SearchModel() ;
  validateForm: FormGroup;
  status: Array<object>;
  allOverdueFirm;
  allOverdueGroup;
  NzTreeNode : NzTreeNode[];
  allStage;

  getLanguage() {
    this.translateSer.stream(["riskReport.performance",'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table: data['riskReport.performance'],
          };
          this.getAllOverdueFirm();
          this.getAllCreditReviewGroup();
          this.getStage();
          this.initialTable();
        }
      )
  };

  tableData: TableData;

  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack['table']['jobsTime'],
          reflect: "date",
          type: "text"
        },{
          name: __this.languagePack['table']['id'],
          reflect: "riskEmployeeId",
          type: "text"
        },
        {
          name: __this.languagePack['table']['account'],
          reflect: "riskEmployeeAccount",
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
          reflect: "companyName",
          type: "text"
        }, {
          name: __this.languagePack['table']['companyType'],
          reflect: "companyType",
          type: "text",
          filter : ( item ) => {
            let firmType = item['companyType'] ;
            const map = __this.languagePack['table']['companyTypes'] ;
            let name = map.filter( item => {
              return item.value == firmType ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        }, {
          name: __this.languagePack['table']['allocatedOrders'],
          reflect: "totalAllocateCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['reviews'],
          reflect: "auditCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['audits'],
          reflect: "auditPassCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['reviewRejection'],
          reflect: "auditRefuseCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['reviewClosed'],
          reflect: "auditCloseCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['unReviewed'],
          reflect: "unAuditCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['workingHours'],
          reflect: "workTime",
          type: "text"
        }, {
          name: __this.languagePack['table']['trialsTime'],
          // reflect: "workTime",
          reflect: "hourAuditCount",
          type: "text",
          filter : ( item ) => {
            let workTime = item['workTime'] ;
            let auditCount = item['auditCount'] ;
            let str;
            if(workTime && auditCount){
              str=(auditCount/workTime).toFixed(2)
            }
            return str;
          }
        }, {
          name: __this.languagePack['table']['auditPassRate'],
          reflect: "auditPassPercent",
          type: "text",
          filter : (item) => {
            let auditPassPercent =item['auditPassPercent'];
            if(auditPassPercent!=null){
              return (auditPassPercent*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        }, {
          name: __this.languagePack['table']['overdueRate'],
          reflect: "overdueRatio",
          type: "text",
          filter : (item) => {
            let overdueRatio =item['overdueRatio'];
            if(overdueRatio!=null){
              return (overdueRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        }
      ],
      loading: false,
      showIndex: true,
    };
    this.getList();
  };
  totalSize: number = 0;
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  getList() {
    this.tableData.loading = true;
    // if(this.searchModel.startDate!==null){
    //   this.searchModel.startDate=unixTime(this.searchModel.startDate, 'y-m-d')+" 00:00:00";
    // }
    if(this.searchModel.signInBeginDate!==null){
      this.searchModel.signInBeginDate=unixTime(this.searchModel.signInBeginDate, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.signInEndDate!==null){
      this.searchModel.signInEndDate=unixTime(this.searchModel.signInEndDate, 'y-m-d')+" 23:59:59";
    }


    let data=this.searchModel;
    this.service.getPerformance(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          };

          this.tableData.loading = false;

          if (res.data && res.data['length'] == 0) {
            this.tableData.data = [];
            this.totalSize =0;
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {

          let data_arr = res.data;

          this.tableData.data = (<Array<Object>>data_arr);
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }
        }
      )
  };
  getAllOverdueFirm(){
    this.riskReviewService.getAllCreditReviewFirm()
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
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
  getAllCreditReviewGroup(){
    let $this=this;
    this.riskReviewService.getAllCreditReviewGroup()
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allOverdueGroup=(< Array<Object> >res.data).filter(v=>{
            return v['status']==1
          });
          let arr=[];
          this.allOverdueGroup.map(item=>{
            if(!arr.includes(item['firmId'])){
              arr.push(item['firmId']);
            }
          });
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
          $this.NzTreeNode=node;
        }
      );
  };
  getStage(){
    let data={
      type:1
    };
    this.riskReviewService.getReview(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allStage = (< Array<Object> >res.data).filter(item=>{
            return item['status'] == 1 ;
          });
          let obj=[{
            flowName:this.languagePack['common']['all'],
            id:""
          }];
          this.allStage=obj.concat(this.allStage)
        }
      );
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
  exportPerformance(){
    if(this.searchModel.signInBeginDate!==null){
      this.searchModel.signInBeginDate=unixTime(this.searchModel.signInBeginDate, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.signInEndDate!==null){
      this.searchModel.signInEndDate=unixTime(this.searchModel.signInEndDate, 'y-m-d')+" 23:59:59";
    }
    let data=this.searchModel;
    this.service.exportPerformance(data)
      // .subscribe(res => {
      //   let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      //   let objectUrl = URL.createObjectURL(blob);
      //   let a = document.createElement("a");
      //   document.body.appendChild(a);
      //   a.setAttribute("style", "display:none");
      //   a.setAttribute("href", objectUrl);
      //   a.setAttribute("download", "风控列表");
      //   a.click();
      //   URL.revokeObjectURL(objectUrl);
      // });
  }
}
