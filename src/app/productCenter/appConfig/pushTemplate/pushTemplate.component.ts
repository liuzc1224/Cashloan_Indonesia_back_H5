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
import {ProductService} from '../../../service/productCenter/product.service';
import {SearchModel} from "./searchModel";
import {DateObjToString, unixTime} from '../../../format';
let __this ;
@Component({
  selector : "push-template" ,
  templateUrl : "./pushTemplate.component.html" ,
  styleUrls : ['./pushTemplate.component.less']
})
export class PushTemplateComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private msg : MsgService ,
    private Cmsg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : ProductService ,

  ){} ;
  validForm : FormGroup;
  languagePack : Object ;
  tableData : TableData ;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  title:String="";
  searchModel : SearchModel = new SearchModel() ;
  ngOnInit(){
    __this = this ;
    this.searchModel.status=""  //默认选择全部     // ""全部 true激活 false停用
    this.validForm = this.fb.group({
      "id":[null],
      "templateCode":[null , [Validators.required] ],
      "title" : [null , [Validators.required] ] ,
      "theme" : [null , [Validators.required] ] ,
      "text" : [null , [Validators.required] ] ,
      "status" : [null , [Validators.required] ] ,
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["productCenter.appConfig.push","common"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['productCenter.appConfig.push'],
          };
          // let channelStatus=data['channel']['channelStatus'];
          // this.channelStatus=Object.values(channelStatus);
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
          name : __this.languagePack['data']['id'] ,
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['theme'] ,
          reflect : "theme" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['title'] ,
          reflect : "title" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['content'] ,
          reflect : "text" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['updater'] ,
          reflect : "modifier" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['updateTime'] ,
          reflect : "modifyTimeStr" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['state'] ,
          reflect : "status" ,
          type : "text",
          filter(item){
            return item.status==true?__this.languagePack['data']['status'][1]['desc']:__this.languagePack['data']['status'][2]['desc']
          }
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['edit'],
            bindFn : (item) => {

              this.validForm.patchValue({
                id:item.id,
                templateCode:item.templateCode,
                theme: item.theme,
                title: item.title,
                text: item.text,
                status: item.status+""
              });
              this.title=this.languagePack['data']['edit'];
              this.isVisible=true;
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
    this.service.getPushTemplate(data)
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
            this.totalSize = 0;
          }
          this.tableData.loading = false ;
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
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
    this.searchModel.status=""  //默认选择全部     // ""全部 true激活 false停用
  };
  handleOk(){
    this.isOkLoading = true;
    let valid = this.validForm.valid ;
    if(!valid){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }
    let postData = this.validForm.value ;
    if(postData["id"]){
      this.updatePushTemplate(postData);
    }
  }
  updatePushTemplate(data){
    this.service.updatePushTemplate(data)
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
    this.validForm.reset();
    this.isVisible=false;
  }
}
