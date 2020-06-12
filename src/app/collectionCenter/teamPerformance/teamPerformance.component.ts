import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../share/table/table.model';
import {dataFormat, DateObjToString, unixTime} from '../../format/index';
import {CommonMsgService} from '../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage/index';
import {ObjToArray} from '../../share/tool/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model/index';
import {ReportService} from '../../service/collectionManagement/report.service';
import {NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd';
import {CaseManagementService} from '../../service/collectionManagement';

let __this;

@Component({
  selector: '',
  templateUrl: './teamPerformance.component.html',
  styleUrls: ['./teamPerformance.component.less']
})
export class TeamPerformanceComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: ReportService,
    private CaseManagementService: CaseManagementService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  reportType: Array<String>;
  groupStatementData: Array<Object>;
  groupStatement : Array<Object>;
  statementData: Array<Object>;
  allOverdueGroup : Array<Object>;
  statement : Array<Object>;
  isSpinning : boolean =false;
  loanTerms : string;
  tableData: TableData;
  staff: Array<Object>;
  userLevel: Array<Object>;
  NzTreeNode : NzTreeNode[];
  groupNzTreeNode : NzTreeNode[];
  recallPhone;
  recallPhonePassword;
  chType:number=2;
  firmID;
  stage;
  productType: Array<String>;
  ngOnInit() {
    __this = this;
    this.searchModel.queryStartTime=unixTime(new Date());
    this.searchModel.queryEndTime=unixTime(new Date());
    this.getLanguage();
    this.getAllOverdueStaff();
    // this.getAllOverdueGroup();
    this.getUserLevel();
  };
  getAllOverdueStaff(){
    let data={
      isPage :false
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
      isPage :false
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
          // this.allOverdueGroup.map(item=>{
          //   if(!arr.includes(item['firmName'])){
          //     arr.push(item['firmName']);
          //   }
          // });
          if(this.firmID){
            this.allOverdueGroup.map(item => {
              if(item['firmId']==this.firmID){
                if (!arr.includes(item['firmName'])) {
                  arr.push(item['firmName']);
                }
              }
            });
          }else{
            this.allOverdueGroup.map(item => {
              if(!arr.includes(item['firmName'])){
                  arr.push(item['firmName']);
                }
            });
          }
          let node = new Array<NzTreeNode>();
          for (let v of arr) {
            let children = new Array<NzTreeNodeOptions>();
            let a;
            if(this.firmID){
              a=this.allOverdueGroup.filter(item=>{
                return item['groupType'] == 1 && item['firmName'] == v  && item['stageId']==this.stage;
              });
            }else{
              a=this.allOverdueGroup.filter(item=>{
                return item['firmName'] == v;
              });
            }
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
          this.reportType=this.languagePack["list"]["reportType"];
          this.productType=this.languagePack["list"]["type"];
          this.loanTerms=this.languagePack["list"]['unit'][0];
          this.statement=this.languagePack["list"]['statement'];
          this.groupStatement=this.languagePack["list"]["groupStatement"]
          this.initGroupStatement();
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
  export(){
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
      groupId : model.groupId,
      staffId : model.staffId,
      firmId: this.firmID
    };
    this.service.exportGroupStatement(data);
  }
  totalSize: number = 0;
  initGroupStatement(){
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['table']['date'],
          reflect: 'date',
          type: 'text',
          filter : ( item ) =>{
            return DateObjToString(new Date(item.date)) ;
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
          type: 'text',
          // filter:(item)=>{
          //   let group=this.staff.filter(v=>{
          //     return v['id']==item['staffId']
          //   });
          //   return group && group[0]["staffName"] ? group[0]["staffName"] : "";
          // }
        },
        {
          name: __this.languagePack['table']['group'],
          reflect: 'groupId',
          type: 'text',
          filter:(item)=>{
            let group=this.allOverdueGroup.filter(v=>{
              return v['id']==item['groupId']
            });
            return group && group[0]["groupName"] ? group[0]["groupName"] : "";
          }
        },
        {
          name: __this.languagePack['table']['casesNumber'],
          reflect: 'finishCaseCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['recallTotal'],
          reflect: 'finishCaseAmount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['casesNumberToday'],
          reflect: 'todayFinishCaseCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['recallTotalToday'],
          reflect: 'todayFinishCaseAmount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['addCasesNumberToday'],
          reflect: 'todayAddedCaseCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['addRecallTotalToday'],
          reflect: 'todayAddedCaseAmount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['currentCasesNumber'],
          reflect: 'currentAllocationCaseCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['currentRecallTotal'],
          reflect: 'currentAllocationCaseAmount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['retainCasesNumber'],
          reflect: 'keepCaseCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['retainRecallTotal'],
          reflect: 'keepCaseAmount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['failCasesNumber'],
          reflect: 'failCaseCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['failRecallTotal'],
          reflect: 'failCaseAmount',
          type: 'text'
        }
      ]
    };
    this.getList();
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
          // if (item['groupType'] == 1) {
            if (!arr.includes(item['firmName'])) {
              arr.push(item['firmName']);
            }
          // }
        });
      }
      let node = new Array<NzTreeNode>();
      let $this = this;
      for (let v of arr) {
        let children = new Array<NzTreeNodeOptions>();
        let a;
        if(this.firmID){
          a = staffAll.filter(item => {
            return item['firmName'] == v && item['stageId']==this.stage;
          });
        }else{
          a = staffAll.filter(item => {
            return item['firmName'] == v ;
          });
        }
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
          let b ;
          if(this.firmID){
            b = a.filter(item => {
              return item['groupName'] == f && item['stageId']==this.stage;
            });
          }else{
            b = a.filter(item => {
              return item['groupName'] == f;
            });
          }
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
  getList(){
    let model=this.searchModel;
    this.isSpinning=true;
    let etime = unixTime(<Date>model.queryEndTime,"y-m-d");
    model.queryStartTime = model.queryStartTime ? unixTime((<Date>model.queryStartTime),"y-m-d")+" 00:00:00" : null;
    model.queryEndTime = etime ? etime + " 23:59:59" : etime;
    let start=(new Date(model.queryStartTime)).getTime();
    let end=(new Date(model.queryEndTime)).getTime();
    if( start - end >0 ){
      model.queryStartTime=null;
      model.queryEndTime=null;
    }

    this.CaseManagementService.getStaffID()
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
          if (res["data"]) {
            this.stage = res["data"]['stageId'];
            this.recallPhone = res["data"]['recallPhone'];
            this.recallPhonePassword = res["data"]['recallPhonePassword'];
            this.searchModel.stageId = res["data"]['stageId'];
          } else {
            this.stage = null;
          }
          this.CaseManagementService.getFirmID()
            .pipe(
              filter((res: Response) => {
                if (res.success === false) {
                  this.msg.fetchFail(res.message);
                }
                return res.success === true;
              })
            )
            .subscribe(
              (res: Response) => {
                this.firmID = res["data"];
                this.getAllOverdueGroup();
                let data = {
                  pageSize: model.pageSize,
                  currentPage: model.currentPage,
                  firmId: this.firmID,
                  queryStartTime: model.queryStartTime,
                  queryEndTime: model.queryEndTime,
                  groupId: model.groupId,
                  staffId: model.staffId,
                  stageId: model.stageId
                };
                this.service.getGroupStatement(data)
                  .pipe(
                    filter((res: Response) => {
                      this.isSpinning = false;
                      if (res.success === false) {
                        this.msg.fetchFail(res.message);
                      }
                      return res.success === true;
                    })
                  )
                  .subscribe(
                    (res: Response) => {
                      this.groupStatementData = (< Array<Object> >res.data);
                      this.tableData.data = this.groupStatementData['list'];
                      if (res.page) {
                        this.totalSize = res.page["totalNumber"] || 0;
                      }else{
                        this.totalSize = 0;
                      }
                    }
                  );
              }
            );
        }
      )
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    }
    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    }
    this.getList();
  };
  reset(){
    this.searchModel = new SearchModel ;
    this.searchModel.queryStartTime=unixTime(new Date());
    this.searchModel.queryEndTime=unixTime(new Date());
    this.getList();
  };
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList();
  };
  type(data){
    if(data==1){
      this.loanTerms=this.languagePack["list"]['unit'][1];
    }else{
      this.loanTerms=this.languagePack["list"]['unit'][0];
    }
  }
}
