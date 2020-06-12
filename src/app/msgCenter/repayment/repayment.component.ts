import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../share/table/table.model';
import {CommonMsgService,MsgService} from '../../service/msg';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model';
import {SearchModel} from "./searchModel";
import {RepaymentService} from '../../service/msgCenter';
import { unixTime} from '../../format';
import {ObjToQueryString} from "../../service/ObjToQueryString";
let __this ;
let __id;
declare var $: any;
@Component({
  selector : "" ,
  templateUrl : "./repayment.component.html" ,
  styleUrls : ['./repayment.component.less']
})
export class RepaymentComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private msg : MsgService ,
    private Cmsg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : RepaymentService ,

  ){} ;
  validForm : FormGroup;
  languagePack : Object ;
  tableData : TableData ;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  title:String="";
  repaymentInfo : Array<any>=[];
  searchModel : SearchModel = new SearchModel() ;
  isShowCall: boolean = false;
  isBigImg: boolean = false;
  ngOnInit(){
    __this = this ;
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["msgCenter.repaymentInfo","common",])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['msgCenter.repaymentInfo'],
          };
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
          name : __this.languagePack['data']['date'] ,
          reflect : "createTime" ,
          type : "text",
          filter: (item)=>{
            return item['createTime'] ? unixTime(item['createTime']) : "";
          }
        },
        {
          name : __this.languagePack['data']['userAccount'] ,
          reflect : "userAccount" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['userName'] ,
          reflect : "username" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['orderNo'] ,
          reflect : "orderNo" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['whetherSolve'] ,
          reflect : "status" ,
          type : "text",
          filter: (item)=>{
            let solve=this.languagePack['data']['solve'];
            let name=solve.filter(v=>{
              return v['value']===item['status'];
            });
            return (name && name[0] && name[0]['desc']) ? name[0]['desc'] : "";
          }
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['clickShow'],
            bindFn : (item) => {
              this.getInfo(item['id']);
            }
          }
        ]
      }
    };
    this.getList();
  }
  totalSize : number = 0 ;
  getList(){
    this.tableData.loading = true ;
    let data=this.searchModel;
    let etime = unixTime(<Date>data.endDate,"y-m-d");
    data.startDate = unixTime( (<Date>data.startDate),"y-m-d");
    data.endDate = etime && etime.indexOf(':') == -1 ? etime  + " 23:59:59" : etime;
    data.startDate = data.startDate ? unixTime((<Date>data.startDate),"y-m-d")+" 00:00:00" : null;
    let start=(new Date(data.startDate)).getTime();
    let end=(new Date(etime)).getTime();
    if( start - end >0 ){
      data.startDate=null;
      data.endDate=null;
    }
    this.service.getRepayment(data)
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
  hideMask() {
    this.isShowCall = false;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  add(){
    this.title=this.languagePack['data']['add'];
    this.validForm.reset();
    this.isVisible=true;
  }
  getInfo(data){
    let obj={
      id:data
    };
    this.service.getRepaymentInfo(obj)
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
          this.repaymentInfo = (< Array<Object> >res.data);
          setTimeout(() => {
            $("[data-magnify=gallery]").magnify();
          }, 20);
          this.isVisible=true;
        }
      );
  }
  handleCancel(){
    this.isVisible=false;
  }
  dateToString(data){
    if(data){
      return unixTime(data);
    }
  }
  userInfo(){
    let paramData={
      from : "repayment" ,
      usrId : this.repaymentInfo['id']
    };
    let para = ObjToQueryString(paramData);
    window.open(`${window.location.origin+window.location.pathname}#/usr/detail?${para}`,"_blank");

    // this.router.navigate(['/usr/detail'] , {
    //   queryParams : {
    //     from : "repayment" ,
    //     usrId : this.repaymentInfo['id']
    //   }
    // });
  }
}
