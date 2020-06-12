import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../../share/table/table.model';
import {CommonMsgService,MsgService} from '../../../service/msg';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model';
import {SearchModel} from "./searchModel";
import {repaymentNoticeService} from '../../../service/fincial';
import {unixTime} from '../../../format';
import {ObjToQueryString} from "../../../service/ObjToQueryString";
let __this ;
let __id;
declare var $: any;
@Component({
  selector : "" ,
  templateUrl : "./repaymentNotice.component.html" ,
  styleUrls : ['./repaymentNotice.component.less']
})
export class RepaymentNoticeComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private msg : MsgService ,
    private Cmsg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : repaymentNoticeService ,

  ){} ;
  validForm : FormGroup;
  languagePack : Object ;
  tableData : TableData ;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  searchEnum: Array<Object>;
  selectModel:string="orderNo";
  inputContent:string="";
  totalSize : number = 0 ;
  title:String="";
  feedBackInfo : Array<any>=[];
  searchModel : SearchModel = new SearchModel() ;
  isShowCall: boolean = false;
  isBigImg: boolean = false;
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "id":[null , [Validators.required] ],
      "userId":[null , [Validators.required] ],
      "userImg":[null],
      "userAccount":[null , [Validators.required] ],
      "orderNo":[null , [Validators.required] ],
      "repayType":[null , [Validators.required] ],
      "repayMoney":[null , [Validators.required] ],
      "repayProof":[null],
      "status":[null , [Validators.required] ],
      "remark":[null]
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["financeModule.repaymentNotice","common",])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['financeModule.repaymentNotice'],
            table:data['financeModule.repaymentNotice']['table']
          };
          this.searchEnum=this.languagePack['data']['search'];
          this.initialTable();
        }
      )
  };
  initialTable(){
    this.tableData = {
      loading:false,
      showIndex : true ,
      tableTitle : [
        {
          name : __this.languagePack['table']['submitTime'] ,
          reflect : "createTime" ,
          type : "text"
        },
        {
          name : __this.languagePack['table']['userAccount'] ,
          reflect : "userAccount" ,
          type : "text"
        },
        {
          name : __this.languagePack['table']['userName'] ,
          reflect : "username" ,
          type : "text"
        },
        {
          name : __this.languagePack['table']['loanOrderNo'] ,
          reflect : "orderNo" ,
          type : "text"
        },
        {
          name : __this.languagePack['table']['state'] ,
          reflect : "status" ,
          type : "text",
            filter: (item)=>{
            const status = item['status'];
            const map = __this.languagePack['table']['solve'];
            let name = map.filter(item => {
                return item.value == status;
            });
            return (name && name[0].desc) ? name[0].desc : "";
            }
        },
        {
          name : __this.languagePack['table']['remark'] ,
          reflect : "remark" ,
          type : "text"
        },
        {
          name : __this.languagePack['table']['operateName'] ,
          reflect : "modifier" ,
          type : "text"
        },
        {
          name : __this.languagePack['table']['operateTime'] ,
          reflect : "modifyTime" ,
          type : "text"
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['table']['operate'],
        data : [
          {
            textColor : "#0000ff",
            name : __this.languagePack['table']['show'],
            bindFn : (item) => {
              this.getInfo(item['id']);
            }
          }
        ]
      }
    };
    this.getList();
  }
  getList(){
    this.tableData.loading = true ;
    this.searchModel[this.selectModel]=this.inputContent;

    if(this.searchModel.startDate!==null){
      this.searchModel.startDate=unixTime(this.searchModel.startDate, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.endDate!==null){
      this.searchModel.endDate=unixTime(this.searchModel.endDate, 'y-m-d')+" 23:59:59";
    }
    let data=this.searchModel;
    this.service.getList(data)
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
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize =0;
          }
          this.tableData.loading = false ;
        }
      );
  }
  changeSelect(){
    this.searchModel.orderNo=null;
    this.searchModel.tel=null;
    this.searchModel.username=null;
    this.searchModel[this.selectModel]=this.inputContent;
  };
  showImg(index) {
    $("[data-magnify=gallery]")[index].click();
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
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.selectModel="orderNo";
    this.inputContent="";
    this.getList();
  };
  getInfo(id){
    this.service.getThis(id)
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
          this.validForm.patchValue({
            "id":res.data["id"],
            "userId":res.data["userId"],
            "userImg":"",
            "userAccount":res.data["userAccount"],
            "orderNo":res.data["orderNo"],
            "repayType":res.data["repayType"],
            "repayMoney":res.data["repayMoney"],
            "repayProof":res.data["repayProof"],
            "status":res.data["status"],
            "remark":res.data["remark"],
          });
          setTimeout(() => {
            $("[data-magnify=gallery]").magnify();
          }, 20);
          this.isVisible=true;
          this.service.getUserHeaderImg(res.data['userId'])
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
              // console.log(res.data["headPortrait"])
              this.validForm.patchValue({
                "userImg":res.data["headPortrait"]
              });
            })
        }
      );
  }
  handleOk(){
    this.isOkLoading = true;
    let valid = this.validForm.valid ;
    if(!valid){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }
    // 仅仅提交可修改的参数
    let data={"id":this.validForm.value.id,"status":this.validForm.value.status,"remark":this.validForm.value.remark}
    this.service.updateRepaymentNotice(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.isVisible=false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.isVisible=false;
  };
  toUserAccountMore(userId){
    // console.log(userId)
    let paramData={
      from:'/finance/management/repaymentNotice',
      usrId:userId
    };
    let para = ObjToQueryString(paramData);
    window.open(`${window.location.origin+window.location.pathname}#/usr/detail?${para}`,"_blank");

  //   this.sgo.set("routerInfo" , {
  //     parentName :__this.languagePack['data']['inModal']['tobefore'],
  //     menuName :__this.languagePack['data']['inModal']['toafter']
  // }) ;
  //   this.router.navigate(['/usr/detail'], {
  //     queryParams: {
  //       from:'/finance/management/repaymentNotice',
  //       usrId:userId
  //     }
  //   });
  };
}
