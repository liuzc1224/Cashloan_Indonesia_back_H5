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
import {ChannelBranchService} from '../../../service/operationsCenter';
import {SearchModel} from "./searchModel";
let __this ;
let __id;
@Component({
  selector : "" ,
  templateUrl : "./channelBranch.component.html" ,
  styleUrls : ['./channelBranch.component.less']
})
export class ChannelBranchComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private msg : MsgService ,
    private Cmsg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : ChannelBranchService ,

  ){} ;
  validForm : FormGroup;
  languagePack : Object ;
  tableData : TableData ;
  generateNumber:String=null;
  isGenerate:Boolean=false;
  isOkLoading:Boolean = false;
  isAdd:Boolean=false;
  title:String="";
  channelStatus:Array< String >;
  searchModel : SearchModel = new SearchModel() ;
  nameLength:Number=0;
  streetLength:Number=0;
  contactUserLength:Number=0;
  contactPhoneLength:Number=0;
  private searchCondition: Object = {};
  maxLength:Object={
    "invitationCode":6,
    "name":30,
    "street":100,
    "contactUser":100,
    "contactPhone":20,
  };
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "channelId":[null],
      "id":[null],
      "invitationCode" : [null , [Validators.required] ] ,
      "name" : [null , [Validators.required] ] ,
      "street" : [ null , [Validators.required] ] ,
      "contactUser" : [ null , [Validators.required] ] ,
      "contactPhone" : [ null , [Validators.required] ] ,
      "state" : [ 1 , [Validators.required] ] ,
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["channel.channelBranch","common","channel"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            channel:data['channel'],
            channelBranch:data['channel.channelBranch'],
          };
          this.channelStatus=data['channel']['channelStatus'];
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
          name : __this.languagePack['channelBranch']['tabData']['invitationCode'] ,
          reflect : "invitationCode" ,
          type : "text"
        },
        {
          name : __this.languagePack['channelBranch']['tabData']['name'] ,
          reflect : "name" ,
          type : "text"
        },
        {
          name : __this.languagePack['channelBranch']['streetAddress'] ,
          reflect : "street" ,
          type : "text"
        },
        {
          name : __this.languagePack['channelBranch']['tabData']['contact'] ,
          reflect : "contactUser" ,
          type : "text"
        },
        {
          name : __this.languagePack['channelBranch']['tabData']['contactNumber'] ,
          reflect : "contactPhone" ,
          type : "text"
        },
        {
          name : __this.languagePack['channelBranch']['tabData']['status'] ,
          reflect : "state" ,
          type : "text",
          filter : ( item ) => {
            let name=this.channelStatus.filter(v=>{
              return v['value']==item['state']
            });

            return (name && name[0] && name[0]['desc'] ) ? name[0]['desc'] : "" ;
          }
        },
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [{
          textColor : "#0000ff",
          name : __this.languagePack['common']['operate']['name'],
          bindFn : (item) => {
            this.validForm.patchValue({
              channelId:item.channelId,
              id:item.id,
              invitationCode:item.invitationCode ,
              name:item.name ,
              street:item.street ,
              contactUser:item.contactUser ,
              contactPhone:item.contactPhone ,
              state:item.state
            });
            this.nameLength=item.name.length;
            this.streetLength=item.street.length;
            this.contactUserLength=item.contactUser.length;
            this.contactPhoneLength=item.contactPhone.length;
            __this.isAdd=true;
          }
        }]
      }
    };
    this.routerInfo.queryParams
      .subscribe(
        (para) => {
          console.log(para);
          if(para["name"]){
            this.title=para["name"];
          }
          if(para["id"]){
            __id=para["id"];
            this.getList();
          }
        }
      );

  }
  exHidden:Boolean=false;
  totalSize : number = 0 ;
  Quantity:Number=null;
  getList(){
    this.tableData.loading = true ;
    this.searchModel["channelId"]=__id;
    let data=this.searchModel;
    this.searchCondition['state']=true;
    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;
    console.log(data);
    this.service.getChannelBranch(data)
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
          console.log(res.data)
          if(res.data){
            if(res.data['length']==0){
              this.exHidden=true;
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
    };

    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    };
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
    this.validForm.reset();
    this.validForm.patchValue({
      channelId:__id,
      state:1
    });
    this.nameLength=0;
    this.streetLength=0;
    this.contactUserLength=0;
    this.contactPhoneLength=0;
    this.isAdd=true;
    this.service.invitationCode(__id)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          this.isAdd=true;
          this.validForm.patchValue({
            channelId:__id,
            invitationCode:res.data
          });
        }
      );
  }
  generate(){
    this.service.unUsedQuantity(__id)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          __this.Quantity=res.data;
        }
      );
    this.isGenerate=true;
  }
  generateOk(){
    let num=Number(this.generateNumber);
    if(!num || num==0){
      this.msg.error(this.languagePack['channel']['prompt']['generate']);
      return;
    }
    let data= {
      channelId: __id,
      count: num
    };
    this.service.generate(data);
    // .pipe(
    //   filter( (res : Response) => {
    //     this.isOkLoading = false;
    //     if(res.success === false){
    //       this.Cmsg.fetchFail(res.message) ;
    //     };
    //     return res.success === true;
    //   })
    // )
    // .subscribe(
    //   ( res : Response ) => {
    //     console.log(res.data);
    //   }
    // );

    this.isGenerate=false;
  }
  num(){
    let value=this.generateNumber;
    if(value){
      value=value.replace(/[^0-9]/g,'');
      this.generateNumber=value;
    }
  }
  generateCancel(){
    this.isGenerate=false;
  }
  addOk(){
    let valid = this.validForm.valid ;
    if(!valid){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }
    let postData = this.validForm.value ;
    if(postData["id"]){
      this.update(postData);
    }else{
      this.addCancelBranch(postData);
    }
  }
  addCancel(){
    this.validForm.reset();
    this.isAdd=false;
  }
  addCancelBranch(data){
    console.log(data);
    this.service.addChannelBranch(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          __this.isAdd=false;
          this.getList();
        }
      );
  }
  update(data){
    this.service.update(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          __this.isAdd=false;
          this.getList();
        }
      );
  }
  // test(data){
  //   let value=this.validForm.get(data)["value"];
  //   if(value){
  //     value=value.replace(/[^A-Z0-9]/g,'');
  //     this.invitationCodeLength=value["length"];
  //     let re={
  //       [data]:value
  //     };
  //     console.log(this.validForm);
  //     this.validForm.patchValue(re);
  //   }
  // }
  testOther(data){
    let value=this.validForm.get(data)["value"];
    console.log(value);
    if(value){
      this[data+'Length']=value["length"];
    }
  }
  phone(data){
    let value=this.validForm.get(data)["value"];
    if(value){
      value=value.replace(/[^0-9]/g,'');
      let re={
        [data]:value
      };
      this.validForm.patchValue(re);
      this[data+'Length']=value["length"];
    }
  }
  exChannelBranch(){
    let data={
      channelId:__id
    };
    this.service.exChannelBranch(data);
    // .pipe(
    //   filter( (res : Response) => {
    //     this.isOkLoading = false;
    //     if(res.success === false){
    //       this.Cmsg.fetchFail(res.message) ;
    //     };
    //     return res.success === true;
    //   })
    // )
    // .subscribe(
    //   ( res : Response ) => {
    //     console.log(res.data);
    //     __this.isAdd=false;
    //     this.getList();
    //   }
    // );
  }
  imChannelBranch(){
    document.getElementById("file").click();
  }
  upLoad(){
    this.tableData.loading = true ;
    let file=document.querySelector("#file")['files'][0];
    console.log(file);
    let formData=new FormData();
    formData.append("channelId",__id);
    formData.append("file",file);
    this.service.imChannelBranch(formData)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.getList();
        }
      );
  }
  setInput(data){
    if(data){
      let str=data.replace(/[^\d]/g,'');
      this.generateNumber=str;
    }
  }
}
// resetForm()：重置表单；
