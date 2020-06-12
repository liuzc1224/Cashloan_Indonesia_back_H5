import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../../share/table/table.model';
import {CommonMsgService,MsgService} from '../../../service/msg';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model';
import {ProductService} from '../../../service/productCenter/product.service';
import {SearchModel} from "./searchModel";
import { HttpClient } from '@angular/common/http';
let __this ;
@Component({
  selector : "" ,
  templateUrl : "./helpCenter.component.html" ,
  styleUrls : ['./helpCenter.component.less']
})
export class HelpCenterComponent implements OnInit{

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
  searchModel : SearchModel = new SearchModel();
  selectState:string="";//用户可选用于搜索的状态  默认“全部''”  显示1   隐藏0
  maxOrderAddOne:Number;//【当前数据库最大序号+1】
  orderList:Array<Object>=[]//存放所有可能的order;格式[{value:1},{value:2},{value:3}...]
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "id":[null],
      "order":[null],
      "status":[null],
      "title" : [null , [Validators.required] ] ,
      "content" : [null , [Validators.required] ] ,
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
          name : __this.languagePack['data']['helpCenter']['id'] ,
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['helpCenter']['order'] ,
          reflect : "order" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['helpCenter']['problem'] ,
          reflect : "title" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['helpCenter']['content'] ,
          reflect : "content" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['helpCenter']['itWorks'] ,
          reflect : "usefulCount" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['helpCenter']['useless'] ,
          reflect : "uselessCount" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['helpCenter']['updateMan'] ,
          reflect : "modifier" ,
          type : "text",
          filter(item){
            return item.modifier===null?item.createPerson:item.modifier;//没有更新人就是创建人
          }
        },
        {
          name : __this.languagePack['data']['helpCenter']['updateTime'] ,
          reflect : "modifyTimeStr" ,
          type : "text",
          filter(item){
            return item.modifyTimeStr===null?item.createTimeStr:item.modifyTimeStr;//没有更新时间就是创建时间
          }
        },
        {
          name : __this.languagePack['data']['helpCenter']['status'] ,
          reflect : "status" ,
          type : "text",
          filter(item){
            return item.status==1?__this.languagePack['data']['helpCenter']['display']:__this.languagePack['data']['helpCenter']['hiding']
          }
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['data']['helpCenter']['operate'] ,
        data : [
          {
            textColor : "#0000ff",
            name : __this.languagePack['data']['helpCenter']['edit'],
            bindFn : (item) => {
              // console.dir(this.orderList)
              this.validForm.patchValue({
                id:item.id,
                order:item.order,
                status:item.status+"",
                title:item.title,
                content : item.content
              });
              // console.log(this.validForm.value)
              this.title=this.languagePack['data']['helpCenter']['edit'];
              this.isVisible=true;
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['data']['helpCenter']['moveUp'],
            bindFn : (item) => {
              if(item['order']==1){
                return;
              }
              let data={
                "id":item.id
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
                    this.getList();
                  }
                )
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['data']['helpCenter']['moveDown'],
            bindFn : (item) => {
              if(item['order']==Number(this.maxOrderAddOne)-1){
                return
              }
              let data={
                "id":item.id
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
                    this.getList();
                  }
                )
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['data']['helpCenter']['delete'],
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
    this.service.getHelpCenter(data)
    // this.http.get( `http://192.168.1.133:8401//messageCenter/helpCenter/helps`,{params:data} )
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
          this.service.getMaxOrderAddOne()//【当前数据库最大序号+1】，请求过来的结果已经+1！！！！！！！！
          .subscribe(
            ( res : Response ) => {
              this.maxOrderAddOne=Number(res.data);
              // orderList:Array<Object>=[]//存放所有可能的order;格式[{value:1},{value:2},{value:3}...]
              this.orderList=[]
              for(var i=1;i<=this.maxOrderAddOne;i++){
                // console.dir({value:i});
                this.orderList.push({value:i})
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
    // console.log(this.searchModel);
    this.getList() ;
  };
  search(){
    this.searchModel.status=this.selectState;
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.selectState="";
    this.getList();
  };
  add(){
    this.validForm.reset();
    this.validForm.patchValue({
      order:this.maxOrderAddOne
    });
    // console.dir(this.maxOrderAddOne)
    // this.validForm.value["order"]=666;
    this.title=this.languagePack['data']['helpCenter']['add'];
    
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
    this.service.deleteHelp(data)
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
    if(postData["id"]){
      // console.log("update")
      this.updateHelp(postData);
    }else{
      // console.log("add")
      this.addHelp(postData);
    }
  }
  addHelp(data){
    // let postData={
    //   content : data['content'],
    //   title : data['title']
    // };
    this.service.addHelp(data)
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
  updateHelp(data){
    this.service.updateHelp(data)
    // this.http.post( "http://192.168.1.133:8401//messageCenter/helpCenter/help",data )
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
