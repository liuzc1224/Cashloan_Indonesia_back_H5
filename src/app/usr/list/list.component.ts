import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SearchModel } from './searchModel' ;
import { Adaptor , ObjToArray } from '../../share/tool' ;
import { TableData } from '../../share/table/table.model' ;
import { unixTime } from '../../format';

import { UserListService } from '../../service/user' ;
import { CommonMsgService } from '../../service/msg/commonMsg.service' ;
import { Response } from '../../share/model/reponse.model' ;
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router' ;
import { SessionStorageService } from '../../service/storage';
import {UserLevelService} from "../../service/productCenter";
import {ChannelH5Service} from "../../service/operationsCenter";
import {ObjToQueryString} from "../../service/ObjToQueryString";
let __this ;
@Component({
  selector : "" ,
  templateUrl : "./list.component.html" ,
  styleUrls : ['./list.component.less']
})
export class ListComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private service : UserListService ,
    private Cmsg : CommonMsgService ,
    private UserLevelService:UserLevelService,
    private ChannelH5Service:ChannelH5Service,
    private router : Router ,
    private sgo : SessionStorageService
  ){} ;

  ngOnInit(){
    __this = this ;
    this.getUserLevel();
    this.getAllPackage();
    this.getLanguage() ;
  };

  languagePack : Object ;

  getLanguage(){
    this.translateSer.stream(["usrModule.list" , 'common' , 'orderList'])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data : data['usrModule.list'] ,
            order : data['orderList']
          };
          this.initialTable() ;

          this.enumStatus = this.languagePack['order']['allList']['status'] ;
        }
      )
  };
  userLevel: Array<Object>;
  searchModel : SearchModel = new SearchModel() ;
  allPackageData:Array<object>;
  allData:Array<object>;
  tableData : TableData ;
  promotionData=[];
  private searchCondition : Object  = {} ;

  enumStatus : Array< Object > ;

  initialTable(){
    this.tableData = {
      tableTitle : [
        {
          name : __this.languagePack['data']['table']['userId'] ,
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['international'] ,
          reflect : "areaCode" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['mobile'] ,
          reflect : "phoneNumber" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['userLevel'] ,
          reflect : "userGrade" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['registeredTime'] ,
          reflect : "registerTimeStr" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['packageNames'] ,
          reflect : "packageName" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['channelSource'] ,
          reflect : "channelStr" ,
          type : "text" ,
          // filter: (item)=>{
          //     const status = item['channelStr'];
          //     const map = __this.languagePack['data']['source'];
          //     let name = map.filter(item => {
          //         return item.value == status;
          //     });
          //     if(name.length===0){
          //         name=[{"desc": "","value": 99999999999999999999}]
          //     }
          //     return (name && name[0].desc) ? name[0].desc : "";
          //     }
        },{
          name : __this.languagePack['data']['table']['promotionMethod'] ,
          reflect : "promotionTypeStr" ,
          type : "text" ,
          // filter: (item)=>{
          //     const status = item['promotionTypeStr'];
          //     const map = __this.languagePack['data']['method'];
          //     let name = map.filter(item => {
          //         return item.value == status;
          //     });
          //     if(name.length===0){
          //         name=[{"desc": "","value": 99999999999999999999}]
          //     }
          //     return (name && name[0].desc) ? name[0].desc : "";
          //     }
        },
        {
          name : __this.languagePack['data']['table']['referrer'] ,
          reflect : "referrerName" ,
          type : "text",
          // filter : (item) =>{
          //     return item.registerSource===null ? item.referrerName : item.registerSource
          // }
        },
        {
          name : __this.languagePack['data']['table']['creditStatus'] ,
          reflect : "creditStatus" ,
          type : "text" ,
          filter: (item)=>{
            const status = item['creditStatus'];
            const map = __this.languagePack['data']['credit'];
            let name = map.filter(item => {
              return item.value == status;
            });
            return (name && name[0] && name[0].desc) ? name[0].desc : "";
          }
        },
        {
          name : __this.languagePack['data']['table']['accountStatus'] ,
          reflect : "status" ,
          type : "text" ,
          filter: (item)=>{
            const status = item['status'];
            const map = __this.languagePack['data']['account'];
            let name = map.filter(item => {
              return item.value == status;
            });
            return (name && name[0]  && name[0].desc) ? name[0].desc : "";
          }
        }
      ] ,
      loading : false ,
      showIndex : true ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [{
          textColor : "#80accf",
          name : __this.languagePack['common']['btnGroup']['i'],
          bindFn : (item) => {
            let paramData={
              from : "user" ,
              usrId : item.id
            };
            let para = ObjToQueryString(paramData);
            window.open(`${window.location.origin+window.location.pathname}#/usr/detail?${para}`,"_blank");

            // let parentName = this.sgo.get("routerInfo");
            //
            // let menuName = this.languagePack['common']['btnGroup']['i'] ;
            //
            // this.sgo.set("routerInfo" , {
            //   parentName : parentName.menuName,
            //   menuName : menuName
            // });
            //
            // this.router.navigate(['/usr/detail'] , {
            //   queryParams : {
            //     from : "user" ,
            //     usrId : item.id
            //   }
            // });
          }
        }]
      }
    };
    this.getList() ;
  };

  selectItem : object ;
  totalSize : number = 0 ;
  makeLoanMark : boolean =false ;
  getList(){
    this.tableData.loading = true ;
    let data = this.searchModel ;
    let etime = unixTime(<Date>data.registerTimeEnd,"y-m-d");
    data.registerTimeStart =data.registerTimeStart ? unixTime(<Date>data.registerTimeStart,"y-m-d")+" 00:00:00" : null;
    data.registerTimeEnd =
      etime
        ? etime + " 23:59:59"
        : null;
    let start=(new Date(data.registerTimeStart)).getTime();
    let end=(new Date(data.registerTimeEnd)).getTime();
    if( start - end >0 ){
      data.registerTimeStart=null;
      data.registerTimeEnd=null;
    }





    let sort = ObjToArray(this.searchCondition) ;
    data.columns = sort.keys ;
    data.orderBy = sort.vals ;
    this.service.getList(data)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;

          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };

          if(  !( < Array< Object > >res.data )||( < Array< Object > >res.data ).length===0 ){
            this.tableData.data = [] ;
            this.totalSize = 0 ;
          };

          return res.success === true ;
        })
      )
      .subscribe(
        ( res : Response ) => {

          this.tableData.data = (< Array<Object> >res.data);

          this.totalSize = res.page.totalNumber ;
        }
      );
  };
  getUserLevel(){
    let data={
      isPage:false
    };
    this.UserLevelService.getUserLevel(data)
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
          //   console.log(res.data)
          this.userLevel = (< Array<Object> >res.data).filter(item=>{
            return item['status'] == 1 ;
          });
          // console.log(this.userLevel)
        }
      );
  };
  getAllPackage(){
    this.ChannelH5Service.allPackage()
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
          this.allData=< Array<Object> >res.data;
          let arr=(< Array<Object> >res.data).filter(v=>{
            return v['packageName']!=null
          });
          this.allPackageData=arr;
          console.log(this.allPackageData);
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

  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  };
  setSource(){
    let channel=this.searchModel.channel;
    if(channel==1){
      this.promotionData=this.languagePack['data']['method'];
    }
    if(channel==2){
      this.promotionData=this.languagePack['data']['method1'];
    }
    if(channel==3){
      this.promotionData=[];
      let arr=this.allData.filter(v=>{
        return v['mediaSource']!=null
      });
      arr.forEach(v=>{
        this.promotionData.push({
          "desc" : v['mediaSource'],
          "value" : v['mediaSource']
        })
      })
    }

  }
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  };
};
