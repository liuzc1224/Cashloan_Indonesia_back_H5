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
  templateUrl : "./bulletin.component.html" ,
  styleUrls : ['./bulletin.component.less']
})
export class BulletinComponent implements OnInit{

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
  title:String="";
  canRefer=true;
  fileList=null;
  fileList1=null;
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "id":[null],
      "subject" : [null , [Validators.required] ] ,
      "pushTime" : [null , [Validators.required] ] ,
      "pushTimeEnd" : [null , [Validators.required] ] ,
      "pushType" : [null , [Validators.required] ],
      "pushContent" : [null],
      "pushObj" : [null , [Validators.required] ],
      "isNotice" : [null]
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["msgCenter.bulletin","common"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['msgCenter.bulletin'],
          };
          this.postStatus=this.languagePack['data']['status'];

          this.pushObj=this.languagePack['data']['pushObjType'];
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
          reflect : "subject" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['showTime'] ,
          reflect : "pushTime" ,
          type : "text",
          filter : (item)=>{
            return item['pushTime']+" - "+item['pushTimeEnd'];
          }
        },
        {
          name : __this.languagePack['data']['createTime'] ,
          reflect : "createTime" ,
          type : "text",
          // filter : (item)=>{
          //   return item['pushTime'] ? unixTime(item['pushTime']) : "";
          // }
        },
        {
          name : __this.languagePack['data']['updater'] ,
          reflect : "" ,
          type : "text",
          filter :(item)=>{
            //发布人  或  更新人 
            return item['modifier']===null ? item['operator'] : item['modifier']
          }
        },
        {
          name : __this.languagePack['data']['updateTime'] ,
          reflect : "" ,
          type : "text",
          filter : (item)=>{
            //更新时间  或  创建时间
            return item['modifyTime']===null ? item['createTime'] : item['modifyTime']
          }
        },
        {
          name : __this.languagePack['data']['state'] ,
          reflect : "noticeStatus" ,
          type : "text",
          filter:(item)=>{
            let name=this.postStatus.filter(v=>{
              return v['value']===item['noticeStatus']
            });
            if(name.length>0){
              return (name && name[0]['desc']) ? name[0]['desc'] : "";
            }
          }
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
                pushTime:item.pushTime,
                pushTimeEnd:item.pushTimeEnd,
                // pushType:item.pushType,
                pushObj:item.pushObj,
                pushContent:item.pushContent,
                isNotice:true
              });
              this.isVisible=true;
            },
            showContion: {
              name: "noticeStatus",
              value: [1,2]
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
                pushTime:item.pushTime,
                pushTimeEnd:item.pushTimeEnd,
                pushType:1,
                pushObj:item.pushObj,
                pushContent:item.pushContent,
                isNotice:true
              });
              this.isVisible=true;
            },
            // btn.showContion && btn.showContion.value.indexOf(data[btn.showContion.name]) > -1  //btn是data下的每一个对象
            showContion: {
              name: "noticeStatus",
              value: [0]
            },
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['delete'],
            showContion: {
              name: "noticeStatus",
              value: [0]
            },
            bindFn : (item) => {
              this.isDelete=true;
              this.sgo.set('MsgPushId', {
                id: item.id,
              });
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
    if(this.searchModel.rangeDate===null||this.searchModel.rangeDate[0]==null){
      this.searchModel.pushTimeStart=null;
      this.searchModel.pushTimeEnd=null;
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
      this.searchModel.pushTimeStart=startTimeString;
      this.searchModel.pushTimeEnd=endTimeString;
    }
    let data=this.searchModel;
    // data['pushTimeStart']=unixTime(data['pushTimeStart']);
    // data['pushTimeEnd']=unixTime(data['pushTimeEnd']);
    this.service.getNotice(data)
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
            if(res.data['length']===0){
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
      isNotice:true,
      pushType:2
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
    this.service.deleteNotice(data)
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
    // console.log(this.validForm.value)
    let mode=this.validForm.value;
    console.dir(mode);
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
    if(!mode['pushTimeEnd']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['releaseDate']);
      return ;
    }
    if(!mode['pushObj']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['pushObj']);
      return ;
    }
    // console.log(typeof(this.validForm.value.pushTime))
    // console.log(typeof(this.validForm.value.pushTimeEnd))
    if(this.validForm.value.pushTime instanceof Date){
      this.validForm.value.pushTime=this.validForm.value.pushTime.getTime();
    }
    if(this.validForm.value.pushTimeEnd instanceof Date){
      this.validForm.value.pushTimeEnd=this.validForm.value.pushTimeEnd.getTime();
    }
    // console.log(this.validForm.value.pushTime instanceof Date)
    // console.log(this.validForm.value.pushTimeEnd instanceof Date)
    // console.log(this.validForm.value.pushTime)
    // console.log(this.validForm.value.pushTimeEnd)
    // console.log(this.validForm.value.pushTimeEnd<this.validForm.value.pushTime)
    if(typeof(this.validForm.value.pushTime)!==typeof(this.validForm.value.pushTimeEnd)){
      // console.log("不等")
      if(typeof(this.validForm.value.pushTime)=="string"){
        let dontNeedTimeString=this.validForm.value.pushTime;
        this.validForm.value.pushTime=new Date(dontNeedTimeString.substr(0,4),dontNeedTimeString.substr(5,2)-1,dontNeedTimeString.substr(8,2),dontNeedTimeString.substr(11,2),dontNeedTimeString.substr(14,2),dontNeedTimeString.substr(17,2)).getTime()
      }
      if(typeof(this.validForm.value.pushTimeEnd)=="string"){
        let dontNeedTimeString=this.validForm.value.pushTimeEnd;
        this.validForm.value.pushTimeEnd=new Date(dontNeedTimeString.substr(0,4),dontNeedTimeString.substr(5,2)-1,dontNeedTimeString.substr(8,2),dontNeedTimeString.substr(11,2),dontNeedTimeString.substr(14,2),dontNeedTimeString.substr(17,2)).getTime()
      }
    }
    if(this.validForm.value.pushTimeEnd<this.validForm.value.pushTime){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['releaseDate']);
      return;
    }
    if(typeof(this.validForm.value.pushTime)!=="string" && typeof(this.validForm.value.pushTimeEnd)!=="string"){
      //方式一：
      // let start=new Date(this.validForm.value.pushTime);
      // let startYear=start.getFullYear();
      // let startMonth=(start.getMonth()-1).toString().length===1?`0${start.getMonth()-1}`:start.getMonth()-1;
      // let startDate=start.getDay().toString().length===1?`0${start.getDay()}`:start.getDay();
      // let startHour=start.getHours().toString().length===1?`0${start.getHours()}`:start.getHours();
      // let startMinute=start.getMinutes().toString().length===1?`0${start.getMinutes()}`:start.getMinutes();
      // let startSecond=start.getSeconds().toString().length===1?`0${start.getSeconds()}`:start.getSeconds();
      // this.validForm.value.pushTime=`${startYear}-${startMonth}-${startDate} ${startHour}:${startMinute}:${startSecond}`;
      // let end=new Date(this.validForm.value.pushTimeEnd);
      // let endYear=end.getFullYear();
      // let endMonth=(end.getMonth()-1).toString().length===1?`0${end.getMonth()-1}`:end.getMonth()-1;
      // let endDate=end.getDay().toString().length===1?`0${end.getDay()}`:end.getDay();
      // let endHour=end.getHours().toString().length===1?`0${end.getHours()}`:end.getHours();
      // let endMinute=end.getMinutes().toString().length===1?`0${end.getMinutes()}`:end.getMinutes();
      // let endSecond=end.getSeconds().toString().length===1?`0${end.getSeconds()}`:end.getSeconds();
      // this.validForm.value.pushTimeEnd=`${endYear}-${endMonth}-${endDate} ${endHour}:${endMinute}:${endSecond}`;
      //方式二：
      this.validForm.value.pushTime=unixTime(this.validForm.value.pushTime);
      this.validForm.value.pushTimeEnd=unixTime(this.validForm.value.pushTimeEnd);
    }
    let formData=new FormData();
    for (let key in mode){
      if(mode['pushType']===null&&`${key}`==='pushType'){
        formData.append("pushType","");
        continue;
      }
      formData.append(`${key}`,mode[`${key}`]);
    }
    // let data;
    // if(mode['pushType']===1){
    //   if(!mode['id']){
    //     if(!this.fileList){
    //       this.isOkLoading = false;
    //       this.msg.error(this.languagePack['data']['prompt']['btnTip']);
    //       return ;
    //     }
    //   }
    //   let formData=new FormData();
    //   if(mode.id){
    //     formData.append("id",mode.id);
    //   }
    //   formData.append("subject",mode.subject);
    //   formData.append("pushTime",unixTime(mode.pushTime));
    //   formData.append("pushType",mode.pushType);
    //   if(mode.pushContent){
    //     formData.append("pushContent",mode.pushContent);
    //   }
    //   if(mode.pushObj){
    //     formData.append("pushObj",mode.pushObj);
    //   }
    //   formData.append("operatorId",userId);
    //   if(this.fileList){
    //     formData.append("pushExcel",this.fileList[0]);
    //   }
    //   if(mode["id"]){
    //     this.updateMsgPush(formData);
    //   }else{
    //     this.addMsgPush(formData);
    //   }
    // }else if(mode['pushType']===2){
    //   if(!mode['pushContent']){
    //     this.isOkLoading = false;
    //     this.msg.error(this.languagePack['common']['prompt']['pushContent']);
    //     return ;
    //   }
    //   if(!mode['pushObj']){
    //     this.isOkLoading = false;
    //     this.msg.error(this.languagePack['common']['prompt']['pushObj']);
    //     return ;
    //   }
    //   if(mode['pushObj']===1){
    //     if(!mode['id']) {
    //       if (!this.fileList1) {
    //         this.isOkLoading = false;
    //         this.msg.error(this.languagePack['common']['prompt']['expLableTip']);
    //         return;
    //       }
    //     }
    //   }
    //   let formData=new FormData();
    //   if(mode.id){
    //     formData.append("id",mode.id);
    //   }
    //   formData.append("subject",mode.subject);
    //   formData.append("pushTime",unixTime(mode.pushTime));
    //   formData.append("pushType",mode.pushType);
    //   if(mode.pushContent){
    //     formData.append("pushContent",mode.pushContent);
    //   }
    //   if(mode.pushObj){
    //     formData.append("pushObj",mode.pushObj);
    //   }
    //   formData.append("operatorId",userId);
    //   if(this.fileList1){
    //     formData.append("pushExcel",this.fileList1[0]);
    //   }
      if(mode["isNotice"]&&mode["pushType"]===2){
        this.addNotice(formData);
      }else{
        this.updateNotice(formData);
      }
    }
  addNotice(data){
    this.service.addNotice(data)
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
          if(res.success===true){
            this.isVisible=false;
            this.getList();
          }

        }
      );
  }
  updateNotice(data){
    this.service.updateNotice(data)
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

