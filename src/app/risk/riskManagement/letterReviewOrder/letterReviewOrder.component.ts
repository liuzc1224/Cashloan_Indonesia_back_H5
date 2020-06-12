import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import { unixTime} from '../../../format/index';
import {CommonMsgService, MsgService} from '../../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model/index';
import {RiskListService, RiskReviewService} from '../../../service/risk';
import {UserLevelService} from '../../../service/productCenter';
import { NzFormatEmitEvent,NzTreeNode,NzTreeNodeOptions } from 'ng-zorro-antd';
import { ObjToQueryString } from "../../../service/ObjToQueryString";
import {OrderService} from "../../../service/order";
import {ChannelH5Service} from '../../../service/operationsCenter';

let __this;

@Component({
  selector: '',
  templateUrl: './letterReviewOrder.component.html',
  styleUrls: ['./letterReviewOrder.component.less']
})
export class LetterReviewOrderComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private orderSer: OrderService,
    private ChannelH5Service: ChannelH5Service,
    private service: RiskListService,
    private UserLevelService:UserLevelService,
    private RiskReviewService:RiskReviewService
  ) {
  } ;
  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  tableData: Array<Object>;
  letterRecordData: TableData;
  circulationRecordData: TableData;
  id: Array<Number>;
  chType:number=1;
  logType: Array<String>;
  userLevel: Array<Object>;
  allStage: Array<Object>;
  stats: Array<Object>;
  keep: Array<Object>;
  isVisible:Boolean=false;
  allDisabled:Boolean=true;
  isLetterRecord:Boolean=false;
  isCirculationRecord:Boolean=false;
  allChecked:Boolean = false;
  NzTreeNode : NzTreeNode[];
  loading:Boolean = false;
  indeterminate :Boolean = false;
  isOkLoading:Boolean=false;
  validForm : FormGroup;
  operatingForm : FormGroup;
  disabledButton : Boolean = true;
  checkedNumber : number = 0;
  listAuditRejectDescData : NzTreeNode[];
  rejectIdData ;
  reviewData ;
  stageIdData=[] ;
  stageName : string = "";
  statusData;
  statusDataNodes : NzTreeNode[];
  reviewDataNodes : NzTreeNode[];
  // listAuditRejectDescDataNodes : NzTreeNode[];
  staffData : Array<Object>;
  productTypeNodes : NzTreeNode[];
  isOperating : boolean = false;
  operatingTitle : string = "";
  operatingTip : string = "";
  operationType : number;
  rejectDescData:Object;
  letterReviewData:Object;
  operatingLoading:boolean=false;
  promotionData : NzTreeNode[];
  allData:Array<object>;
  ngOnInit() {
    __this = this;
    this.validForm = this.fb.group({
      "employeeId" : [null , [Validators.required] ] ,
    });
    this.operatingForm = this.fb.group({
      "operationType" : [null , [Validators.required] ] ,
      "creditIdeaRemark" : [null , [Validators.required] ] ,
      "auditRejectId" : [null] ,
    });
    this.getLanguage();
  };
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
          let arr=this.statusData;
          let node = new Array<NzTreeNode>();
          let option = new Array<NzTreeNodeOptions>();
          for (let v of arr) {
            option.push({
              title: v['flowName'],
              key: v['id'],
              value: v['id'],
              isLeaf: true
            })
          }
          let str=this.languagePack['common']['all'];
          node.push(new NzTreeNode({
              title: str,
              key: "all",
              value: "all",
              children: option
            })
          );
          this.statusDataNodes=node;
        }
      )
  }
  getUserLevel(){
    let data={
      isPage:false
    };
    this.UserLevelService.getUserLevel(data)
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
          this.userLevel = (< Array<Object> >res.data)
          //   .filter(item=>{
          //   return item['status'] == 1 ;
          // });
        }
      );
  };
  getLanguage() {
    this.translateSer.stream(['letterReviewOrder', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table: data['letterReviewOrder']
          };
          this.searchModel.applyDateBegin=unixTime(new Date(),"y-M-d");
          this.searchModel.applyDateEnd=unixTime(new Date(),"y-M-d");
          let str=data['letterReviewOrder']['all'];
          let a=[];
          a.push(new NzTreeNode({
              title: str,
              key: "all",
              value: "all",
              children: []
            })
          );
          this.statusDataNodes=a;
          this.reviewDataNodes=a;
          this.listAuditRejectDescData=a;
          let arr=data['letterReviewOrder']['productTypes'];
          let node = new Array<NzTreeNode>();
          let grand = new Array<NzTreeNodeOptions>();
          for (let v of arr) {
            grand.push({
              title: v['desc'],
              key: v['value'],
              value: v['value'],
              isLeaf: true
            })
          }
          node.push(new NzTreeNode({
              title: str,
              key: "all",
              value: "all",
              children: grand
            })
          );
          this.productTypeNodes=node;
          this.getAllPackage();
          this.initialTable();
          this.getUserLevel();
          this.getStatusData();
          this.getReview();
        }
      );
  };
  viewType(data){
    let name=this.languagePack['table']['productTypes'].filter(v=>{
      return v['value']==data
    });
    return name && name[0] && name[0]['desc'] ? name[0]['desc'] : '';
  }

  getReview(){
    let data={
      isPage: false
    };
    this.RiskReviewService.getReview(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          }
          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {
          let data_arr = res.data;
          // let all=[{
          //   id:"-100",
          //   flowName:this.languagePack['table']['all']
          // }];
          this.stageIdData = (<Array<Object>>data_arr);
          let arr=this.stageIdData;
          let node = new Array<NzTreeNode>();
          let option = new Array<NzTreeNodeOptions>();
          for (let v of arr) {
            option.push({
              title: v['flowName'],
              key: v['id'],
              value: v['id'],
              isLeaf: true
            })
          }
          let str=this.languagePack['common']['all'];
          node.push(new NzTreeNode({
              title: str,
              key: "all",
              value: "all",
              children: option
            })
          );
          this.reviewDataNodes=node;

        }
      );
  }


  changeStatus(data){
    this.chType=data;
    this.getList();
  }
  initialTable() {
    this.getListAuditRejectDesc();
  }
  initLetterRecordData(data) {
    this.letterRecordData = {
      tableTitle: [
        {
          name: __this.languagePack['table']['orderStage'],
          reflect: "creditOrderOperate",
          type: "text"
        }, {
          name: __this.languagePack['common']['operate']['name'],
          reflect: "operateResult",
          type: "text"
        }, {
          name: __this.languagePack['table']['reviewRejectionStageReason'],
          reflect: "auditRejectDsec",
          type: "text",
          width:"200px",
          innerHTML: true,
          filter:(item)=>{
            if(item['auditRejectDsec']){
              let str=(item['auditRejectDsec']).join('</br>');
              return str;
            }
          }
        }, {
          name: __this.languagePack['table']['remarks'],
          reflect: "remark",
          type: "text",
        }, {
          name: __this.languagePack['table']['operator'],
          reflect: "operateEmployee",
          type: "text",
        }, {
          name: __this.languagePack['table']['operatingTime'],
          reflect: "operateTime",
          type: "text",
          filter:(item)=>{
            return unixTime(item['operateTime']);
          }
        }
      ],
      loading: false,
      showIndex: true,
    };
    this.letterReview(data);
  };
  initCirculationRecordData(data) {
    this.circulationRecordData = {
      tableTitle: [
        {
          name: __this.languagePack['table']['orderStage'],
          reflect: "creditOrderNo",
          type: "text"
        }, {
          name: __this.languagePack['table']['circulationStage'],
          reflect: "currentStageName",
          type: "text"
        }, {
          name: __this.languagePack['table']['distributionID'],
          reflect: "currentStaffId",
          type: "text",
        }, {
          name: __this.languagePack['table']['distributionName'],
          reflect: "currentStaffName",
          type: "text",
        }, {
          name: __this.languagePack['table']['operator'],
          reflect: "operatorName",
          type: "text",
        }, {
          name: __this.languagePack['table']['operatingTime'],
          reflect: "createTime",
          type: "text",
          filter:(item)=>{
            return unixTime(item['createTime']);
          }
        }
      ],
      loading: false,
      showIndex: true,
    };
    this.circulation(data);
  };
  totalSize: number = 0;

  searchData(){
    let model=this.searchModel;
    // let type;
    // let arr=this.listAuditRejectDescData.filter(v=>{
    //   return v['rejectId']==model.rejectId
    // });
    // type=arr && arr[0] && arr[0]['type']!=null ? arr[0]['type'] : null;
    let data ={
      // orderStatus:this.chType,
      applyDateBegin:model.applyDateBegin,
      applyDateEnd:model.applyDateEnd,
      userGrade:model.userGrade,
      // loanProductType:model.loanProductType,
      // creditOrderStatus:model.creditOrderStatus,
      // auditRejectStageId:model.auditRejectStageId,
      // rejectId:model.rejectId,
      // rejectIdType:type,
      channel : model.channel,
      promotionTypeStr : model.promotionTypeStr,
      referrerName : model.referrerName,
      creditOrderNo:model.creditOrderNo,
      userPhone:model.userPhone,
      currentAuditStaffName:model.currentAuditStaffName,
      currentPage:model.currentPage,
      loanDaysFlag :model.loanDaysFlag,
      loanDays : model.loanDays,
      firstLoan : model.firstLoan,
      pageSize:model.pageSize,
      columns:['order_create_time'],
      orderBy:[false]
    };
    let applyDateEnd = unixTime(<Date>data.applyDateEnd,"y-m-d");
    data.applyDateBegin =data.applyDateBegin ? unixTime(<Date>data.applyDateBegin,"y-m-d")+" 00:00:00" : null;
    data.applyDateEnd =
      applyDateEnd
        ? applyDateEnd + " 23:59:59"
        : null;
    let start=(new Date(data.applyDateBegin)).getTime();
    let end=(new Date(data.applyDateEnd)).getTime();
    if( start - end >0 ){
      data.applyDateBegin=null;
      data.applyDateEnd=null;
    }
    if(model.loanProductType && model.loanProductType[0] && model.loanProductType[0]=="all"){
      data['loanProductType']=[];
    }else{
      data['loanProductType']=model.loanProductType;
    }
    if(model.creditOrderStatus && model.creditOrderStatus[0] && model.creditOrderStatus[0]=="all"){
      data['creditOrderStatus']=[];
    }else{
      data['creditOrderStatus']=model.creditOrderStatus;
    }
    if(model.auditRejectStageId && model.auditRejectStageId[0] && model.auditRejectStageId[0]=="all"){
      data['auditRejectStageIdList']=[];
    }else{
      data['auditRejectStageIdList']=model.auditRejectStageId;
    }
    // if(model.auditRejectStageId){
    //   if(model.auditRejectStageId!="-100"){
    //     data['auditRejectStageIdList']=[model.auditRejectStageId];
    //   }else{
    //     let arr=[];
    //     this.stageIdData.forEach(v=>{
    //       arr.push(v['id'])
    //     });
    //     data['auditRejectStageIdList']=arr;
    //   }
    // }
    if(model.rejectId && model.rejectId[0] && model.rejectId[0]=="all"){
      data['aiRejectIdList']=[];
      data['auditRejectIdList']=[];
    }else{
      let arr=model.rejectId;
      data['aiRejectIdList']=[];
      data['auditRejectIdList']=[];
      if(arr){
        arr.forEach(v=>{
          if(JSON.parse(v)['type']==0){
            data['aiRejectIdList'].push(JSON.parse(v)['rejectId'])
          }
          if(JSON.parse(v)['type']==1){
            data['auditRejectIdList'].push(JSON.parse(v)['rejectId'])
          }
        });
      }
    }
    return data;
  }
  getList(){
    this.loading = true ;
    let data=this.searchData();
    this.service.getData(data)
      .pipe(
        filter( (res : Response) => {
          this.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          let data=(< Array<Object> >res.data);
          if(data){
            data=data.map(item=>{
              return Object.assign(item,{checked:false}) ;
            });
            this.tableData = data;
            if(this.tableData){
              this.tableData.forEach(v=>{
                if(v['status']==9){
                  this.allDisabled=false;
                  return;
                }
              })
            }else{
              this.allDisabled=true;
            }
            this.refreshStatus();
          }
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize=0;
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
    this.allChecked=null;
    this.getList() ;
  };
  toDetail(item){
    // this.service.lockOrder(item.id).subscribe((res: Response) => {
    //   if (res.success) {
    let data={
      from: "letterReviewOrder",
      status: item["status"],
      usrId: item["userId"],
      order: item["id"],
      applyMoney: item["applyMoney"],
      auditMoney: item["auditMoney"],
      orderNo: item["creditOrderNo"]
    };
    let para = ObjToQueryString(data);
    console.log(window.location);
    window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");
    //     let parentName = this.sgo.get("routerInfo");
    //     this.sgo.set("routerInfo" , {
    //       parentName :parentName.menuName,
    //       menuName :__this.languagePack['table']['info']
    //     }) ;
    //     this.router.navigate(["/usr/auth"], {
    //       queryParams: {
    //         from: "letterReviewOrder",
    //         status: item["status"],
    //         usrId: item["userId"],
    //         order: item["id"+window.location.pathname],
    //         applyMoney: item["applyMoney"],
    //         auditMoney: item["auditMoney"],
    //         orderNo: item["creditOrderNo"]
    //       }
    //     });

    // } else {
    //   that.msg.fetchFail(res.message);
    //   if (res.code == 9) {
    //     that.getRecordList();
    //   }
    // }
    // });
  }
  reset(){
    this.searchModel = new SearchModel ;
    this.searchModel.applyDateBegin=unixTime(new Date(),"y-M-d");
    this.searchModel.applyDateEnd=unixTime(new Date(),"y-M-d");
    // this.searchModel.loanProductType =["all"];
    // this.searchModel.creditOrderStatus=["all"];
    // this.searchModel.auditRejectStageId =["all"];
    // this.searchModel.rejectId =["all"];
    this.getUserLevel();
    this.getStatusData();
    this.getReview();
    this.getLanguage();
  };
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  };
  checkData(data,index){
    let arr=this.tableData.filter((a) =>  a['status']==9 && a['checked']);
    if(arr.length>0){
      let num=arr.filter((a) => a['currentStageId'] == data['currentStageId']).length;
      if(num){
        this.refreshStatus();
      }else{
        this.tableData[index]['checked']=null;
      }
    }else{
      this.refreshStatus()
    }
  }
  refreshStatus(){
    const allChecked = this.tableData.every(value => value['checked'] == true);
    const allUnChecked = this.tableData.every(value => !value['checked']);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.tableData.some(value => value['checked']);
    this.checkedNumber = this.tableData.filter(value => value['checked'] ).length;
  }
  handleOk(){
    if(!this.validForm.valid){
      for (const i in this.validForm.controls) {
        this.validForm.controls[i].markAsDirty();
        this.validForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    let postData = this.validForm.value;
    let data={
      creditOrderIds :this.id,
      staffId:postData['employeeId']
    };
    this.isOkLoading=true;
    this.service.allocation(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading=false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.msg.success(this.languagePack['table']['distributionSuccess']) ;
          this.isVisible=false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.isVisible=false;
    this.validForm.reset();
  }
  checkAll(value){
    if(this.tableData){
      let arr=this.tableData.filter((a) =>  a['status']==9);
      let obj = {};
      let aa=[];
      arr.reduce(function(item, next) {
        obj[next['currentStageId']] ? '' : obj[next['currentStageId']] = true && aa.push(next);
        return item;
      }, []);
      console.log(aa);
      if(aa.length==1){
        this.tableData.forEach(data =>
          data['status']!=9 ? data['checked'] = data['checked'] : data['checked'] = value
        );
        this.refreshStatus();
      }else{
        this.Cmsg.fetchFail(this.languagePack['table']['error']);
      }
    }
  }
  allocation(){
    let id=[];
    this.tableData.forEach(item=>{
      if(item['checked']==true){
        this.stageName=item['currentStageName'];
        id.push(item['id']) ;
      }
    });

    let data={
      creditOrderList:id
    };
    this.service.getCreditOrderAllocationStaffList(data)
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
          this.staffData=< Array<Object> >res.data;
          this.staffData=this.staffData.filter(v=>{
            return v['stageName'] == this.stageName
          });
          console.log(this.staffData);
          if(this.staffData && this.staffData.length===0){
            this.msg.error(this.languagePack['table']['commissionerNo']) ;
            return;
          }
          let arr=[];
          console.log(this.staffData);
          this.staffData.forEach(item => {
            if (!arr.includes(item['firmName'])) {
              arr.push(item['firmName']);
            }
          });
          let node = new Array<NzTreeNode>();
          let $this = this;
          for (let v of arr) {
            console.log(v);
            let children = new Array<NzTreeNodeOptions>();
            let a = this.staffData.filter(item => {
              return item['firmName'] == v;
            });
            // let personnelType = $this.languagePack['list']['personnelType'];
            let arr1 = [];
            a.forEach(item => {
              if (!arr1.includes(item['groupName'])) {
                arr1.push(item['groupName']);
              }
            });
            for (let f of arr1) {
              let b = a.filter(item => {
                return item['groupName'] == f;
              });
              let grand = new Array<NzTreeNodeOptions>();
              for (let grandson of b) {
                grand.push({
                  title: grandson['staffName']+"--"+grandson['currentOrderNum'],
                  key: grandson['id'],
                  isLeaf: true
                })
              }
              children.push(
                {
                  title: f,
                  key: null,
                  disabled: true,
                  children: grand
                }
              )
            }
            node.push(new NzTreeNode({
              title: v,
              key: null,
              disabled: true,
              children: children
            }));
          }
          console.log(node);
          $this.NzTreeNode = node;
          this.isVisible=true;
          this.id=[];
          this.tableData.forEach(item=>{
            if(item['checked']==true){
              this.id.push(item['id']) ;
            }
          });
        }
      );

  }
  operating(data){
    this.id=[];
    this.tableData.forEach(item=>{
      if(item['checked']==true){
        this.id.push(item['id']) ;
      }
    });
    if(data==1){
      this.queryAuditRejectDesc();
    }
    this.operationType=data;
    this.isOperating=true;
    this.operatingTitle=this.languagePack['table']['determine'][data];
    this.operatingTip=this.languagePack['table']['tip'][data];
      this.operatingForm.patchValue({
        operationType : data
      })
  }
  queryAuditRejectDesc(){
    this.orderSer.queryAuditRejectDesc()
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        console.log(res.data);
        this.rejectDescData=<Array<object>>res.data;
      });
  }
  letterReview(data){
    this.letterRecordData.loading=true;
    let params={
      creditOrderId:data
    };
    this.service.getLetterRecord(params)
      .pipe(
        filter( (res : Response) => {
          this.letterRecordData.loading=false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.letterReviewData=res.data ;
          this.letterRecordData.data=this.letterReviewData['creditOrderOperateRecordVOS'];
          this.isLetterRecord=true;
        }
      );
  }
  getListAuditRejectDesc(){
    this.service.listAuditRejectDesc()
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
          // let all=[{
          //   rejectId:"-100",
          //   rejectDesc:this.languagePack['table']['all'],
          //   type:2
          // }];
          this.rejectIdData=res.data;
          // this.listAuditRejectDescData=all.concat(this.rejectIdData);
          let arr=(<Array<Object>>res.data);
          let node = new Array<NzTreeNode>();
          let option = new Array<NzTreeNodeOptions>();
          for (let v of arr) {
            option.push({
              title: v['rejectDesc'],
              key: JSON.stringify(v),
              value: JSON.stringify(v),
              isLeaf: true
            })
          }
          let str=this.languagePack['common']['all'];
          node.push(new NzTreeNode({
              title: str,
              key: "all",
              value: "all",
              children: option
            })
          );
          this.listAuditRejectDescData=node;
          this.getList();
        }
      );
  }
  circulation(data){
    this.circulationRecordData.loading=true;
    let params={
      creditOrderId:data
    };
    this.service.getCreditOrderFlowHistory(params)
      .pipe(
        filter( (res : Response) => {
          this.circulationRecordData.loading=false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.circulationRecordData.data=<Array<object>>res.data ;
          this.isCirculationRecord=true;
        }
      );
  }
  num(data){
    if(this.searchModel[data]){
      this.searchModel[data]=this.searchModel[data].replace(/[^0-9]/g,'');
    }
  }
  export(){
    let data=this.searchData();
    this.service.exportOverdueOrder(data);
  }
  dateToString(data){
    if(data){
      return unixTime(new Date(data));
    }else {
      return;
    }
  }
  setUserLevel(data){
    if(data!=null){
      if(data.indexOf("_")>-1){
        let arr=data.substring(0,data.length-1).split("_");
        let str="";
        arr.forEach(v=>{
          let name=this.userLevel.filter(item=>{
            return item['id']==v;
          });
          str=name && name[0] ? str+","+name[0]['userLevelName'] : "";
        });
        return str.substring(1,str.length);
      }else{
        let name=this.userLevel.filter(item=>{
          return item['id']==data;
        });
        return name && name[0] ? name[0]['userLevelName'] : "";
      }
    }
  }
  setDsec(data){
    if(data!=null){
      let str=JSON.parse(JSON.stringify(data)).join(',');
      return (str && str.length>10) ? str.substring(0,20)+"..." : str;
    }
  }
  text(data){
    if(data){
      let str=JSON.parse(JSON.stringify(data)).join('<br/><br/>');
      return str;
    }
  }
  operatingCancel(){
    this.operatingForm.reset();
    this.isOperating=false;
  }
  operatingOk(){
    if(!this.operatingForm.valid){
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }
    this.operatingLoading=true;
    let postData = this.operatingForm.value;
    postData['creditOrderIdList']=this.id;
    this.service.batchCloseOrRejectOrRollbackStage(postData)
      .pipe(
        filter( (res : Response) => {
          this.operatingLoading=false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.isOperating=false;
          this.getList();
        }
      );
  }
  getAllPackage(){
    this.ChannelH5Service.allPackage()
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
          this.allData=< Array<Object> >res.data;
        }
      );
  }
  setSource(){
    let channel=this.searchModel.channel;
    if(channel==1){
      let arr=this.languagePack['table']['method'];
      let node = new Array<NzTreeNode>();
      let option = new Array<NzTreeNodeOptions>();
      for (let v of arr) {
        option.push({
          title: v['desc'],
          key: v['value'],
          isLeaf: true
        })
      }
      let str=this.languagePack['common']['all'];
      node.push(new NzTreeNode({
          title: str,
          key: "all",
          children: option
        })
      );
      this.promotionData=node;
    }
    else if(channel==2){
      let arr=this.languagePack['table']['method1'];
      let node = new Array<NzTreeNode>();
      let option = new Array<NzTreeNodeOptions>();
      for (let v of arr) {
        option.push({
          title: v['desc'],
          key: v['value'],
          isLeaf: true
        })
      }
      let str=this.languagePack['common']['all'];
      node.push(new NzTreeNode({
          title: str,
          key: "all",
          children: option
        })
      );
      this.promotionData=node;
    }
    else if(channel==3){
      this.promotionData=[];
      let arr=this.allData.filter(v=>{
        return v['mediaSource']!=null
      });
      let node = new Array<NzTreeNode>();
      let option = new Array<NzTreeNodeOptions>();
      for (let v of arr) {
        option.push({
          title: v['mediaSource'],
          key: v['mediaSource'],
          isLeaf: true
        })
      }
      let str=this.languagePack['common']['all'];
      node.push(new NzTreeNode({
          title: str,
          key: "all",
          children: option
        })
      );
      this.promotionData=node;
    }else{
      this.promotionData=[];
      this.searchModel.promotionTypeStr=null;
    }

  }
}
