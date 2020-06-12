import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {CommonMsgService} from '../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model/index';
import { collectionWorkbenchService } from "../../service/collectionWorkbench";
import {CaseManagementService} from '../../service/collectionManagement/caseManagement.service';
import {CollectionBusiness} from '../../service/collectionBusiness';
import { NzTreeNode,NzTreeNodeOptions } from 'ng-zorro-antd';
import {DateObjToString, unixTime} from "../../format";
import {ObjToQueryString} from "../../service/ObjToQueryString";

let __this;

@Component({
  selector: '',
  templateUrl: './collectionManagebench.component.html',
  styleUrls: ['./collectionManagebench.component.less']
})
export class CollectionManagebenchComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: CaseManagementService,
    private benchService: collectionWorkbenchService,
    private CollectionBusiness:CollectionBusiness
  ) {
  } ;
  msgList: Array<Object>;
  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  tableData: Array<Object>;
  id: Array<Number>;
  chType:number=1;
  caseManagementType: Array<String>;
  logType: Array<String>;
  userLevel: Array<Object>;
  staff: Array<Object>;
  allStage: Array<Object>;
  stats: Array<Object>;
  keep: Array<Object>;
  isVisible:Boolean=false;
  allChecked:Boolean = false;
  NzTreeNode : NzTreeNode[];
  NzTreeNodes : NzTreeNode[];
  loading:Boolean = false;
  indeterminate :Boolean = false;
  isOkLoading:Boolean=false;
  validForm : FormGroup;
  disabledButton : Boolean = true;
  allotList: Array<Number> = [];
  checkedNumber : number = 0;
  onlineHeadcount: Number = 0;
  headcount: Number = 0;
  todayPushBackOrderNum: Number = 0;
  allotOrderTotalNum: Number = 0;
  todayPushBackMoney : Number = 0;
  pushBackTotalMoney: Number = 0;
  pushBackNumRanking: Number = 0;
  pushBackTotalMoneyRnaking: Number = 0;
  firmID;
  recallPhone;
  recallPhonePassword;
  staffID: Number = 0;
  staffName;
  exHidden : boolean =false ;
  stage;
  ngOnInit() {
    __this = this;
    this.getLanguage();
    this.validForm = this.fb.group({
      "name" : [null , [Validators.required] ] ,
    });
    this.getStage();
    this.getUserLevel();
  };
  getStage(){
    let data={
      isPage:false
    };
    this.CollectionBusiness.getData(data)
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
          this.allStage = (< Array<Object> >res.data).filter(item=>{
            return item['state'] == "ACTIVATE" ;
          });
        }
      );
  }
  getAllOverdueStaff(){
    let data={
      isPage:false
    };
    this.service.getAllOverdueStaff(data)
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
          this.staff = (< Array<Object> >res.data);
          this.getPersonnel();
          this.getPersonnel1();
        }
      );
  }
  removeRead(){
    let readList = [];
    this.msgList.forEach( (item, index) => {
      item['read'] ? readList.push(item['id']) : ''
    } );
    this.changeList(readList, 0)
  }
  allRead(){
    let allList = [];
    this.msgList.forEach( (item, index) => {
      allList.push(item['id'])
    } );
    this.changeList(allList, 1)
  }
  changeList(list:Array<any>, type: Number){
    let data = {
      ids: list,
      stasus: type,
      read: 1
    };
    this.service.updateRemind(data)
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
          this.getMsgList()
        }
      );
  }
  getUserLevel(){
    let data={
      isPage:false
    };
    this.service.loanUser(data)
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
          this.userLevel = (< Array<Object> >res.data).filter(item=>{
            return item['status'] == 1 ;
          });
        }
      );
  };
  getLanguage() {
    this.translateSer.stream(['collectionManagement.caseManagement', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['collectionManagement.caseManagement']
          };
          this.keep=this.languagePack['list']['keep'];
          this.stats=this.languagePack['list']['stats'];
          this.caseManagementType=this.languagePack['list']['caseManagementType'];
          this.logType=this.languagePack['list']['logType'];
          this.initialTable();
        }
      );
  };
  setType(data){
    let arr=this.languagePack['list']['orderType'];
    let name=arr.filter(v=>{
      return v['value'] == data;
    });
    return name && name[0] && name[0]['desc'] ? name[0]['desc'] : ""
  }
  changeStatus(data){
    this.chType=data;
    this.getList();
  }
  initialTable() {
    this.getList();
  }

  totalSize: number = 0;

  getList(){
    this.loading = true ;
    let model=this.searchModel;
    let planRepaymentDateEnd = unixTime(<Date>model.planRepaymentDateEnd,"y-m-d");
    model.planRepaymentDateStart =model.planRepaymentDateStart ? unixTime(<Date>model.planRepaymentDateStart,"y-m-d")+" 00:00:00" : null;
    model.planRepaymentDateEnd =
      planRepaymentDateEnd
        ? planRepaymentDateEnd + " 23:59:59"
        : null;
    let start=(new Date(model.planRepaymentDateStart)).getTime();
    let end=(new Date(model.planRepaymentDateEnd)).getTime();
    if( start - end >0 ){
      model.planRepaymentDateStart=null;
      model.planRepaymentDateEnd=null;
    }

    let remindDateEnd = unixTime(<Date>model.remindDateEnd,"y-m-d");
    model.remindDateStart =model.remindDateStart ? unixTime(<Date>model.remindDateStart,"y-m-d")+" 00:00:00" : null;
    model.remindDateEnd =
      remindDateEnd
        ? remindDateEnd + " 23:59:59"
        : null;
    let remindStart=(new Date(model.remindDateStart)).getTime();
    let remindEnd=(new Date(model.remindDateEnd)).getTime();
    if( remindStart - remindEnd >0 ){
      model.remindDateStart=null;
      model.remindDateEnd=null;
    }

    this.service.getStaffID()
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
          if ( res["data"] ) {
            this.staffID = res["data"]['id'];
            this.staffName = res["data"]['staffName'];
            this.stage = res["data"]['stageId'];
            this.searchModel.stageId = res["data"]['stageId'];
            this.recallPhone = res["data"]['recallPhone'];
            this.recallPhonePassword = res["data"]['recallPhonePassword'];
            this.exHidden=true;
          }else {
            this.exHidden=false;
          }
          this.getAdminReport();
          this.service.getFirmID()
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
                this.firmID=res["data"];
                this.getAllOverdueStaff();
                let data ={
                  firmId : this.firmID,
                  orderStatus:this.chType,
                  type:this.chType,
                  planRepaymentDateStart:model.planRepaymentDateStart,
                  planRepaymentDateEnd:model.planRepaymentDateEnd,
                  dueDays:model.dueDays,
                  stageId:model.stageId,
                  staffId:model.staffId,
                  remindDateStart:model.remindDateStart,
                  remindDateEnd:model.remindDateEnd,
                  orderType:model.orderType,
                  userGrade:model.userGrade,
                  orderNo:model.orderNo,
                  phonenum:model.phonenum,
                  username:model.username,
                  currentPage:model.currentPage,
                  pageSize:model.pageSize,
                  columns:['due_days'],
                  orderBy:[true]
                };
                console.log(data);
                this.benchService.getOverdueOrder(data)
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
                      }
                      if(res.page){
                        this.totalSize = res.page["totalNumber"] || 0;
                      }else{
                        this.totalSize = 0;
                      }
                    }
                  );
              }
            );
        }
      );
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
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  };
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  refreshStatus(){
    const allChecked = this.tableData.every(value => value['checked'] == true);
    const allUnChecked = this.tableData.every(value => !value['checked']);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.tableData.some(value => value['checked']);
    this.checkedNumber = this.tableData.filter(value => value['checked']).length;
  }
  handleOk(){
    let postData = this.validForm.value;
    let data={
      idList:this.id,
      staffId:postData['name']
    };
    this.service.allocate(data)
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
          this.isVisible=false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.isVisible=false;
  }
  checkAll(value){
    this.tableData.forEach(data =>
      data['orderStatus']==4 || data['orderStatus']==6|| data['orderStatus']==9|| data['orderStatus']==10|| data['orderStatus']==12|| data['orderStatus']==13|| data['orderStatus']==14 ? data['checked'] = data['checked'] : data['checked'] = value
    );
    this.refreshStatus();
  }
  getPersonnel(){
    let arr=[];
    if(this.staff) {
      let staffAll=this.staff.filter(item=>{
        return item['status'] == 2 ;
      });
      if(this.firmID){
        staffAll.map(item => {
          if (item['groupType'] == 1) {
            if(item['firmId']==this.firmID){
              if (!arr.includes(item['firmName'])) {
                arr.push(item['firmName']);
              }
            }
          }
        });
      }else{
        staffAll.map(item => {
          if (item['groupType'] == 1) {
            if (!arr.includes(item['firmName'])) {
              arr.push(item['firmName']);
            }
          }
        });
      }
      let node = new Array<NzTreeNode>();
      let $this = this;
      for (let v of arr) {
        let children = new Array<NzTreeNodeOptions>();
        let a = staffAll.filter(item => {
          if(this.stage){
            return item['firmName'] == v && item['stageId']==this.stage;
          }else{
            return item['firmName'] == v;
          }
        });
        // let personnelType = $this.languagePack['list']['personnelType'];
        let arr1 = [];
        a.map(item => {
          if (item['groupType'] == 1) {
            if (!arr1.includes(item['groupName'])) {
              arr1.push(item['groupName']);
            }
          }
        });
        for (let f of arr1) {
          let b = a.filter(item => {
            if(this.stage){
              return item['groupName'] == f && item['stageId']==this.stage && item['groupType']==1;
            }else{
              return item['groupName'] == f && item['groupType']==1;
            }

          });
          let grand = new Array<NzTreeNodeOptions>();
          for (let grandson of b) {
            grand.push({
              title: grandson['staffName'],
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
      $this.NzTreeNodes = node;
    }
  }
  getPersonnel1(){
    let arr=[];
    if(this.staff) {
      if(this.firmID){
        this.staff.map(item => {
          if (item['groupType'] == 1) {
            if(item['firmId']==this.firmID){
              if (!arr.includes(item['firmName'])) {
                arr.push(item['firmName']);
              }
            }
          }
        });
      }else{
        this.staff.map(item => {
          if (item['groupType'] == 1) {
            if (!arr.includes(item['firmName'])) {
              arr.push(item['firmName']);
            }
          }
        });
      }
      let node = new Array<NzTreeNode>();
      let $this = this;
      for (let v of arr) {
        let children = new Array<NzTreeNodeOptions>();
        let a = this.staff.filter(item => {
          if(this.stage){
            return item['firmName'] == v && item['stageId']==this.stage;
          }else{
            return item['firmName'] == v;
          }
        });
        // let personnelType = $this.languagePack['list']['personnelType'];
        let arr1 = [];
        a.map(item => {
          if (item['groupType'] == 1) {
            if (!arr1.includes(item['groupName'])) {
              arr1.push(item['groupName']);
            }
          }
        });
        for (let f of arr1) {
          let b = a.filter(item => {
            if(this.stage){
              return item['groupName'] == f && item['stageId']==this.stage && item['groupType']==1;
            }else{
              return item['groupName'] == f && item['groupType']==1;
            }
          });
          let grand = new Array<NzTreeNodeOptions>();
          for (let grandson of b) {
            grand.push({
              title: grandson['staffName'],
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
      $this.NzTreeNode = node;
    }
  }
  allocation(){
    this.isVisible=true;
    this.id=[];
    this.tableData.map(item=>{
      if(item['checked']==true){
        this.id.push(item['id']) ;
      }
    });
    console.log(this.id);
  }
  retain(id, keepFlag){
    let data={
      "id":id,
      "keepFlag":keepFlag
    };
    this.service.setOverdueOrderKeep(data)
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
          this.getList();
        }
      );
  }
  num(data){
    if(this.searchModel[data]){
      this.searchModel[data]=this.searchModel[data].replace(/[^0-9]/g,'');
    }
  }
  export(){
    this.loading = true ;
    let model=this.searchModel;
    let planRepaymentDateEnd = unixTime(<Date>model.planRepaymentDateEnd,"y-m-d");
    model.planRepaymentDateStart =model.planRepaymentDateStart ? unixTime(<Date>model.planRepaymentDateStart,"y-m-d")+" 00:00:00" : null;
    model.planRepaymentDateEnd =
      planRepaymentDateEnd
        ? planRepaymentDateEnd + " 23:59:59"
        : null;
    let start=(new Date(model.planRepaymentDateStart)).getTime();
    let end=(new Date(model.planRepaymentDateEnd)).getTime();
    if( start - end >0 ){
      model.planRepaymentDateStart=null;
      model.planRepaymentDateEnd=null;
    }

    let remindDateEnd = unixTime(<Date>model.remindDateEnd,"y-m-d");
    model.remindDateStart =model.remindDateStart ? unixTime(<Date>model.remindDateStart,"y-m-d")+" 00:00:00" : null;
    model.remindDateEnd =
      remindDateEnd
        ? remindDateEnd + " 23:59:59"
        : null;
    let remindStart=(new Date(model.remindDateStart)).getTime();
    let remindEnd=(new Date(model.remindDateEnd)).getTime();
    if( remindStart - remindEnd >0 ){
      model.remindDateStart=null;
      model.remindDateEnd=null;
    }



    let data ={
      firmId : this.firmID,
      orderStatus:this.chType,
      type:this.chType,
      planRepaymentDateStart:model.planRepaymentDateStart,
      planRepaymentDateEnd:model.planRepaymentDateEnd,
      dueDays:model.dueDays,
      stageId:model.stageId,
      staffId:model.staffId,
      remindDateStart:model.remindDateStart,
      remindDateEnd:model.remindDateEnd,
      orderType:model.orderType,
      userGrade:model.userGrade,
      orderNo:model.orderNo,
      phonenum:model.phonenum,
      username:model.username,
      currentPage:model.currentPage,
      pageSize:model.pageSize,
      // columns:['due_days'],
      // orderBy:[true]
    };
    this.benchService.exportOverdueOrder(data);
    this.loading = false ;
  }
  toDetail(item){
    let paramData={
      from: "collectionManagebench",
      orderNo: item["orderNo"],
      creditOrderId: item["creditOrderId"],
      staffID: this.staffID,
      staffName: this.staffName,
      userId: item["userId"],
      orderStatus: item["orderStatus"],
      orderId: item["orderId"],
      recallPhone: this.recallPhone,
      recallPhonePassword: this.recallPhonePassword
    };
    let para = ObjToQueryString(paramData);
    window.open(`${window.location.origin+window.location.pathname}#/collectionCenter/collectDetail?${para}`,"_blank");
  }
  authDetail(item){
    let data={
      from: "auth",
      status: item["status"],
      usrId: item["userId"],
      order: item["creditOrderId"],
      orderNo: item["creditOrderNo"]
    };
    let para = ObjToQueryString(data);
    window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");
  }
  getMsgList(){
    let userId:Number = this.staffID // this.sgo.get("loginInfo")['id']
    this.service.getRemindList(userId)
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
          this.msgList = <Array<Object>>res.data
          console.log(this.msgList)
        }
      );
  }
  getAdminReport() {
    const userId = this.staffID ;
    this.benchService.getAdminReport(userId)
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
          if(res.data && res.data['adminReportVO']) {
            let data = res.data['adminReportVO']
            this.onlineHeadcount = data['onlineHeadcount']
            this.headcount = data['headcount'];
            this.todayPushBackOrderNum = data['todayPushBackOrderNum'];
            this.allotOrderTotalNum = data['allotOrderTotalNum'];
            this.todayPushBackMoney = data['todayPushBackMoney'];
            this.pushBackTotalMoney = data['pushBackTotalMoney'];
            this.pushBackNumRanking = data['pushBackNumRanking'];
            this.pushBackTotalMoneyRnaking = data['pushBackTotalMoneyRnaking'];
          }
        }
      );
  }
  dateToString(data){
    if(data){
      return unixTime(new Date(data));
    }else {
      return;
    }
  }
}
