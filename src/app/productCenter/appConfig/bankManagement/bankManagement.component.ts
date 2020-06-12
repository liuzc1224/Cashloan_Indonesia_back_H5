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
declare var $: any;
@Component({
  selector : "bank-management" ,
  templateUrl : "./bankManagement.component.html" ,
  styleUrls : ['./bankManagement.component.less']
})
export class BankManagementComponent implements OnInit{

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
  avatarUrl;
  fileList=[];
  searchModel : SearchModel = new SearchModel() ;
  maxSortAddOne:Number;//【当前数据库最大序号+1】
  sortList:Array<Object>=[]//存放所有可能的order;格式[{value:1},{value:2},{value:3}...]
  isShow;
  showWitch:String="";
  ngOnInit(){
    __this = this ;
    this.searchModel.status=""  //默认选择全部     // ""全部 "1"激活 "0"停用
    this.validForm = this.fb.group({
      "id":[null],
      "sort" : [null , [Validators.required] ],
      "bankName" : [null , [Validators.required] ] ,
      "file" : [null , [Validators.required] ] ,
      "status" : [null , [Validators.required] ]
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["productCenter.appConfig","common","channel"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['productCenter.appConfig'],
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
          name : __this.languagePack['data']['bank']['id'] ,
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['bank']['name'] ,
          reflect : "bankName" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['bank']['lg'] ,
          reflect : "bankIconUrl" ,
          type : "text",
          color: "#ff0000",
          filter(item){
            return __this.languagePack['data']['bank']['showBig']
            // item['bankIconUrl']
            // C:\Users\Admin\Desktop\2019-09-27-ab0848b6-186e-48de-97dc-32dfedc0e55c.jpeg
          },
          fn:(item)=>{
            // console.log(item.bankIconUrl)
            this.showWitch=item.bankIconUrl;
            this.isShow=true;
          }
        },
        {
          name : __this.languagePack['data']['bank']['sort'] ,
          reflect : "sort" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['bank']['updater'] ,
          reflect : "modifier" ,
          type : "text",
          filter(item){
            return item.modifier===null?item.creator:item.modifier
          },
        },
        {
          name : __this.languagePack['data']['bank']['updateTime'] ,
          reflect : "modifyTimeStr" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['bank']['state'] ,
          reflect : "status" ,
          type : "text",
          filter(item){
            return item.status==1?__this.languagePack['data']['bank']['status'][1]['desc']:__this.languagePack['data']['bank']['status'][2]['desc']
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
              this.avatarUrl=item.bankIconUrl;//上线用
              // __this.avatarUrl='http://e.hiphotos.baidu.com/image/h%3D300/sign=a9e671b9a551f3dedcb2bf64a4eff0ec/4610b912c8fcc3cef70d70409845d688d53f20f7.jpg';//测试用
              this.validForm.patchValue({
                id:item.id,
                sort:item.sort,
                bankName:item.bankName,
                file:item.bankIconUrl,
                status:item.status+""
              });
              this.title=this.languagePack['data']['bank']['edit'];
              this.isVisible=true;
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['moveUp'],
            bindFn : (item) => {
              if(item['sort']==1){
                return;
              }
              let data={
                id:item.id
              };
              this.service.moveUpInBank(data)
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
                    this.getList();
                  }
                )
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['moveDown'],
            bindFn : (item) => {
              if(item['sort']==Number(this.maxSortAddOne)-1){
                return
              }
              let data={
                id:item.id
              };
              this.service.moveDownInBank(data)
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
              this.sgo.set('helpId', {
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
    this.service.getBank(data)
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
          this.service.getMaxSortAddOne()//【当前数据库最大序号+1】，请求过来的结果已经+1！！！！！！！！
          .subscribe(
            ( res : Response ) => {
              this.maxSortAddOne=Number(res.data);
              // console.log(this.maxSortAddOne)
              // sortList:Array<Object>=[]//存放所有可能的sort;格式[{value:1},{value:2},{value:3}...]
              this.sortList=[]
              for(var i=1;i<=this.maxSortAddOne;i++){
                // console.dir({value:i});
                this.sortList.push({value:i})
              }
            }
          );
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
    // console.log(this.searchModel)
    this.getList() ;
  };
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
    this.searchModel.status=""  //默认选择全部     // ""全部 "1"激活 "0"停用
  };
  add(){
    __this.avatarUrl="";
    this.validForm.reset();
    this.title=this.languagePack['data']['bank']['add'];
    this.validForm.patchValue({
      sort:this.maxSortAddOne
    });
    this.isVisible=true;
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("helpId").id
    };
    // console.log(this.sgo.get("helpOrder").id)
    this.service.deleteBank(data)
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
    this.isOkLoading = true;
    let valid = this.validForm.valid ;
    if(!valid){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }

    // console.log(this.fileList)

    let postData = this.validForm.value ;
    // console.log(postData)
    let formData =new FormData();
    // formData.append("id",postData.id)
    formData.append("sort",postData.sort);
    formData.append("bankName",postData.bankName);
    if(this.fileList.length!==0){
      formData.append("file",this.fileList[0]);
    }
    formData.append("status",postData.status);
    // console.log(formData)
    if(this.title==this.languagePack['data']['bank']['edit']){
      formData.append("id",postData.id)//编辑需要id
      // console.log(formData.get("id"))
      this.updateBank(formData);
    }else{
      this.addBank(formData);//新增不需要id
    }
  }
  addBank(data){
    this.service.addBank(data)
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
  updateBank(data){
    this.service.updateBank(data)
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
  beforeUpload=(file=>{
    this.fileList =[];
    this.fileList = this.fileList.concat(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      // console.log(this.result)
      //获取图片尺寸
      __this.avatarUrl = this.result;
      // console.log(this.result)
      __this.validForm.patchValue({
        file : this.result
      })
    };
    return false;
  });

  isShowCancel(){
    this.isShow=false;
  }
  isShowOk(){
    this.isShow=false;
  }

}
