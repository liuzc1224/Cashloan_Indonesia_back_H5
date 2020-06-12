import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { FormBuilder} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {CommonMsgService} from '../../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model/index';
import {AmountBreakdownService} from '../../../service/collectionManagement/amountBreakdown.service';
import {NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd';
import {group} from '@angular/animations';
import {CollectionBusiness} from "../../../service/collectionBusiness";
import {MemberManagementService, ReportService} from "../../../service/collectionManagement";
import {unixTime} from "../../../format";

let __this;

@Component({
  selector: '',
  templateUrl: './amountBreakdown.component.html',
  styleUrls: ['./amountBreakdown.component.less']
})
export class AmountBreakdownComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private CollectionBusiness:CollectionBusiness,
    private MemberManagementService: MemberManagementService,
    private router: Router,
    private ReportService: ReportService,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: AmountBreakdownService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  allStage;
  allOverdueFirm: Array<Object>;
  allOverdueGroup : Array<Object>;
  tableData: TableData;
  staff: Array<Object>;
  NzTreeNode : NzTreeNode[];
  groupNzTreeNode : NzTreeNode[];
  ngOnInit() {
    __this = this;
    this.getLanguage();
  };
  getLanguage() {
    this.translateSer.stream(['collectionManagement.amountBreakdown','orderList', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table: data['collectionManagement.amountBreakdown'],
            orderStatusEnum:data['orderList']['allList']['orderStatusEnum']
          };
          this.initialTable();
          this.getStage();
          this.getAllOverdueFirm();
          this.getAllOverdueStaff();
          this.getAllOverdueGroup();
        }
      );
  };
  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['table']['staffName'],
          reflect: 'staffName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['group'],
          reflect: 'groupName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['firm'],
          reflect: 'firmName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['amount'],
          reflect: 'amount',
          type: 'text',
        },
        {
          name: __this.languagePack['table']['recallDate'],
          reflect: 'createTime',
          type: 'text'
          // filter:(item)=>{
          //   if(item['createTime']){
          //     return  unixTime((new Date(item['createTime'])),"y-m-d");
          //   }
          // }
        },
        {
          name: __this.languagePack['table']['serialNumber'],
          reflect: 'serialNumber',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['dealStatus'],
          reflect: 'transactionStatus',
          type: 'text',
          filter : (item) => {
            let status=item['transactionStatus'];
            if(status!==null){
              let type=__this.languagePack['table']['transactionStatus'].filter(v => {
                return v.value===status
              });
              return (type && type[0].desc) ? type[0].desc : "";
            }
          }
        },
        {
          name: __this.languagePack['table']['overdueDay'],
          reflect: 'dueDays',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['stage'],
          reflect: 'stageName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['orderStatus'],
          reflect: 'orderStatus',
          type: 'text',
          filter : (item) => {
            let status=item['orderStatus'];
            if(status!==null){
              let type=__this.languagePack['orderStatusEnum'].filter(v => {
                return v.value===status
              });
              return (type && type[0].desc) ? type[0].desc : "";
            }
          }
        },
        {
          name: __this.languagePack['table']['orderNo'],
          reflect: 'orderNo',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['phoneNumber'],
          reflect: 'userPhone',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['loanProductType'],
          reflect: 'orderType',
          type: 'text',
          filter : (item) => {
            let orderType=item['orderType'];
            if(orderType!==null){
              let type=__this.languagePack['table']['productType'].filter(v => {
                return v.value==orderType
              });
              return (type && type[0].desc) ? type[0].desc : "";
            }
          }
        },
        {
          name: __this.languagePack['table']['loanMoney'],
          reflect: 'loanMoney',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['limit'],
          reflect: 'loanDays',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['period'],
          reflect: 'currentPeriod',
          type: 'text',
          filter: (item) => {
            const currentPeriod = item['currentPeriod'];
            const totalPeriod=item['totalPeriod'];
            if(currentPeriod && totalPeriod){
              return (currentPeriod && totalPeriod) ? currentPeriod+" / "+totalPeriod : "";
            }
          }
        },
        {
          name: __this.languagePack['table']['repayMoneyShould'],
          reflect: 'realCurrentRepay',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['principal'],
          reflect: 'applyMoney',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['interest'],
          reflect: 'interestMoney',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['serviceFee'],
          reflect: 'otherServiceCharge',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['overdueFee'],
          reflect: 'overDueFine',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['RepayTimeShould'],
          reflect: 'planRepaymentDate',
          type: 'text',
          filter:(item)=>{
            if(item['planRepaymentDate']){
              return  unixTime((new Date(item['planRepaymentDate'])),"y-m-d");
            }
          }
        },
        {
          name: __this.languagePack['table']['realRepayMoney'],
          reflect: 'realRepayMoney',
          type: 'text'
        }
      ]
    };
    this.getList();
  }
  export(){
    let data=this.searchData();
    this.service.exportDetail(data);
  }
  totalSize: number = 0;
  searchData(){
    let model=this.searchModel;
    let data={
      recallDateStart : model.recallDateStart,
      recallDateEnd : model.recallDateEnd,
      currentPeriodRepayDateStart : model.currentPeriodRepayDateStart,
      currentPeriodRepayDateEnd : model.currentPeriodRepayDateEnd,
      stageId : model.stageId,
      overdueDayStart : model.overdueDayStart,
      overdueDayEnd : model.overdueDayEnd,
      orderNo : model.orderNo,
      phoneNumber : model.phoneNumber,
      dealStatus : model.dealStatus,
      staffName : model.staffName,

      pageSize : model.pageSize,
      currentPage : model.currentPage
    };
    let etime = unixTime(<Date>data.recallDateEnd,"y-m-d");
    data.recallDateStart = data.recallDateStart ? unixTime((<Date>data.recallDateStart),"y-m-d")+" 00:00:00" : null;
    data.recallDateEnd = etime ? etime + " 23:59:59" : etime;
    let start=(new Date(data.recallDateStart)).getTime();
    let end=(new Date(data.recallDateEnd)).getTime();
    if( start - end >0 ){
      data.recallDateStart=null;
      data.recallDateEnd=null;
    }
    let etimeDate = unixTime(<Date>data.currentPeriodRepayDateEnd,"y-m-d");
    data.currentPeriodRepayDateStart = data.currentPeriodRepayDateStart ? unixTime((<Date>data.currentPeriodRepayDateStart),"y-m-d")+" 00:00:00" : null;
    data.currentPeriodRepayDateEnd = etimeDate ? etimeDate + " 23:59:59" : etimeDate;
    let startDate=(new Date(data.currentPeriodRepayDateStart)).getTime();
    let endDate=(new Date(data.currentPeriodRepayDateEnd)).getTime();
    if( startDate - endDate >0 ){
      data.currentPeriodRepayDateStart=null;
      data.currentPeriodRepayDateEnd=null;
    }
    if( data['overdueDayStart'] - data['overdueDayEnd'] >0 ){
      data.overdueDayStart=null;
      data.overdueDayEnd=null;
    }
    if(model.firmId!=null){
      data['firmIdList']=[model.firmId];
    }
    if(model.groupId!=null){
      data['groupIdList']=[model.groupId];
    }
    if(model.loanProductType!=null){
      data['loanProductTypeList']=[model.loanProductType];
    }
    return data;
  }
  getList(){
    let data=this.searchData();
    this.service.urgentRecallAmountDetail(data)
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
          this.tableData.data= (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize =0;
          }
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
    this.initialTable();
  };
  reset(){
    this.searchModel = new SearchModel ;
    this.getList();
  };
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList();
  };
  getStage(){
    let data={
      isPage:false
    };
    this.CollectionBusiness.getData(data)
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
          this.allStage = (< Array<Object> >res.data).filter(item=>{
            return item['state'] == "ACTIVATE" ;
          });
        }
      );
  }
  getAllOverdueFirm(){
    this.MemberManagementService.getAllOverdueFirm()
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
            return item['status']==2;
          });
        }
      );
  };
  getAllOverdueStaff(){
    let data={
      isPage:false
    };
    this.ReportService.getAllOverdueStaff(data)
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
          this.staff = (< Array<Object> >res.data).filter(item=>{
            return item['status'] == 2 ;
          });
        }
      );
  }
  getAllOverdueGroup(){
    let $this=this;
    let data={
      isPage:false
    };
    this.ReportService.getAllOverdueGroup(data)
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
          this.allOverdueGroup=(< Array<Object> >res.data);
          let arr=[];
          this.allOverdueGroup.map(item=>{
            if(!arr.includes(item['firmName'])){
              arr.push(item['firmName']);
            }
          });
          let node = new Array<NzTreeNode>();
          for (let v of arr) {
            let children = new Array<NzTreeNodeOptions>();
            let a=this.allOverdueGroup.filter(item=>{
              return item['firmName']==v && item['groupType']==1;
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
            node.push(new NzTreeNode({
              title: v,
              key: null,
              disabled:true,
              children:children
            }));
          }
          $this.groupNzTreeNode=node;
        }
      );
  };
}
