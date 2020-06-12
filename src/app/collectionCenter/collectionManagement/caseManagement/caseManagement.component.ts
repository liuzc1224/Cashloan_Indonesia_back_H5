import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {dataFormat, DateObjToString, unixTime} from '../../../format/index';
import {CommonMsgService, MsgService} from '../../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage/index';
import {ObjToArray} from '../../../share/tool/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model/index';
import {CaseManagementService} from '../../../service/collectionManagement/caseManagement.service';
import {CollectionBusiness} from '../../../service/collectionBusiness';
import { NzTreeNode,NzTreeNodeOptions } from 'ng-zorro-antd';
import {ObjToQueryString} from "../../../service/ObjToQueryString";

let __this;

@Component({
  selector: '',
  templateUrl: './caseManagement.component.html',
  styleUrls: ['./caseManagement.component.less']
})
export class CaseManagementComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: CaseManagementService,
    private CollectionBusiness:CollectionBusiness
  ) {
  } ;
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
  checkedNumber : number = 0;
  ngOnInit() {
    __this = this;
    this.getLanguage();
    this.validForm = this.fb.group({
      "name" : [null , [Validators.required] ] ,
    });
    this.getStage();
    this.getAllOverdueStaff();
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
          };
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
  searchData(){
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
      orderStatus:this.chType,
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
      isAscend:model.isAscend,
      username:model.username,
      currentPage:model.currentPage,
      pageSize:model.pageSize,
      columns:['due_days'],
      orderBy:[true]
    };
    return data;
  }
  totalSize: number = 0;

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
          }
          this.tableData = data;
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
    this.getList() ;
  };
  toDetail(item){
    let paramData={
      from: "caseManagement",
      orderNo: item["orderNo"],
      userId: item["userId"],
      creditOrderId: item["creditOrderId"],
      orderStatus: item["orderStatus"],
      orderId: item["orderId"],
      staffID: item['staffID'],
      staffName: item['staffName']
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
  reset(){
    this.searchModel = new SearchModel ;
    this.searchModel.isAscend= null;
    this.getList() ;
  };
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  };
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
    if(this.tableData){
      this.tableData.forEach(data =>
        data['orderStatus']==4 || data['orderStatus']==6|| data['orderStatus']==9|| data['orderStatus']==10|| data['orderStatus']==12|| data['orderStatus']==13|| data['orderStatus']==14 ? data['checked'] = data['checked'] : data['checked'] = value
      );
      this.refreshStatus();
    }
  }
  getPersonnel(){
    let arr=[];
    if(this.staff) {
      let staffAll=this.staff.filter(item=>{
        return item['status'] == 2 ;
      });
      staffAll.map(item => {
        if (item['groupType'] == 1) {
          if (!arr.includes(item['firmName'])) {
            arr.push(item['firmName']);
          }
        }
      });
      let node = new Array<NzTreeNode>();
      let $this = this;
      for (let v of arr) {
        let children = new Array<NzTreeNodeOptions>();
        let a = staffAll.filter(item => {
          return item['firmName'] == v;
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
            return item['groupName'] == f && item['groupType']==1;
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
      this.staff.map(item => {
        if (item['groupType'] == 1) {
          if (!arr.includes(item['firmName'])) {
            arr.push(item['firmName']);
          }
        }
      });
      let node = new Array<NzTreeNode>();
      let $this = this;
      for (let v of arr) {
        let children = new Array<NzTreeNodeOptions>();
        let a = this.staff.filter(item => {
          return item['firmName'] == v;
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
            return item['groupName'] == f && item['groupType']==1;
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
  }
  retain(id,keepFlag){
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
    let data=this.searchData();
    this.service.exportOverdueOrder(data);
    this.loading = false ;
  }
  dateToString(data){
    if(data){
      return unixTime(new Date(data));
    }else {
      return;
    }
  }
  sort(data){
    if(data==="descend"){
      this.searchModel.isAscend=false;
    } else{
      this.searchModel.isAscend=true;
    }
    this.getList();
  }
}
