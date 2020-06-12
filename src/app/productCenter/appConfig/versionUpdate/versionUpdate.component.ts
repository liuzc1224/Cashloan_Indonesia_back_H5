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
import {DateObjToString} from '../../../format';
import { HttpClient } from '@angular/common/http';
let __this ;
@Component({
  selector : "" ,
  templateUrl : "./versionUpdate.component.html" ,
  styleUrls : ['./versionUpdate.component.less']
})
export class versionUpdateComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private msg : MsgService ,
    private Cmsg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : ProductService ,
    private http:HttpClient,

  ){} ;
  validForm : FormGroup;
  languagePack : Object ;
  tableData : TableData ;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  title:String="";
  updateChooseList:Array<Object>=[];
  searchModel : SearchModel = new SearchModel();
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "forceUpdate":[null , [Validators.required] ],
      "newVersion":[null , [Validators.required] ],
      "updateLog":[null , [Validators.required] ],
      "serverUrl":[null , [Validators.required] ],
      "googleUrl":[null , [Validators.required] ],
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
          this.updateChooseList=data['productCenter.appConfig']['versionUpdate']['updateChoose']
          // console.log(this.updateChooseList)
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
          name : __this.languagePack['data']['versionUpdate']['id'] ,
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['versionUpdate']['updatedVersion'] ,
          reflect : "newVersion" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['versionUpdate']['updatedType'] ,
          reflect : "forceUpdate" ,
          type : "text",
          filter(item){
            // console.log(item.forceUpdate)
            return item.forceUpdate==1?__this.updateChooseList[1].name:item.forceUpdate==0?__this.updateChooseList[0].name:"Others"
          }
        },
        {
          name : __this.languagePack['data']['versionUpdate']['updatedContent'] ,
          reflect : "updateLog" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['versionUpdate']['googleLink'] ,
          reflect : "googleUrl" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['versionUpdate']['serverLink'] ,
          reflect : "serverUrl" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['versionUpdate']['createTime'] ,
          reflect : "createTimeStr" ,
          type : "text"
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['data']['versionUpdate']['operate'] ,
        data : [
          {
            textColor : "#0000ff",
            name : __this.languagePack['data']['versionUpdate']['delete'],
            bindFn : (item) => {
              this.isDelete=true;
              this.sgo.set('helpOrder', {
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
    // let etime = DateObjToString( (<Date>data.endDate) );
    // data.startDate = DateObjToString( (<Date>data.startDate) ) ;
    // data.endDate = etime && etime.indexOf(':') == -1 ? etime  + " 23:59:59" : etime;
    this.service.getVersion(data)
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
          // this.service.getMaxOrderAddOne()//【当前数据库最大序号+1】，请求过来的结果已经+1！！！！！！！！
          // .subscribe(
          //   ( res : Response ) => {
          //     this.maxOrderAddOne=Number(res.data);
          //     // orderList:Array<Object>=[]//存放所有可能的order;格式[{value:1},{value:2},{value:3}...]
          //     this.orderList=[]
          //     for(var i=1;i<=this.maxOrderAddOne;i++){
          //       // console.dir({value:i});
          //       this.orderList.push({value:i})
          //     }
          //   }
          // );
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
    // console.log(this.searchModel);
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
    this.title=this.languagePack['data']['versionUpdate']['add'];
    this.isVisible=true;
  };
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("helpOrder").id
    };
    // console.log(this.sgo.get("helpOrder").id)
    this.service.deleteVersion(data)
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
      this.msg.error(this.languagePack['data']['helpCenter']['notEmptyTip']);
      return ;
    }
    let postData = this.validForm.value ;//这个能拿到弹窗的值！！！！！！！
    // console.log(postData)
      this.addVersion(postData);
  }
  addVersion(data){
    // let postData={
    //   content : data['content'],
    //   title : data['title']
    // };
    this.service.addVersion(data)
    // this.http.post( "http://192.168.1.133:8401//messageCenter/helpCenter/help",postData )
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
  versionReal(){
    let real=/^V\w{1,9}\.\w{1,2}\.\w{1,2}$/;
    if(real.test(this.validForm.value.newVersion)==false){
      this.validForm.patchValue({
        newVersion:""
      });
    }
  }
}
