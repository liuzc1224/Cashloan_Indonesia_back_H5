import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../../share/table/table.model';
import { unixTime} from '../../../format';
import {CommonMsgService, MsgService} from '../../../service/msg';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage';
import {ObjToArray} from '../../../share/tool';
import {filter} from 'rxjs/operators';
import {SearchModel} from "./searchModel";
import {Response} from '../../../share/model';
import {ChannelH5Service} from '../../../service/operationsCenter';
let __this ;
@Component({
  selector : "" ,
  templateUrl : "./channelh5.component.html" ,
  styleUrls : ['./channelh5.component.less']
})
export class Channelh5Component implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router : Router ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : ChannelH5Service ,

  ){} ;
  searchModel : SearchModel = new SearchModel() ;
  languagePack : Object ;
  tableData : TableData ;
  validForm : FormGroup;
  isVisible:Boolean=false;
  isOkLoading:Boolean=false;
  channelStatus:Array< String >;
  unit:Array< Object >;
  method:Array<Object>;
  title:String="";
  curQCode:String="";
  allPackageData:Array<object>;
  template : Array<Object>=[
    {
      image:"http://image.fastloan666.com/h5share_lightblue_20191010160334.png",
      // url:"http://h5.bahagia.top/#/first-edition"
      // url:"http://47.98.62.0:9005/#/first-edition"
      url:"http://h5.mymascash.com/#/first-edition"
      // url:"https://back.supertext.top/#/first-edition"
    },{
      image:"http://image.fastloan666.com/h5share_darkblue_20191010160327.png",
      // url:"http://h5.bahagia.top/#/second-edition"
      // url:"http://47.98.62.0:9005/#/second-edition"
      url:"http://h5.mymascash.com/#/first-edition"
      // url:"https://back.supertext.top/#/second-edition"
    }
  ];
  private searchCondition: Object = {};
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "id":null,
      "name" : [null , [Validators.required] ] ,
      "link" : [null] ,
      "clearingWay" : [null , [Validators.required] ] ,
      "packageName" : [null , [Validators.required] ] ,
      "companyName" : [null , [Validators.required] ] ,
      "everyAmount" : [ null ] ,
      "everyAmountUnit" : [ null ] ,
      "state" : [ 1 , [Validators.required] ] ,
      "Url":[ null ,[Validators.required]]
    });
    this.getLanguage() ;
    this.getAllPackage();
  };

  getLanguage(){
    this.translateSer.stream(["channel","common"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            list:data['channel']['tabData'],
            data:data["channel"]
          };
          this.channelStatus=data['channel']['channelStatus'];
          this.unit=data['channel']['unit'];
          this.method=data['channel']['method'];

          this.initialTable() ;
        }
      )
  };
  getAllPackage(){
    this.service.allPackage()
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
          let arr=(< Array<Object> >res.data).filter(v=>{
            return v['packageName']!=null
          });
          this.allPackageData=arr;
          console.log(this.allPackageData);
        }
      );
  }
  initialTable(){
    this.tableData = {
      loading:false,
      showIndex : false ,
      tableTitle : [
        {
          name : __this.languagePack['list']['channelId'],
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['name'] ,
          reflect : "name" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['packageName'] ,
          reflect : "packageName" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['companyName'] ,
          reflect : "companyName" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['shareLink'] ,
          reflect : "link" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['QRCodeH5'] ,
          reflect : "link" ,
          type : "text",
          color:"#0000ff",
          filter:(item)=>{
            return __this.languagePack['list']['QRCodeDownload']
          },
          fn: (item) => {
            this.curQCode=item['link'];
            let time=setTimeout(()=>{
              this.exportCanvasAsPNG(__this.languagePack['list']['QRCodeH5'])
            },100)

          }
        },
        {
          name : __this.languagePack['list']['link'] ,
          reflect : "apkUrl" ,
          type : "text",
        },
        {
          name : __this.languagePack['list']['QRCodeApk'] ,
          reflect : "apkUrl" ,
          type : "text",
          color:"#0000ff",
          filter:(item)=>{
            return __this.languagePack['list']['QRCodeDownload']
          },
          fn: (item) => {
            this.curQCode=item['apkUrl'];
            let time=setTimeout(()=>{
              this.exportCanvasAsPNG(__this.languagePack['list']['QRCodeApk'])
            },100)

          }
        },
        {
          name : __this.languagePack['list']['method'] ,
          reflect : "clearingWay" ,
          type : "text",
        },
        {
          name : __this.languagePack['list']['everyAmount'] ,
          reflect : "everyAmount" ,
          type : "text",
          filter:(item)=>{
            let everyAmount=item['everyAmount'] ? item['everyAmount'] : "";
            let unit=this.unit.filter(v=>{
              return v['value']==item['everyAmountUnit']
            });
            let everyAmountUnit= unit && unit[0] && unit[0]['desc'] ? unit[0]['desc'] : "";
            return everyAmount + everyAmountUnit;
          }
        },
        {
          name : __this.languagePack['list']['createTime'] ,
          reflect : "createTime",
          type : "text"
        },
        {
          name : __this.languagePack['list']['channelStatus'] ,
          reflect : "state" ,
          type : "text",
          filter : ( item ) => {
            const status = item['state'] ;
            let name=this.channelStatus.filter(v=>{
              return v['value']==status;
            });
            return (name && name[0] && name[0]['desc']) ? name[0]['desc'] : "" ;
          }
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [{
          textColor : "#0000ff",
          name : __this.languagePack['common']['operate']['name'],
          bindFn : (item) => {
            this.isVisible=true;
            this.title=this.languagePack['data']['btn']['edit'];
            this.validForm.patchValue({
              "id": item.id,
              "name":item.name,
              "link":item.link,
              "state":item.state,
              "packageName" : item.packageName ,
              "companyName" : item.companyName ,
              "clearingWay" : item.clearingWay ,
              "everyAmount" : item.everyAmount ,
              "everyAmountUnit" : item.everyAmountUnit ,
              "Url" : item.templateUrl
            });
          }
        }]
      }
    };
    this.getList() ;
  }
  totalSize : number = 0 ;
  exportCanvasAsPNG(data) {

    let canvasElement = document.getElementById("qrCode").firstChild as HTMLCanvasElement;

    let MIME_TYPE = "image/png";

    let imgURL = canvasElement.toDataURL(MIME_TYPE);

    let dlLink = document.createElement('a');
    dlLink.download = data;
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
  }
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  getList(){
    this.tableData.loading = true ;
    let data=this.searchModel;
    let etime = unixTime((<Date>data.createTimeEnd),"y-m-d");
    data.createTimeStart = data.createTimeStart ?  unixTime((<Date>data.createTimeStart),"y-m-d")+ " 00:00:00" : null;
    data.createTimeEnd = data.createTimeEnd ? etime + " 23:59:59" : null;
    let start=(new Date(data.createTimeStart)).getTime();
    let end=(new Date(data.createTimeEnd)).getTime();
    if( start - end >0 ){
      data.createTimeStart=null;
      data.createTimeEnd=null;
    }
    this.searchCondition['state']=true;
    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;

    this.service.getChannelH5(data)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;

          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          this.tableData.data = (< Array<Object> >res.data);
          console.log(this.tableData.data);
          if (res.page && res.page.totalNumber)
            this.totalSize = res.page.totalNumber;
          else
            this.totalSize = 0;
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
  handleCancel(){
    this.validForm.reset();
    this.isVisible = false;
  }
  handleOk(){
    console.log(this.validForm.value);
    this.isOkLoading = true;
    let valid = this.validForm.valid ;
    if(!valid){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }
    let value=this.validForm.value;
    let postData = {
      "id": value.id,
      "name": value.name,
      "link":value.link,
      "state":value.state,
      "logo" : value.logo ,
      "clearingWay" : value.clearingWay ,
      "packageName" : value.packageName ,
      "companyName" : value.companyName ,
      "everyAmount" : value.everyAmount ,
      "everyAmountUnit" : value.everyAmountUnit ,
    };
    postData["templateUrl"]=this.validForm.value["Url"];
    if(postData["templateUrl"]){
      let template=this.template.filter(v=>{
        return v['image']==postData["templateUrl"]
      });
      postData["link"]=template && template[0]['url'] ? template[0]['url'] : "";
    }
    console.log(postData);
    if(postData["id"]){
      this.update(postData);
    }else{
      this.addChannelH5(postData);
    }
  }
  addChannelH5(data){

    this.service.addChannelH5(data)
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
          this.isOkLoading = false;
          this.isVisible = false;
          this.getList();
          console.log(res.data);
        }
      );
  }
  update(data){
    data["templateUrl"]=this.validForm.value["Url"];
    this.service.update(data)
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
          this.isOkLoading = false;
          this.isVisible = false;
          this.getList();
          console.log(res.data);
        }
      );
  }
  add(){
    this.isVisible=true;
    this.title=this.languagePack['data']['btn']['add'];
    this.validForm.reset();
    this.validForm.patchValue({
      state:1,
      everyAmountUnit:'IDR',
      clearingWay:'NONE'
    });
  }
  num(){
    let val=this.validForm.get('everyAmount').value;
    if(val){
      this.validForm.patchValue({
        "everyAmount":val.replace(/[^0-9]/g,'')
      })
    }
  }
}
