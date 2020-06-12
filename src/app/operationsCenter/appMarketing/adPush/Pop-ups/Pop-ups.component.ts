import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {TableData} from '../../../../share/table/table.model';
import {dataFormat, DateObjToString, unixTime} from '../../../../format';
import {CommonMsgService, MsgService} from '../../../../service/msg';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../../service/storage';
import {ObjToArray} from '../../../../share/tool';
import {filter} from 'rxjs/operators';
import {Response} from '../../../../share/model';
import {PopUPService} from '../../../../service/operationsCenter/popUP.service';
import {NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd';
import {injectTemplateRef} from '@angular/core/src/render3';
import {group} from '@angular/animations';

let __this;

@Component({
  selector: '',
  templateUrl: './Pop-ups.component.html',
  styleUrls: ['./Pop-ups.component.less']
})
export class PopUpsComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg: CommonMsgService,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: PopUPService,
  ) {
  } ;
  languagePack: Object;
  popUpsjump : Array<Object>;
  popUpsState : Array<Object>;
  tableData: TableData;
  validForm : FormGroup;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  fileList;
  avatarUrl;
  hidden : Boolean =true;
  pushWay : string=null;
  pushWayTitle : any="";
  isPushWay : boolean=false;
  pushWayForm : FormGroup;
  popUpsPushWay : Array<Object>;
  isPushWayLoading : boolean=false;
  title:String="";
  disabled : boolean = false;
  ngOnInit() {
    __this = this;
    this.validForm = this.fb.group({
      "id":[null],
      "name" : [null , [Validators.required] ] ,
      "jump" : [ null , [Validators.required] ] ,
      "putawayBeginTime" : [null , [Validators.required] ],
      "putawayEndTime" : [null , [Validators.required] ],
      "jumpLink" : [null],
      "file": [null],
      "url": [null]
    });
    this.pushWayForm = this.fb.group({
      "pushWay" : [null , [Validators.required] ] ,
    });
    this.getPushWay();
    this.getLanguage();
  };

  getLanguage() {
    this.translateSer.stream(['appMarketing.popUps', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['appMarketing.popUps'],
          };
          this.popUpsjump=this.languagePack["data"]["jump"];
          this.popUpsState=this.languagePack["data"]["state"];
          this.popUpsPushWay=this.languagePack["data"]["pushWay"];
        }
      );
    this.initialTable();
  };
  initialTable(){
    this.tableData = {
      loading:false,
      showIndex : true ,
      tableTitle : [
        {
          name : __this.languagePack['data']['table']['serialNumber'] ,
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['name'] ,
          reflect : "name" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['createTime'] ,
          reflect : "createTime" ,
          type : "text",
          filter:(item)=>{
            let createTime=item['createTime'];
            return createTime ? unixTime(createTime) : "";
          }
        },
        {
          name : __this.languagePack['data']['table']['link'] ,
          reflect : "jumpLink" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['shelfPeriod'] ,
          reflect : "putawayBeginTime" ,
          type : "text",
          filter:(item)=>{
            let putawayBeginTime=item['putawayBeginTime'];
            let putawayEndTime=item['putawayEndTime'];
            return (putawayBeginTime && putawayEndTime) ? unixTime(putawayBeginTime) +"－" +unixTime(putawayEndTime) : "";
          }
        },
        {
          name : __this.languagePack['data']['table']['status'] ,
          reflect : "state" ,
          type: "mark",
          markColor : {
            "END" : "#cccccc",
            "NO_BEGIN" : "#d9534f"  ,
            "EFFECT" : "#1890ff" ,
          },
          filter:(item)=> {
            let name=this.popUpsState.filter(v=>{
              return v['value']===item['state']
            });
            if(name){
              return name && name[0]['desc'] ? name[0]['desc'] : "";
            }
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
              this.title=this.languagePack["data"]["edit"];
              let putawayBeginTime;
              let putawayEndTime;
              if(item.putawayBeginTime && item.putawayEndTime){
                putawayBeginTime = new Date(item.putawayBeginTime);
                putawayEndTime = new Date(item.putawayEndTime);
              }
              this.validForm.patchValue({
                id:item.id,
                name :item.name  ,
                jump : item.jump ,
                putawayBeginTime : putawayBeginTime,
                putawayEndTime : putawayEndTime,
                jumpLink : item.jumpLink,
                file: null,
                url: item.url
              });
              this.avatarUrl=item.url;
              this.isVisible=true;
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['moveUp'],
            bindFn : (item) => {
              let num=this.tableData.data.findIndex(v=>{
                return v==item;
              });
              if(num===0){
                return ;
              }
              let data={
                id:item.id
              };
              this.service.moveUp(data)
                .pipe(
                  filter((res: Response) => {
                    if(res.success === false){
                      this.Cmsg.fetchFail(res.message) ;
                    }
                    return res.success === true;
                  })
                )
                .subscribe(
                  (res: Response) => {
                    this.Cmsg.operateSuccess();
                    this.isDelete=false;
                    this.getList();
                  }
                )
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['moveDown'],
            bindFn : (item) => {
              let num=this.tableData.data.findIndex(v=>{
                return v==item;
              });
              if(num===this.tableData.data.length-1){
                return ;
              }
              let data={
                id:item.id
              };
              this.service.moveDown(data)
                .pipe(
                  filter((res: Response) => {
                    if(res.success === false){
                      this.Cmsg.fetchFail(res.message) ;
                    }
                    return res.success === true;
                  })
                )
                .subscribe(
                  (res: Response) => {
                    this.Cmsg.operateSuccess();
                    this.isDelete=false;
                    this.getList();
                  }
                )
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['delete'],
            bindFn : (item) => {
              this.isDelete=true;
              this.sgo.set('popUpsId', {
                id: item.id,
              });
            }
          }
        ]
      }
    };
    this.getList();
  }
  getList(){
    this.tableData.loading = true ;
    this.service.getPopUP()
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          }
          this.tableData.loading = false;
          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {
          let data_arr = res.data;
          if (res.data && res.data['length'] > 0) {
            this.hidden=false;
          }else{
            this.hidden=true;
          }
          if (res.data && res.data['length'] ===5){
            this.disabled=true;
          }else{
            this.disabled=false;
          }
          this.tableData.data = (<Array<Object>>data_arr);
        }
      )
  }
  add(){
    this.title=this.languagePack["data"]["add"];
    this.avatarUrl="";
    this.validForm.reset();
    this.isVisible=true;
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk() {
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("popUpsId").id
    };
    this.service.deletePopUP(data)
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
  handleCancel(){
    this.validForm.reset();
    this.isVisible=false;
  }
  handleOk(){
    this.isOkLoading=true;
    let mode=this.validForm.value;
    if(!mode['name']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['name']);
      return ;
    }
    if(!mode['putawayBeginTime'] ||　!mode['putawayEndTime']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['shelfPeriod']);
      return ;
    }
    if(mode['jump']==null){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['jump']);
      return ;
    }
    if(mode['jump']===true){
      if(!mode['jumpLink']){
        this.isOkLoading = false;
        this.msg.error(this.languagePack['data']['prompt']['jumpLink']);
        return ;
      }else{
        if(!this.IsURL(mode['jumpLink'])){
          this.isOkLoading = false;
          this.msg.error(this.languagePack['data']['prompt']['true']);
          return ;
        }
      }
    }
    if(!this.validForm.get('url').value){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['img']);
      return ;
    }
    if(mode['id']){
      let data =new FormData();

      data.append("id",mode.id);
      data.append("name",mode.name);
      data.append("jump",mode.jump);
      data.append("putawayBeginTime",DateObjToString(mode.putawayBeginTime));
      data.append("putawayEndTime",DateObjToString(mode.putawayEndTime)+ " 23:59:59");
      if(mode['jump']===true){
        data.append("jumpLink",mode.jumpLink);
      }
      else{
        data.append("jumpLink","");
      }
      if(this.fileList &&　this.validForm.get('url').value){
        data.append("file",this.fileList[0]);
      }
      this.updatePopUps(data);
    }else{
      let data =new FormData();
      data.append("name",mode.name);
      data.append("jump",mode.jump);
      data.append("putawayBeginTime",DateObjToString(mode.putawayBeginTime));
      data.append("putawayEndTime",DateObjToString(mode.putawayEndTime) + " 23:59:59");
      data.append("file",this.fileList[0]);
      if(mode['jump']===true){
        data.append("jumpLink",mode.jumpLink);
      }
      else{
        data.append("jumpLink","");
      }
      this.addPopUps(data);
    }
  }
  updatePopUps(data){
    this.service.updatePopUP(data)
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
          this.isVisible = false;
          this.Cmsg.operateSuccess();
          this.getList();
        }
      );
  }
  addPopUps(data){
    this.service.addPopUP(data)
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
          this.isVisible = false;
          this.Cmsg.operateSuccess();
          this.getList();
        }
      );
  }
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !__this.validForm.value["putawayBeginTime"]) {
      return endValue.getTime() <=  new Date().getTime()-60*60*24*1000;
    }
    return endValue.getTime() <= new Date(__this.validForm.value["putawayBeginTime"]).getTime();
  };
  disabledStartDate= (startValue: Date): boolean => {
    if (!startValue || !__this.validForm.value["putawayEndTime"]) {
      return startValue.getTime() <= new Date().getTime()-60*60*24*1000;
    }
    return startValue.getTime() >= new Date(__this.validForm.value["putawayEndTime"]).getTime() || startValue.getTime() <= new Date().getTime()-60*60*24*1000;
  };
  beforeUpload=(file=>{
    this.fileList =[];
    this.fileList = this.fileList.concat(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      //获取图片尺寸
      __this.avatarUrl = this.result;
      __this.validForm.patchValue({
        url : this.result
      })
    };
    return false;
  });
  IsURL(strUrl){
    let strRegex = "^((https|http|ftp|rtsp|mms)?://)"
      + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
      + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
      + "|" // 允许IP和DOMAIN（域名）
      + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
      + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
      + "[a-z]{2,6})" // first level domain- .com or .museum
      + "(:[0-9]{1,4})?" // 端口- :80
      + "((/?)|" // a slash isn't required if there is no file name
      + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    let re=new RegExp(strRegex);
    //re.test()
    if (re.test(strUrl)){
      return (true);
    }else{
      return (false);
    }
  }
  getPushWay(){
    this.service.getPushWay()
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
          let data_arr = res.data;
          console.log(this.popUpsPushWay);
          this.pushWay = data_arr ? data_arr+"" : null;
          if(! data_arr){
            this.pushWayTitle=this.languagePack["data"]["prompt"]["pushMethod"];
            return;
          }
          let $pushWay = this.popUpsPushWay.filter(item=>{
            return item['value']===data_arr;
          });
          this.pushWayTitle=($pushWay && $pushWay[0]['desc']) ? $pushWay[0]['desc'] : this.languagePack["data"]["prompt"]["pushMethod"];
          console.log(data_arr);
        }
      );
  }
  setPushWay(){
    this.pushWayForm.patchValue({
      pushWay : this.pushWay ,
    });
    this.isPushWay=true;
  }
  pushWayCancel(){
    this.isPushWay=false;
  }
  pushWayOk(){
    this.isPushWayLoading=true;
    let valid=this.pushWayForm.valid;
    if(!valid){
      this.isPushWayLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['pushMethod']);
      return ;
    }
    let data={
      pushWayEnum: this.pushWayForm.get('pushWay').value
    };
    this.service.setPushWay(data)
      .pipe(
        filter( (res : Response) => {
          this.isPushWayLoading=false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isPushWay=false;
          this.Cmsg.operateSuccess();
          this.getPushWay();
        }
      );
  }
}
