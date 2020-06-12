import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../../share/table/table.model';
import {CommonMsgService,MsgService} from '../../../service/msg';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage';
import {ObjToArray} from '../../../share/tool';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model';
import {SearchModel} from "./searchModel";
import {FeedBackService} from '../../../service/operationsCenter';
import {DateObjToString, unixTime} from '../../../format';
let __this ;
let __id;
declare var $: any;
@Component({
  selector : "" ,
  templateUrl : "./feedBack.component.html" ,
  styleUrls : ['./feedBack.component.less']
})
export class FeedBackComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private msg : MsgService ,
    private Cmsg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : FeedBackService ,

  ){} ;
  validForm : FormGroup;
  languagePack : Object ;
  tableData : TableData ;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  title:String="";
  feedBackInfo : Array<any>=[];
  searchModel : SearchModel = new SearchModel() ;
  isShowCall: boolean = false;
  isBigImg: boolean = false;
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "id":[null , [Validators.required] ],
      "createTime":[null],
      "appVersion": [null , [Validators.required] ] ,
      "title": [null] ,
      "content": [null] ,
      "images": [null],
      "solve": [null , [Validators.required] ] ,
      "remarks": [null]
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["msgCenter.feedBack","common",])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['msgCenter.feedBack'],
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
          name : __this.languagePack['data']['feedbackDate'] ,
          reflect : "createTime" ,
          type : "text",
          filter: (item)=>{
            return item['createTime'] ? unixTime(item['createTime']) : "";
          }
        },
        {
          name : __this.languagePack['data']['userAccount'] ,
          reflect : "phoneNumber" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['feedbackTopic'] ,
          reflect : "title" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['feedbackContent'] ,
          reflect : "content" ,
          type : "text",
          filter: (item)=>{
            const content = item['content'];
            if(content){
              return (content && content.length>10) ? content.substring(0,10)+"..." : content;
            }
          }
        },
        {
          name : __this.languagePack['data']['versionNumber'] ,
          reflect : "appVersion" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['whetherSolve'] ,
          reflect : "solve" ,
          type : "mark",
          markColor: { 'true': "#1890FF", 'false': "#FF4D4F"},
          filter: (item)=>{
            const status = item['solve'];
            const map = __this.languagePack['data']['solve'];
            let name = map.filter(item => {
                return item.value == status;
            });
            return (name && name[0].desc) ? name[0].desc : "";
          },
        },
        {
          name : __this.languagePack['data']['remarks'] ,
          reflect : "remarks" ,
          type : "text",
          filter: (item)=>{
            const remarks = item['remarks'];
            if(remarks){
              return (remarks && remarks.length>10) ? remarks.substring(0,10)+"..." : remarks;
            }
          },
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
    if(this.searchModel.rangeDate==null||this.searchModel.rangeDate[0]==null){
      this.searchModel.startDate=null;
      this.searchModel.endDate=null;
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
      this.searchModel.startDate=startTimeString;
      this.searchModel.endDate=endTimeString;
    }
    let data=this.searchModel;
    let endDate = unixTime(<Date>data.endDate,"y-m-d");
    data.startDate =data.startDate ? unixTime(<Date>data.startDate,"y-m-d")+" 00:00:00" : null;
    data.endDate =
      endDate
        ? endDate + " 23:59:59"
        : null;
    let start=(new Date(data.startDate)).getTime();
    let end=(new Date(data.endDate)).getTime();
    if( start - end >0 ){
      data.startDate=null;
      data.endDate=null;
    }
    this.service.getFeedBack(data)
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
  // hideMask() {
  //   this.isShowCall = false;
  // }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  // add(){
  //   this.title=this.languagePack['data']['add'];
  //   this.validForm.reset();
  //   this.isVisible=true;
  // }
  getInfo(data){
    let obj={
      id:data
    };
    this.service.getFeedBackInfo(obj)
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
          // this.feedBackInfo = (< Array<Object> >res.data);
          let thisIDDetails=res.data;
          this.validForm.patchValue({
            "id":thisIDDetails["id"],
            "createTime":thisIDDetails["createTime"],
            "appVersion":thisIDDetails["appVersion"],
            "title":thisIDDetails["title"],
            "content":thisIDDetails["content"],
            "images": thisIDDetails["images"],
            "solve": thisIDDetails["solve"],
            "remarks": thisIDDetails["remarks"]
          });
          setTimeout(() => {
            $("[data-magnify=gallery]").magnify();
          }, 20);
          this.isVisible=true;
        }
      );
  }
  // deleteCancel(){
  //   this.isDelete=false;
  // }
  // deleteOk(){
  //   this.isDeleteLoading=true;
  //   let data = {
  //     id:this.sgo.get("helpId").id
  //   };
  //   this.service.getFeedBack(data)
  //     .pipe(
  //       filter( (res : Response) => {
  //         this.isDeleteLoading = false;
  //         if(res.success === false){
  //           this.Cmsg.fetchFail(res.message) ;
  //         }
  //         return res.success === true;
  //       })
  //     )
  //     .subscribe(
  //       ( res : Response ) => {
  //         this.Cmsg.operateSuccess();
  //         this.isDelete=false;
  //         this.getList();
  //       }
  //     );
  // }
  handleOk(){
    this.isOkLoading = true;
    let valid = this.validForm.valid ;
    if(!valid){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }
    // let postData = this.validForm.value ;
    // console.dir(this.validForm.value)
    //仅仅提交可修改的参数
    let data={"id":this.validForm.value.id,"solve":this.validForm.value.solve,"remarks":this.validForm.value.remarks}
    this.service.updateFeedBackInfo(data)
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

    // if(postData["id"]){
    //   this.updateHelp(postData);
    // }else{
    //   this.addHelp(postData);
    // }
  }
  handleCancel(){
    this.isVisible=false;
  }
  // dateToString(data){
  //   if(data){
  //     return unixTime(data);
  //   }
  // }
  // userInfo(){
  //   this.router.navigate(['/usr/detail'] , {
  //     queryParams : {
  //       from : "feedBack" ,
  //       usrId : this.feedBackInfo['id']
  //     }
  //   });
  // }
}
