import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {dataFormat, DateObjToString, unixTime} from '../../../format/index';
import {CommonMsgService} from '../../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage/index';
import {ObjToArray} from '../../../share/tool/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model/index';
import {ReportService} from '../../../service/collectionManagement/report.service';
import {NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd';
import {injectTemplateRef} from '@angular/core/src/render3';
import {group} from '@angular/animations';
import {MemberManagementService} from "../../../service/collectionManagement";
import {CollectionBusiness} from "../../../service/collectionBusiness";

let __this;

@Component({
  selector: '',
  templateUrl: './groupReport.component.html',
  styleUrls: ['./groupReport.component.less']
})
export class GroupReportComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: ReportService,
    private MemberManagementService: MemberManagementService,
    private CollectionBusiness:CollectionBusiness
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  groupType: Array<String>;
  groupStatement : Array<Object>;
  allOverdueGroup : Array<Object>;
  statement : Array<Object>;
  loanTerms : string;
  tableData: TableData;
  staff: Array<Object>;
  userLevel: Array<Object>;
  NzTreeNode : NzTreeNode[];
  groupNzTreeNode : NzTreeNode[];
  allOverdueFirm: Array<Object>;
  allStage;
  chType:number=1;
  productType: Array<String>;
  ngOnInit() {
    __this = this;
    this.getLanguage();
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
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allStage = (< Array<Object> >res.data).filter(item=>{
            return item['state'] == "ACTIVATE" ;
          });
          let obj=[{
            phaseName:this.languagePack['common']['all'],
            id:""
          }];
          this.allStage=obj.concat(this.allStage);
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
    this.service.getAllOverdueStaff(data)
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
          this.getPersonnel();
        }
      );
  }
  getAllOverdueGroup(){
    let $this=this;
    let data={
      isPage:false
    };
    this.service.getAllOverdueGroup(data)
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
  getLanguage() {
    this.translateSer.stream(['collectionManagement.report', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['collectionManagement.report'],
            table:data['collectionManagement.report']['table']
          };
          this.groupType=this.languagePack["list"]["groupType"];
          this.productType=this.languagePack["list"]["type"];
          this.loanTerms=this.languagePack["list"]['unit'][0];
          this.statement=this.languagePack["list"]['statement'];
          this.groupStatement=this.languagePack["list"]["groupStatement"];
          this.searchModel.queryStartTime = unixTime((new Date()),"y-m-d");
          this.searchModel.queryEndTime = unixTime((new Date()),"y-m-d");
          this.getAllOverdueStaff();
          this.getAllOverdueGroup();
          this.getUserLevel();
          this.getAllOverdueFirm();
          this.getStage();
          this.initialTable();
        }
      );
  };
  getUserLevel(){
    let data={
      isPage:false
    };
    this.service.loanUser(data)
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
          this.userLevel = (< Array<Object> >res.data).filter(item=>{
            return item['status'] == 1 ;
          });
        }
      );
  };
  changeStatus(data){
    this.chType=data;
    this.searchModel.queryStartTime = unixTime((new Date()),"y-m-d");
    this.searchModel.queryEndTime = unixTime((new Date()),"y-m-d");
    this.initialTable();
  }
  initialTable() {
    if(this.chType==1){
      this.initTotal();
    }
    if(this.chType==2){
      this.initDetails();
    }
  }
  initTotal(){
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['table']['account'],
          reflect: 'username',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['name'],
          reflect: 'staffName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['group'],
          reflect: 'groupName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['company'],
          reflect: 'firmName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['casesNumberTodaySuccess'],
          reflect: 'todayFinishCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["todayFinishCaseCount"]==null ? 0 : item["todayFinishCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['recallTotalToday'],
          reflect: 'todayFinishCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["todayFinishCaseAmount"]==null ? 0 : item["todayFinishCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['beforeStayNumber'],
          reflect: 'beforCount',
          type: 'text',
          filter:(item)=>{
            return item["beforCount"]==null ? 0 : item["beforCount"];
          }
        },
        {
          name: __this.languagePack['table']['addCasesNumberToday'],
          reflect: 'todayAddedCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["todayAddedCaseCount"]==null ? 0 : item["todayAddedCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['addRecallTotalToday'],
          reflect: 'todayAddedCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["todayAddedCaseAmount"]==null ? 0 : item["todayAddedCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['distribution'],
          reflect: 'allotOtherCount',
          type: 'text',
          filter:(item)=>{
            return item["allotOtherCount"]==null ? 0 : item["allotOtherCount"];
          }
        },
        {
          name: __this.languagePack['table']['needCasesNumber'],
          reflect: 'todayUrgentRecallCount',
          type: 'text',
          filter:(item)=>{
            return item["todayUrgentRecallCount"]==null ? 0 : item["todayUrgentRecallCount"];
          }
        },
        {
          name: __this.languagePack['table']['currentCasesNumber'],
          reflect: 'currentAllocationCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["currentAllocationCaseCount"]==null ? 0 : item["currentAllocationCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['currentRecallTotal'],
          reflect: 'currentAllocationCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["currentAllocationCaseAmount"]==null ? 0 : item["currentAllocationCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['retainCasesNumber'],
          reflect: 'keepCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["keepCaseCount"]==null ? 0 : item["keepCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['retainRecallTotal'],
          reflect: 'keepCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["keepCaseAmount"]==null ? 0 : item["keepCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['failCasesNumber'],
          reflect: 'failCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["failCaseCount"]==null ? 0 : item["failCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['failRecallTotal'],
          reflect: 'failCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["failCaseAmount"]==null ? 0 : item["failCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['recallRate'],
          reflect: 'urgentRecallSuccessRatio',
          type: 'text',
          filter : (item) => {
            let urgentRecallSuccessRatio =item['urgentRecallSuccessRatio'];
            if(urgentRecallSuccessRatio!=null){
              return (urgentRecallSuccessRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        },
        {
          name: __this.languagePack['table']['failureRate'],
          reflect: 'urgentRecallFailRatio',
          type: 'text',
          filter : (item) => {
            let urgentRecallFailRatio =item['urgentRecallFailRatio'];
            if(urgentRecallFailRatio!=null){
              return (urgentRecallFailRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        }
      ]
    };
    this.getList();
  }
  initDetails(){
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['table']['date'],
          reflect: 'date',
          type: 'text',
          filter:(item)=>{
            if(item['date']){
              return  unixTime((new Date(item['date'])),"y-m-d");
            }
          }
        },
        {
          name: __this.languagePack['table']['account'],
          reflect: 'username',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['name'],
          reflect: 'staffName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['group'],
          reflect: 'groupName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['company'],
          reflect: 'firmName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['casesNumberTodaySuccess'],
          reflect: 'todayFinishCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["todayFinishCaseCount"]==null ? 0 : item["todayFinishCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['recallTotalToday'],
          reflect: 'todayFinishCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["todayFinishCaseAmount"]==null ? 0 : item["todayFinishCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['beforeStayNumber'],
          reflect: 'beforCount',
          type: 'text',
          filter:(item)=>{
            return item["beforCount"]==null ? 0 : item["beforCount"];
          }
        },
        {
          name: __this.languagePack['table']['addCasesNumberToday'],
          reflect: 'todayAddedCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["todayAddedCaseCount"]==null ? 0 : item["todayAddedCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['addRecallTotalToday'],
          reflect: 'todayAddedCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["todayAddedCaseAmount"]==null ? 0 : item["todayAddedCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['distribution'],
          reflect: 'allotOtherCount',
          type: 'text',
          filter:(item)=>{
            return item["allotOtherCount"]==null ? 0 : item["allotOtherCount"];
          }
        },
        {
          name: __this.languagePack['table']['needCasesNumber'],
          reflect: 'todayUrgentRecallCount',
          type: 'text',
          filter:(item)=>{
            return item["todayUrgentRecallCount"]==null ? 0 : item["todayUrgentRecallCount"];
          }
        },
        {
          name: __this.languagePack['table']['currentCasesNumber'],
          reflect: 'currentAllocationCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["currentAllocationCaseCount"]==null ? 0 : item["currentAllocationCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['currentRecallTotal'],
          reflect: 'currentAllocationCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["currentAllocationCaseAmount"]==null ? 0 : item["currentAllocationCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['retainCasesNumber'],
          reflect: 'keepCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["keepCaseCount"]==null ? 0 : item["keepCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['retainRecallTotal'],
          reflect: 'keepCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["keepCaseAmount"]==null ? 0 : item["keepCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['failCasesNumber'],
          reflect: 'failCaseCount',
          type: 'text',
          filter:(item)=>{
            return item["failCaseCount"]==null ? 0 : item["failCaseCount"];
          }
        },
        {
          name: __this.languagePack['table']['failRecallTotal'],
          reflect: 'failCaseAmount',
          type: 'text',
          filter:(item)=>{
            return item["failCaseAmount"]==null ? 0 : item["failCaseAmount"];
          }
        },
        {
          name: __this.languagePack['table']['recallRate'],
          reflect: 'urgentRecallSuccessRatio',
          type: 'text',
          filter : (item) => {
            let urgentRecallSuccessRatio =item['urgentRecallSuccessRatio'];
            if(urgentRecallSuccessRatio!=null){
              return (urgentRecallSuccessRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        },
        {
          name: __this.languagePack['table']['failureRate'],
          reflect: 'urgentRecallFailRatio',
          type: 'text',
          filter : (item) => {
            let urgentRecallFailRatio =item['urgentRecallFailRatio'];
            if(urgentRecallFailRatio!=null){
              return (urgentRecallFailRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        }
      ]
    };
    this.getList();
  }
  export(){
    if(this.chType==1){
      this.exportTotal();
    }
    if(this.chType==2){
      this.exportDetails();
    }
  }
  exportTotal(){
    let data =this.searchData();
    this.service.exportUrgentRecallGroupStatementTotal(data);
  }
  exportDetails(){
    let data =this.searchData();
    this.service.exportUrgentRecallGroupStatementDetail(data);
  }
  totalSize: number = 0;
  getPersonnel(){
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
        let personnelType = $this.languagePack['list']['personnelType'];
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
            return item['groupName'] == f;
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

  searchData(){
    let model=this.searchModel;
    let etime = unixTime(<Date>model.queryEndTime,"y-m-d");
    model.queryStartTime = model.queryStartTime ? unixTime((<Date>model.queryStartTime),"y-m-d")+" 00:00:00" : null;
    model.queryEndTime = etime ? etime + " 23:59:59" : etime;
    let start=(new Date(model.queryStartTime)).getTime();
    let end=(new Date(model.queryEndTime)).getTime();
    if( start - end >0 ){
      model.queryStartTime=null;
      model.queryEndTime=null;
    }
    let data ={
      queryStartTime : model.queryStartTime,
      queryEndTime : model.queryEndTime,
      stageId : model.stageId,
      firstLoan : model.firstLoan,
      loanProductType : model.loanProductType,
      groupId : model.groupId,
      staffId : model.staffId,
      pageSize : model.pageSize,
      currentPage : model.currentPage,
    };
    return data;
  }
  getList(){
    let data=this.searchData();
    this.tableData.loading=true;
    if(this.chType==1){
      this.service.getUrgentRecallGroupStatementTotal(data)
        .pipe(
          filter( (res : Response) => {
            this.tableData.loading=false;
            if(res.success === false){
              this.msg.fetchFail(res.message) ;
            };
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
    if(this.chType==2){
      this.service.getUrgentRecallGroupStatementDetail(data)
        .pipe(
          filter( (res : Response) => {
            this.tableData.loading=false;
            if(res.success === false){
              this.msg.fetchFail(res.message) ;
            };
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
    this.searchModel.queryStartTime = unixTime((new Date()),"y-m-d");
    this.searchModel.queryEndTime = unixTime((new Date()),"y-m-d");
    this.initialTable();
  };
  search(){
    this.searchModel.currentPage = 1 ;
    this.initialTable();
  };
  type(data){
    if(data==1){
      this.loanTerms=this.languagePack["list"]['unit'][1];
    }else{
      this.loanTerms=this.languagePack["list"]['unit'][0];
    }
  }
}
