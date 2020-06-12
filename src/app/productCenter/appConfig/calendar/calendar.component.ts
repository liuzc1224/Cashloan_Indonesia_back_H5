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
import { HttpClient } from '@angular/common/http';
import {SearchModel} from "./searchModel";
import {DateObjToString} from '../../../format';
let __this ;
@Component({
  selector : "calendar" ,
  templateUrl : "./calendar.component.html" ,
  styleUrls : ['./calendar.component.less']
})
export class CalendarComponent implements OnInit{

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
  yyRange=["2019","2020","2021","2022","2023","2024","2025","2026","2027","2028","2029"];
  mmRange=["01","02","03","04","05","06","07","08","09","10","11","12"];
  yy:string;
  mm:string;
  title:string="";
  nowDay:string="";//当前日期 格式2019-09-17
  witchMonth:string="";//选中月份 格式2019-09
  witchMonthFirstDay:number;//选中月份第一天是星期几  格式0-6
  selectedValue:string;//工作日历有效状态【以此为准】
  maybeSelectedValue:string;//工作日历有效状态【暂存变量】
  readyCalendar:Array<Object>;//工作日历每一天状态合集的数组【以此为准】
  maybeCalendar:Array<Object>;//工作日历每一天状态合集的数组【暂存变量】
  visitedCalendars:Object={};//保存“访问过的日历对象”  格式{"2025-10":[{"id": 24375,"createTime": 1568791555000,"modifyTime": 1568802550000,"time": "2025-10-01","state": 0,"status": 0},...]}
  uploadChanges:Object={"restDays":[],"workDays":[],"status":""};//保存用于上传的日历状态修改，没有更改的部分可不存    完整格式{"restDays":["2019-09-25","2019-09-26"],"workDays":["2019-09-19","2019-09-21"],"status":"0"}
  ngOnInit(){
    __this = this ;
    //以下拿到当前时间并拼接成需要的格式
    this.nowDay=new Date().toLocaleDateString().split("/").join("-");
    if(this.nowDay.split("-")[1].length===1){
      this.nowDay=this.nowDay.replace("-","-0")
    }
    this.witchMonth=this.nowDay.slice(0,this.nowDay.lastIndexOf("-"));
    // console.log(this.witchMonth);

    this.requestData();//初始化时，请求当前月的日历
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
        }
      )
  };
  requestData(){//请求某一个月数据
    this.yy=this.witchMonth.split("-")[0];
    this.mm=this.witchMonth.split("-")[1];
    // let url=`http://192.168.1.133:8401//work/calendar/get?yearMonth=${this.witchMonth}`
    // this.http.get( url ).subscribe( (res :any)=>{
    this.service.getCalendar( this.witchMonth )
    .subscribe(( res :any ) =>{ 
      this.selectedValue=res.data[0].status.toString();//日历有效状态【以此为准】
      this.readyCalendar=res.data;//工作日历每一天状态合集的数组【以此为准】
      this.witchMonthFirstDay=new Date(Number(this.witchMonth.split("-")[0]),Number(this.witchMonth.split("-")[1])-1).getDay();
      // console.log(res)
    })
  }
  outChange(){
    this.witchMonth=this.yy+"-"+this.mm;
    this.requestData();
  };
//外层日历逻辑
  outPrev(){//外部日历点击“《上一月”
    if(Number(this.witchMonth.split("-")[0])>=2019&&this.witchMonth!="2019-01"){//判断日历范围在2019-01及以后
      if(this.witchMonth.split("-")[1]=="01"){
        this.witchMonth=`${Number(this.witchMonth.split("-")[0])-1}-12`
      }else{
        this.witchMonth=`${this.witchMonth.split("-")[0]}-${((Number(this.witchMonth.split("-")[1])-1).toString()).length==1 ? '0'+(Number(this.witchMonth.split("-")[1])-1) : Number(this.witchMonth.split("-")[1])-1}`
      }
      // console.log(this.witchMonth)
      this.requestData();
    }
  }
  outNext(){//外部日历点击“下一月》”
    if(Number(this.witchMonth.split("-")[0])<2030&&this.witchMonth!="2029-12"){//判断日历范围在2029-12及以前
      if(this.witchMonth.split("-")[1]=="12"){
        this.witchMonth=`${Number(this.witchMonth.split("-")[0])+1}-01`
      }else{
        this.witchMonth=`${this.witchMonth.split("-")[0]}-${((Number(this.witchMonth.split("-")[1])+1).toString()).length==1 ? '0'+(Number(this.witchMonth.split("-")[1])+1) : Number(this.witchMonth.split("-")[1])+1}`
      }
      // console.log(this.witchMonth)
      this.requestData();
    }
  }
//详解：内部日历逻辑
// 1：每次点击某一日保留变更的状态uploadChanges（用于发送），同时修改maybeCalendar日历状态
// 2：切换月份   首先匹配是否访问过    未访问过：保留当前maybeCalendar日历状态到“访问过对象visitedCalendars”，并调用requestData()方法请求新月份数据，之后调用this.maybeCalendar=this.readyCalendar同步最新日历
//                                  已访问过：保留当前maybeCalendar日历状态到“访问过对象visitedCalendars”，计算出新的witchMonth和witchMonthFirstDay，并从“访问过对象visitedCalendars”内取出访问记录覆盖进入maybeCalendar，
// 3：点击设置   将日历状态maybeSelectedValue保存至“访问过对象visitedCalendars”   put上传步骤1所保存的变更状态，    【注意按值传递！！！】同步外层日历显示①①①this.maybeCalendar=JSON.parse(JSON.stringify({"shen":this.readyCalendar}))["shen"];②②②this.readyCalendar=JSON.parse(JSON.stringify({"shen":this.maybeCalendar}))["shen"];     重置（不能清空）上传的对象（“访问过对象visitedCalendars永远不用清空！”）
// 设置接口：已测试（无需的参数可不传）
  // this.http.put( "http://192.168.1.133:8401//work/calendar/state" ,{"restDays":["2019-09-25","2019-09-26"],"workDays":["2019-09-19","2019-09-21"],"status":"0"}).subscribe( (res :any)=>{
  //   console.log(res)
  // })
  
  changeWorkingCondition(i,witchMonth,witchTime,maybeWork){//点击内部日历的“具体日期”更改变更是否为工作日状态（参数详解：点击日期在当前月的下标,当前选择的年月,点击的年月日,点击当前日修改前是否为工作日【0工作日，1非工作日】）
    // console.log(i);
    // console.log(witchMonth)
    // console.log(witchTime)
    // console.log(maybeWork)
    if(maybeWork==0){
      let a=this.uploadChanges["workDays"].indexOf(witchTime);
      if(a!="-1"){
        this.uploadChanges["workDays"].splice(a,1)
      }
      this.uploadChanges["restDays"].push(witchTime);
      this.maybeCalendar[i]["state"]=1;
    }else{
      let a=this.uploadChanges["restDays"].indexOf(witchTime);
      if(a!="-1"){
        this.uploadChanges["restDays"].splice(a,1)
      }
      this.uploadChanges["workDays"].push(witchTime);
      this.maybeCalendar[i]["state"]=0;
    }
  }
  intoPrev(){//内部日历点击“《上一月”
    this.visitedCalendars[this.witchMonth.toString()]=JSON.parse(JSON.stringify({"shen":this.maybeCalendar}))["shen"]
    if(Number(this.witchMonth.split("-")[0])>=2019&&this.witchMonth!="2019-01"){//判断日历范围在2019-01及以后
      if(this.witchMonth.split("-")[1]=="01"){
        this.witchMonth=`${Number(this.witchMonth.split("-")[0])-1}-12`
      }else{
        this.witchMonth=`${this.witchMonth.split("-")[0]}-${((Number(this.witchMonth.split("-")[1])-1).toString()).length==1 ? '0'+(Number(this.witchMonth.split("-")[1])-1) : Number(this.witchMonth.split("-")[1])-1}`
      }
    }
    this.yy=this.witchMonth.split("-")[0];
    this.mm=this.witchMonth.split("-")[1];
    if(this.visitedCalendars[this.witchMonth.toString()]==undefined){
      // let url=`http://192.168.1.133:8401//work/calendar/get?yearMonth=${this.witchMonth}`
      // this.http.get( url ).subscribe( (res :any)=>{
      this.service.getCalendar( this.witchMonth )
      .subscribe(( res :any ) =>{
        this.selectedValue=res.data[0].status.toString();//日历有效状态【以此为准】
        this.readyCalendar=res.data;//工作日历每一天状态合集的数组【以此为准】
        this.witchMonthFirstDay=new Date(Number(this.witchMonth.split("-")[0]),Number(this.witchMonth.split("-")[1])-1).getDay();
        // console.log(res)
        this.maybeCalendar=JSON.parse(JSON.stringify({"shen":this.readyCalendar}))["shen"]
      })
    }else{
      this.witchMonthFirstDay=new Date(Number(this.witchMonth.split("-")[0]),Number(this.witchMonth.split("-")[1])-1).getDay();
      this.maybeCalendar=JSON.parse(JSON.stringify({"shen":this.visitedCalendars[this.witchMonth.toString()]}))["shen"]
    }
  }
  intoChange(){
    this.visitedCalendars[this.witchMonth.toString()]=JSON.parse(JSON.stringify({"shen":this.maybeCalendar}))["shen"];
    this.witchMonth=this.yy+"-"+this.mm;
    if(this.visitedCalendars[this.witchMonth.toString()]==undefined){
      // let url=`http://192.168.1.133:8401//work/calendar/get?yearMonth=${this.witchMonth}`
      // this.http.get( url ).subscribe( (res :any)=>{
      this.service.getCalendar( this.witchMonth )
      .subscribe(( res :any ) =>{ 
        this.selectedValue=res.data[0].status.toString();//日历有效状态【以此为准】
        this.readyCalendar=res.data;//工作日历每一天状态合集的数组【以此为准】
        this.witchMonthFirstDay=new Date(Number(this.witchMonth.split("-")[0]),Number(this.witchMonth.split("-")[1])-1).getDay();
        // console.log(res)
        this.maybeCalendar=JSON.parse(JSON.stringify({"shen":this.readyCalendar}))["shen"]
      })
    }else{
      this.witchMonthFirstDay=new Date(Number(this.witchMonth.split("-")[0]),Number(this.witchMonth.split("-")[1])-1).getDay();
      this.maybeCalendar=JSON.parse(JSON.stringify({"shen":this.visitedCalendars[this.witchMonth.toString()]}))["shen"]
    }
  }
  intoNext(){//内部日历点击“下一月》”
    this.visitedCalendars[this.witchMonth.toString()]=JSON.parse(JSON.stringify({"shen":this.maybeCalendar}))["shen"]
    if(Number(this.witchMonth.split("-")[0])<2030&&this.witchMonth!="2029-12"){//判断日历范围在2029-12及以前
      if(this.witchMonth.split("-")[1]=="12"){
        this.witchMonth=`${Number(this.witchMonth.split("-")[0])+1}-01`
      }else{
        this.witchMonth=`${this.witchMonth.split("-")[0]}-${((Number(this.witchMonth.split("-")[1])+1).toString()).length==1 ? '0'+(Number(this.witchMonth.split("-")[1])+1) : Number(this.witchMonth.split("-")[1])+1}`
      }
    }
    this.yy=this.witchMonth.split("-")[0];
    this.mm=this.witchMonth.split("-")[1];
    if(this.visitedCalendars[this.witchMonth.toString()]==undefined){
      // let url=`http://192.168.1.133:8401//work/calendar/get?yearMonth=${this.witchMonth}`
      // this.http.get( url ).subscribe( (res :any)=>{
      this.service.getCalendar( this.witchMonth )
      .subscribe(( res :any ) =>{ 
        this.selectedValue=res.data[0].status.toString();//日历有效状态【以此为准】
        this.readyCalendar=res.data;//工作日历每一天状态合集的数组【以此为准】
        this.witchMonthFirstDay=new Date(Number(this.witchMonth.split("-")[0]),Number(this.witchMonth.split("-")[1])-1).getDay();
        // console.log(res)
        this.maybeCalendar=JSON.parse(JSON.stringify({"shen":this.readyCalendar}))["shen"]
      })
    }else{
      this.witchMonthFirstDay=new Date(Number(this.witchMonth.split("-")[0]),Number(this.witchMonth.split("-")[1])-1).getDay();
      this.maybeCalendar=JSON.parse(JSON.stringify({"shen":this.visitedCalendars[this.witchMonth.toString()]}))["shen"]
    }
  }
  calendarSettings(){// 单击“编辑日历”
    this.maybeSelectedValue=this.selectedValue;//日历有效状态【暂存变量】
    this.maybeCalendar=JSON.parse(JSON.stringify({"shen":this.readyCalendar}))["shen"];//工作日历每一天状态合集的数组【暂存变量】    注意深拷贝！！！！！！
    this.isVisible=true;
  }
  handleCancel(){//“编辑工作日历”内点击取消
    this.isVisible=false;
  }
  handleOk(){//“编辑工作日历”内点击设置
    // console.log(this.maybeSelectedValue)
    this.uploadChanges["status"]=this.maybeSelectedValue;
    // this.http.put( "http://192.168.1.133:8401//work/calendar/state" ,this.uploadChanges).subscribe( (res :any)=>{
    this.service.changeWorkDay( this.uploadChanges )
    .subscribe(( res :any ) =>{ 
      // console.log(res)
      this.uploadChanges={"restDays":[],"workDays":[],"status":""};
    })
    this.selectedValue=this.maybeSelectedValue;
    this.readyCalendar=JSON.parse(JSON.stringify({"shen":this.maybeCalendar}))["shen"];//注意深拷贝！！！！！！
    this.isVisible=false;
  }

}
