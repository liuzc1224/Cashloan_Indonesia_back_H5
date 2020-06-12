import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {TableData} from '../../share/table/table.model';
import {CommonMsgService, MsgService} from '../../service/msg';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage';
import {SearchModel} from './searchModel';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model';
import {UserLevelService} from '../../service/productCenter';
import {unixTime} from '../../format';

let __this;

@Component({
  selector: '',
  templateUrl: './userLevel.component.html',
  styleUrls: ['./userLevel.component.less']
})
export class UserLevelComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: UserLevelService,
  ) {
  } ;

  languagePack: Object;
  tableData: TableData;
  searchModel : SearchModel = new SearchModel() ;
  inputData:Array< String >;
  StateData:Array< String >;
  typeData:Array< String >;
  showStatusData:Array< String >;
  crowd={};
  inputValue='id';
  totalSize : number = 0 ;
  isVisible:Boolean=false;
  isOkLoading:Boolean=false;
  isRealtimeLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  validForm : FormGroup;
  isDelete:Boolean=false;
  lastNormalSettleData:Array< String >;
  objectKeys = Object.keys;
  ngOnInit() {
    __this = this;
    this.getLoanProduct();
    this.validForm = this.fb.group({
      "id":null,
      "userLevelName" : [null , [Validators.required] ] ,
      "loanProductIdList" : [[] , [Validators.required] ] ,
      "showLoanProductIdList" : [[]] ,
      "status" : [1,[Validators.required]] ,
      "rState":[false],
      "repetitionLoanNum":null,
      "hState":[false],
      "historyOverdueNum":null,
      "lState":[false],
      "lastNormalSettle":[1],
      "tState":[false],
      "telecomScore":null,
      "cState":[false],
      "creditScore":null,
      "dState":[false],
      "lastDueDays":null,
    });
    this.getLanguage();
  };

  getLanguage() {
    this.translateSer.stream(['productCenter.userLevel', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['productCenter.userLevel']['list']
          };
          this.inputData=data['productCenter.userLevel']['input'];
          this.StateData=data['productCenter.userLevel']['state'];
          this.typeData=data['productCenter.userLevel']['type'];
          this.showStatusData=data['productCenter.userLevel']['showStatus'];
          this.lastNormalSettleData=data['productCenter.userLevel']['type'];
        }
      );
    this.initialTable();
  };

  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: false,
      tableTitle: [
        {
          name: __this.languagePack['list']['id'],
          reflect: "id",
          type: "text"
        },
        {
          name: __this.languagePack['list']['name'],
          reflect: "userLevelName",
          type: "text"
        },
        {
          name: __this.languagePack['list']['creationTime'],
          reflect: "createTime",
          type: "text",
          // filter:(item)=>{
          //   return item['createTime'] ? unixTime(item['createTime']) : "";
          // }
        },
        {
          name: __this.languagePack['list']['updateTime'],
          reflect: "modifyTime",
          type: "text",
          // filter:(item)=>{
          //   if(item['modifyTime']){
          //     return unixTime(item['modifyTime']);
          //   }
          // }
        },
        {
          name: __this.languagePack['list']['operator'],
          reflect: "modifyOperatorName",
          type: "text"
        },
        {
          name: __this.languagePack['list']['pastSuccessfulBorrowings'],
          reflect: "repetitionLoanNum",
          type: "text"
        },
        {
          name: __this.languagePack['list']['historicalOverdue'],
          reflect: "historyOverdueNum",
          type: "text"
        },
        {
          name: __this.languagePack['list']['whetherSettle'],
          reflect: "lastNormalSettle",
          type: "text",
          filter: (item) => {
            if(item['lastNormalSettle']!=null){
              let type=__this.typeData.filter(v => {
                return v.value==item['lastNormalSettle']
              });
              return (type && type[0]['desc']) ? type[0]['desc'] : "";
            }

          }
        },
        {
          name: __this.languagePack['list']['lastOverdueDays'],
          reflect: "lastDueDays",
          type: "text"
        },
        {
          name: __this.languagePack['list']['telecomScore'],
          reflect: "telecomScore",
          type: "text"
        },
        {
          name: __this.languagePack['list']['creditScore'],
          reflect: "creditScore",
          type: "text"
        },
        {
          name: __this.languagePack['list']['optional'],
          reflect: "loanProductIdList",
          type: "text",
          filter: (item) => {
            let name="";
            let arr=item['loanProductIdList'];
            if(arr){
              for(let a of arr){
                if(__this.crowd[a]){
                  name+=","+__this.crowd[a]+"  "
                }
              }
            }
            return (name) ? name.substring(1,name.length) : "";
          }
        },
        {
          name: __this.languagePack['list']['notOptional'],
          reflect: "showLoanProductIdList",
          type: "text",
          filter: (item) => {
            let name="";
            let arr=item['showLoanProductIdList'];
            if(arr){
              for(let a of arr){
                if(__this.crowd[a]){
                  name+=","+__this.crowd[a]+"  "
                }
              }
            }
            return (name) ? name.substring(1,name.length) : "";
          }
        },
        // {
        //   name: __this.languagePack['list']['displayStatus'],
        //   reflect: "showStatus",
        //   type: "text",
        //   filter: (item) => {
        //     if(item['showStatus']!=null){
        //       let type=__this.showStatusData.filter(v => {
        //         return v.value==item['showStatus']
        //       });
        //       return (type && type[0]['desc']) ? type[0]['desc'] : "";
        //     }
        //
        //   }
        // },
        {
          name: __this.languagePack['list']['status'],
          reflect: "status",
          type: "text",
          filter: (item) => {
            let type=__this.StateData.filter(v => {
              return v.value==item['status']
            });
            return (type && type[0]['desc']) ? type[0]['desc'] : "";
          }
        }
      ],
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [{
          textColor: "#0000ff",
          name: __this.languagePack['common']['operate']['edit'],
          bindFn: (item) => {
            let rState,hState,lState,tState,cState,dState;
            let lastNormalSettle=item.lastNormalSettle;
            if(!lastNormalSettle){
              lastNormalSettle=1;
            }
            let loanProductIdList,showLoanProductIdList;
            if(item.loanProductIdList){
              loanProductIdList=item.loanProductIdList.map(v=>{
                return v=v+"";
              });
            }
            if(item.showLoanProductIdList){
              showLoanProductIdList=item.showLoanProductIdList.map(v=>{
                return v=v+"";
              });
            }
            this.optionalData=this.crowd;
            this.notOptionalData=this.crowd;
            rState= item && item['repetitionLoanNum'] ? true : false ;
            hState= item && item['historyOverdueNum'] ? true : false ;
            lState= item && item['lastNormalSettle'] ? true : false ;
            tState= item && item['telecomScore'] ? true : false ;
            cState= item && item['creditScore'] ? true : false ;
            dState= item && item['lastDueDays'] ? true : false ;
            this.validForm.patchValue({
              id:item.id,
              userLevelName : item.userLevelName ,
              loanProductIdList : loanProductIdList ,
              showLoanProductIdList : showLoanProductIdList ,
              status : item.status ,
              // showStatus : item.showStatus ,
              repetitionLoanNum:item.repetitionLoanNum,
              historyOverdueNum:item.historyOverdueNum,
              lastNormalSettle:lastNormalSettle,
              telecomScore:item.telecomScore,
              creditScore:item.creditScore,
              lastDueDays:item.lastDueDays,
              rState:rState,
              hState:hState,
              lState:lState,
              tState:tState,
              cState:cState,
              dState:dState,
            });
            this.isVisible=true;
          }
        }
        // ,{
        //   textColor: "#0000ff",
        //   name: __this.languagePack['common']['operate']['delete'],
        //   bindFn: (item) => {
        //     this.isDelete=true;
        //     this.sgo.set('UserLevelId', {
        //       id: item.id,
        //     });
        //   }
        // }
        ]
      }
    };
    this.getList();
  }
  getLoanProduct(){
    this.service.getLoanProduct()
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          __this.crowd=(< Array<Object> >res.data);
          console.log(__this.crowd)
        }
      );
  }
  getList(){
    this.tableData.loading = true ;
    let model=this.searchModel;
    model.columns=['status'];
    model.orderBy=[false];
    this.service.getUserLevel(model)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          console.log(res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize = 0;
          }
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
  add(){
    this.validForm.reset();
    this.validForm.patchValue({
      loanProductNames : [] ,
      status : 1 ,
      lastNormalSettle:1,
    });
    this.isVisible=true;
  }
  search(){
    this.getList();
  }
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  }
  keyupId(){
    let val=this.searchModel.id;
    this.searchModel.id=val.replace(/[^0-9]/g,'');
    console.log(this.searchModel.id);
  }
  handleOk(){
    this.isOkLoading = true;
    let valid = this.validForm.valid;
    let data = this.validForm.value;
    if (!valid ){
      this.isOkLoading = false;
      // this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      for (const i in this.validForm.controls) {
        this.validForm.controls[i].markAsDirty();
        this.validForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    let postData={
      id:data.id,
      userLevelName : data.userLevelName ,
      loanProductIdList : data.loanProductIdList ,
      showLoanProductIdList : data.showLoanProductIdList,
      status : data.status,
    };
    if(data.rState){
      postData['repetitionLoanNum']=data['repetitionLoanNum'];
    }else{
      postData['repetitionLoanNum']=null;
    }
    if(data.hState){
      postData['historyOverdueNum']=data['historyOverdueNum'];
    }else{
      postData['historyOverdueNum']=null;
    }
    if(data.lState){
      postData['lastNormalSettle']=data['lastNormalSettle'];
    }else{
      postData['lastNormalSettle']=null;
    }
    if(data.tState){
      postData['telecomScore']=data['telecomScore'];
    }else{
      postData['telecomScore']=null;
    }
    if(data.cState){
      postData['creditScore']=data['creditScore'];
    }else{
      postData['creditScore']=null;
    }
    if(data.dState){
      postData['lastDueDays']=data['lastDueDays'];
    }else{
      postData['lastDueDays']=null;
    }
    // postData.loanProductIds=postData.loanProductIds.join("_");
    console.log(postData);

    if(postData["id"]){
      this.updateUserLevel(postData);
    }else{
      this.addUserLevel(postData);
    }
  }
  updateUserLevel(data){
    this.isOkLoading=true;
    this.service.updateUserLevel(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          console.log(res.data);
          this.isVisible = false;
          this.getList();
        }
      );
  }
  addUserLevel(data){
    this.isOkLoading=true;
    this.service.addUserLevel(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          console.log(res.data);
          this.isVisible = false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.validForm.reset();
    this.isVisible=false;
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("UserLevelId").id
    };
    this.service.deleteUserLevel(data)
      .pipe(
        filter( (res : Response) => {
          this.isDeleteLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.isDelete=false;
          this.getList();
        }
      );
  }
  realtimeUpdate(){
    this.isRealtimeLoading=true;
    this.service.realtimeUpdate()
      .pipe(
        filter( (res : Response) => {
          this.isRealtimeLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.getList();
        }
      );
  }
  optionalData={};
  notOptionalData={};
  getOptional(){
    if(this.validForm.value['showLoanProductIdList']){
      let obj=JSON.parse(JSON.stringify(this.crowd));
      this.validForm.value['showLoanProductIdList'].forEach(v=>{
        delete obj[v]
      });
      this.optionalData=obj;
    }else{
      this.optionalData=this.crowd;
    }

  }
  getNotOptional(){
    if(this.validForm.value['loanProductIdList']){
      let obj=JSON.parse(JSON.stringify(this.crowd));
      this.validForm.value['loanProductIdList'].forEach(v=>{
        delete obj[v]
      })
      this.notOptionalData=obj;
    }else{
      this.notOptionalData=this.crowd;
    }
  }
}
