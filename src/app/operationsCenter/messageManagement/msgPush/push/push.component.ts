import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../../../share/table/table.model';
import {CommonMsgService,MsgService} from '../../../../service/msg';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '../../../../service/storage';
import {ObjToArray} from '../../../../share/tool';
import {filter} from 'rxjs/operators';
import {Response} from '../../../../share/model';
import {MsgPushService} from '../../../../service/operationsCenter/msgPush.service';
import {SearchModel} from "./searchModel";
import { unixTime } from "../../../../format";
let __this ;
let __id;
@Component({
  selector : "" ,
  templateUrl : "./push.component.html" ,
  styleUrls : ['./push.component.less']
})
export class PushComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private msg : MsgService ,
    private Cmsg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : MsgPushService ,
  ){} ;
  validForm : FormGroup;
  languagePack : Object ;
  tableData : TableData ;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  pushType :Array<Object>;
  postStatus :Array<Object>;
  pushObj :Array<Object>;
  searchModel : SearchModel = new SearchModel() ;
  title="";
  canRefer=true;
  fileList=null;
  fileList1=null;
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "id":[null],
      "subject" : [null , [Validators.required] ] ,
      "pushTime" : [null , [Validators.required] ] ,
      "pushType" : [null , [Validators.required] ],
      "pushContent" : [null],
      "pushObj" : [null],
      "operatorId" : [null , [Validators.required] ],
      "pushExcel" :[null],
      "isNotice" :[null , [Validators.required] ]
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["msgCenter.msgPush","common"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['msgCenter.msgPush'],
          };
          this.pushType=this.languagePack['data']['pushType'];
          this.postStatus=this.languagePack['data']['postStatus'];
          this.pushObj=this.languagePack['data']['pushObj'];
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
          name : __this.languagePack['data']['table']['id'] ,
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['createTime'] ,
          reflect : "createTime" ,
          type : "text",
          filter : (item)=>{
            return item['createTime'] ? unixTime(item['createTime']) : "";
          }
        },
        {
          name : __this.languagePack['data']['table']['theme'] ,
          reflect : "subject" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['releaseDate'] ,
          reflect : "pushTime" ,
          type : "text",
          filter : (item)=>{
            return item['pushTime'] ? unixTime(item['pushTime']) : "";
          }
        },
        {
          name : __this.languagePack['data']['table']['postStatus'] ,
          reflect : "pushStatus" ,
          type : "text",
          filter:(item)=>{
            let name=this.postStatus.filter(v=>{
              return v['value']==item['pushStatus']
            });
            if(name.length>0){
              return (name && name[0]['desc']) ? name[0]['desc'] : "";
            }
          }
        },
        {
          name : __this.languagePack['data']['table']['pushType'] ,
          reflect : "pushType" ,
          type : "text",
          filter:(item)=>{
            let name=this.pushType.filter(v=>{
              return v['value']==item['pushType']
            });
            return name && name[0]['desc'] ? name[0]['desc'] : "";
          }
        },
        {
          name : __this.languagePack['data']['table']['publisher'] ,
          reflect : "operator" ,
          type : "text"
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['show'],
            bindFn : (item) => {
              this.canRefer=false;
              this.title=__this.languagePack['data']['show'];
              this.validForm.patchValue({
                id:item.id,
                subject:item.subject,
                pushTime:new Date(item.pushTime),
                pushType:item.pushType,
                pushContent:item.pushContent,
                pushObj:item.pushObj,
                operatorId:null,
                pushExcel:null,
                isNotice:false
              });
              this.isVisible=true;
            },
            showContion: {
              name: "pushStatus",
              value: [1]
            },
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['edit'],
            bindFn : (item) => {
              this.canRefer=true;
              this.title=__this.languagePack['data']['edit'];
              this.validForm.patchValue({
                id:item.id,
                subject:item.subject,
                pushTime:new Date(item.pushTime),
                pushType:item.pushType,
                pushContent:item.pushContent,
                pushObj:item.pushObj,
                operatorId:null,
                pushExcel:null,
                isNotice:false
              });
              this.isVisible=true;
            },
            showContion: {
              name: "pushStatus",
              value: [0]
            },
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['delete'],
            bindFn : (item) => {
              this.isDelete=true;
              this.sgo.set('MsgPushId', {
                id: item.id,
              });
            },
            showContion: {
              name: "pushStatus",
              value: [0]
            },
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
    data['pushTimeStart']=unixTime(data['pushTimeStart']);
    data['pushTimeEnd']=unixTime(data['pushTimeEnd']);
    this.service.getMsgPush(data)
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
          // console.log(res.data);
          this.tableData.data = (< Array<Object> >res.data);
          // console.log(res.data);
          if(res.data){
            if(res.data['length']==0){
            }
          }
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize =0;
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
  };
  add(){
    this.canRefer=true;
    this.title=this.languagePack['data']['add'];
    this.validForm.reset();
    this.validForm.patchValue({
      isNotice:false
    });
    this.isVisible=true;
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("MsgPushId").id
    };
    this.service.deleteMsgPush(data)
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
  handleOk(){
    this.isOkLoading=true;
    const userId = this.sgo.get("loginInfo")['id'] ;
    this.validForm.patchValue({
      isNotice:false
    });
    if(this.validForm.value.pushType==1){
      this.validForm.patchValue({
        pushObj:1
      });
    }
    let mode=this.validForm.value;
    if(!mode['subject']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['theme']);
      return ;
    }
    if(!mode['pushTime']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['releaseDate']);
      return ;
    }
    if(!mode['pushType']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['pushType']);
      return ;
    }
    let data;
    if(mode['pushType']==1){
      if(!mode['id']){
        if(!this.fileList){
          this.isOkLoading = false;
          this.msg.error(this.languagePack['data']['prompt']['btnTip']);
          return ;
        }
      }
      let formData=new FormData();
      if(mode.id){
        formData.append("id",mode.id);
      }
      formData.append("isNotice",mode.isNotice);
      formData.append("subject",mode.subject);
      formData.append("pushTime",unixTime(mode.pushTime));
      formData.append("pushType",mode.pushType);
      if(mode.pushContent){
        formData.append("pushContent",mode.pushContent);
      }
      if(mode.pushObj){
        formData.append("pushObj",mode.pushObj);
      }
      formData.append("operatorId",userId);
      if(this.fileList){
        formData.append("pushExcel",this.fileList[0]);
      }
      if(mode["id"]){
        this.updateMsgPush(formData);
      }else{
        this.addMsgPush(formData);
      }
    }else if(mode['pushType']==2){
      if(!mode['pushContent']){
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['prompt']['pushContent']);
        return ;
      }
      if(!mode['pushObj']){
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['prompt']['pushObj']);
        return ;
      }
      if(mode['pushObj']==1){
        if(!mode['id']) {
          if (!this.fileList1) {
            this.isOkLoading = false;
            this.msg.error(this.languagePack['common']['prompt']['expLableTip']);
            return;
          }
        }
      }
      let formData=new FormData();
      if(mode.id){
        formData.append("id",mode.id);
      }
      formData.append("isNotice",mode.isNotice);
      formData.append("subject",mode.subject);
      formData.append("pushTime",unixTime(mode.pushTime));
      formData.append("pushType",mode.pushType);
      if(mode.pushContent){
        formData.append("pushContent",mode.pushContent);
      }
      if(mode.pushObj){
        formData.append("pushObj",mode.pushObj);
      }
      formData.append("operatorId",userId);
      if(this.fileList1){
        formData.append("pushExcel",this.fileList1[0]);
      }
      if(mode["id"]){
        this.updateMsgPush(formData);
      }else{
        this.addMsgPush(formData);
      }
    }
  }
  addMsgPush(data){
    this.service.addMsgPush(data)
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
          this.isVisible=false;
          this.getList();
        }
      );
  }
  updateMsgPush(data){
    this.service.updateMsgPush(data)
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
          this.isVisible=false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.validForm.reset();
    this.isVisible=false;
  }
  beforeUpload=(file=>{
    this.fileList =[];
    this.fileList = this.fileList.concat(file);
    return false;
  });
  beforeUpload1=(file=>{
    this.fileList1 =[];
    this.fileList1 = this.fileList1.concat(file);
    return false;
  })
}

