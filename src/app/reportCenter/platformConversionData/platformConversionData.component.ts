import {Component, OnInit} from '@angular/core';
import {dataFormat, DateObjToString, unixTime} from '../../format';
import {SearchModel} from './searchModel';
import {TableData} from '../../share/table/table.model';
import {CommonMsgService} from '../../service/msg/commonMsg.service';
import {Response} from '../../share/model/reponse.model';
import {filter} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {channelDataService} from '../../service/report';


let __this;

@Component({
  selector: 'platform-conversion-data',
  templateUrl: './platformConversionData.component.html',
  styleUrls: ['./platformConversionData.component.less']
})
export class platformConversionDataComponent implements OnInit {

  constructor(
    private msg: CommonMsgService,
    private translateSer: TranslateService,
    private service : channelDataService ,
  ) {
  };

  searchModel: SearchModel = new SearchModel();
  tableData : TableData ;
  languagePack: Object;
  TopList: Object={};
  dayType : number=null;
  whitchClick:"";
  obj =  {}; //折线图
  ngOnInit() {
    // this.searchModel.endTime=unixTime(new Date(),"y-M-d");

    // this.searchModel.startTime=unixTime(new Date(),"y-M-d");
    this.setDay();
    __this = this;
    this.getLanguage();
  };
  getLanguage() {
    this.translateSer.stream(['reportModule.conversionData', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['reportModule.conversionData']['table'],
          };
          this.initialTable();
        }
      );
  }

  reset() {
    this.dayType=null;
    this.searchModel = new SearchModel;
    this.setDay();
    this.getList();
  };
  search() {
    this.getList();
  };
  
  getList() {
    
    this.searchModel.startTime= this.searchModel.startTime ? unixTime(this.searchModel.startTime, 'y-m-d')+" 00:00:00":null,
    this.searchModel.endTime= this.searchModel.endTime ? unixTime(this.searchModel.endTime, 'y-m-d')+" 23:59:59":null
    this.service.platformConversionDataTopList(this.searchModel)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          // console.log(res.data)
          this.TopList=res.data;
        }
      );
    this.service.platformConversionDataBottomList(this.searchModel)
      .pipe(
        filter( (res : Response) => {
          if(res.success !== true){
            this.msg.fetchFail(res.message) ;
        }
        this.tableData.loading = false ;

        if(res.data && res.data['length'] == 0){
            this.tableData.data = [] ;
        }
        return res.success === true  && res.data && (< Array<Object>>res.data).length > 0 ;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          this.tableData.data=(< Array<Object> >res.data);
          this.obj={
            title: {
              text: ''
            },
            xAxis: {
              type: 'category',
              data: [],//x轴下的值
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: [],//x轴上折线每个点对应的值
              type: 'line'
            }],
            dataZoom:{
              realtime:true, //拖动滚动条时是否动态的更新图表数据
              height:25,//滚动条高度
              start:0,//滚动条开始位置（共100等份）
              end:100//结束位置（共100等份）
            } ,
            tooltip:{
              data:[]//鼠标悬停显示值
            }
          }
        }
      );
  }
  changeShow(name,valueVV){
    this.whitchClick=name;
    this.obj={
      title: {
        text: name
      },
      xAxis: {
        type: 'category',
        data: [],//x轴下的值
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [],//x轴上折线每个点对应的值
        type: 'line'
      }],
      dataZoom:{
        realtime:true, //拖动滚动条时是否动态的更新图表数据
        height:25,//滚动条高度
        start:0,//滚动条开始位置（共100等份）
        end:100//结束位置（共100等份）
      } ,
      tooltip:{
        data:[]//鼠标悬停显示值
      }
    }
    this.tableData.data.forEach((value,index)=>{
      // console.log(value['repaymentAmount'])
      this.obj['xAxis'].data.push(value['dateStr'])
      this.obj['series'][0].data.push(value[valueVV]==null ? 0 : value[valueVV])
      this.obj['tooltip'].data.push(value[valueVV]==null ? 0 : value[valueVV])
    })
  }

  sevenDays(){
    let date1 = new Date();
    date1.setDate(date1.getDate()-7);
    let time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    return unixTime(new Date(time1),"y-M-d");
  }
  months(){
    let date1 = new Date();
    date1.setMonth(date1.getMonth()-1);
    let time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    return unixTime(new Date(time1),"y-M-d");
  }
  setDay(){
    this.dayType=1;
    this.searchModel.endTime=unixTime(new Date(),"y-M-d");
    this.searchModel.startTime=this.sevenDays();
    this.getList();
  }
  setMonth(){
    this.dayType=2;
    this.searchModel.endTime=unixTime(new Date(),"y-M-d");
    this.searchModel.startTime=this.months();
    this.getList();
  }
  initialTable(){
    this.tableData = {
      loading:false,
      showIndex : true ,
      tableTitle : [
        {
          name : __this.languagePack['data']['date'] ,
          reflect : "dateStr" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['downloads'] ,
          reflect : "downloadUser" ,
          type : "text",
          filter : (item) => {
            return item.downloadUser==null ? 0 : item.downloadUser;
          }
        },
        {
          name : __this.languagePack['data']['softwareStartup'] ,
          reflect : "appStart" ,
          type : "text",
          filter : (item) => {
            return item.appStart==null ? 0 : item.appStart;
          }
        },
        {
          name : __this.languagePack['data']['registeredUser'] ,
          reflect : "register" ,
          type : "text",
          filter : (item) => {
            return item.register==null ? 0 : item.register;
          }
        },
        {
          name : __this.languagePack['data']['loanApplicationOrders'] ,
          reflect : "applyLoan" ,
          type : "text",
          filter : (item) => {
            return item.applyLoan==null ? 0 : item.applyLoan;
          }
        },
        {
          name : __this.languagePack['data']['machineReviewPass'] ,
          reflect : "machinePass" ,
          type : "text",
          filter : (item) => {
            return item.machinePass==null ? 0 : item.machinePass;
          }
        },
        {
          name : __this.languagePack['data']['machineReviewFor'] ,
          reflect : "machineStraight" ,
          type : "text",
          filter : (item) => {
            return item.machineStraight==null ? 0 : item.machineStraight;
          }
        },
        {
          name : __this.languagePack['data']['machineReviewRejected'] ,
          reflect : "machineReject" ,
          type : "text",
          filter : (item) => {
            return item.machineReject==null ? 0 : item.machineReject;
          }
        },
        {
          name : __this.languagePack['data']['ordersPassed'] ,
          reflect : "personCheckPass" ,
          type : "text",
          filter : (item) => {
            return item.personCheckPass==null ? 0 : item.personCheckPass;
          }
        },
        {
          name : __this.languagePack['data']['rejectsOrders'] ,
          reflect : "personCheckReject" ,
          type : "text",
          filter : (item) => {
            return item.personCheckReject==null ? 0 : item.personCheckReject;
          }
        },
        {
          name : __this.languagePack['data']['canceledOrders'] ,
          reflect : "cancelInchecking" ,
          type : "text",
          filter : (item) => {
            return item.cancelInchecking==null ? 0 : item.cancelInchecking;
          }
        },
        {
          name : __this.languagePack['data']['failedPurchase'] ,
          reflect : "paymentFailed" ,
          type : "text",
          filter : (item) => {
            return item.paymentFailed==null ? 0 : item.paymentFailed;
          }
        },
        {
          name : __this.languagePack['data']['cancelsOrder'] ,
          reflect : "cancelInPaymentFailed" ,
          type : "text",
          filter : (item) => {
            return item.cancelInPaymentFailed==null ? 0 : item.cancelInPaymentFailed;
          }
        },
        {
          name : __this.languagePack['data']['redrawOrder'] ,
          reflect : "againAfterPaymentFailed" ,
          type : "text",
          filter : (item) => {
            return item.againAfterPaymentFailed==null ? 0 : item.againAfterPaymentFailed;
          }
        },
        {
          name : __this.languagePack['data']['successfulLoanOrders'] ,
          reflect : "paymentSuccess" ,
          type : "text",
          filter : (item) => {
            return item.paymentSuccess==null ? 0 : item.paymentSuccess;
          }
        },
        {
          name : __this.languagePack['data']['totalAmount'] ,
          reflect : "paymentAmount" ,
          type : "text",
          filter : (item) => {
            return item.paymentAmount==null ? 0 : item.paymentAmount;
          }
        },
        {
          name : __this.languagePack['data']['newShould'] ,
          reflect : "oughtToRepayAmount" ,
          type : "text",
          filter : (item) => {
            return item.oughtToRepayAmount==null ? 0 : item.oughtToRepayAmount;
          }
        },
        {
          name : __this.languagePack['data']['repaymentTotal'] ,
          reflect : "repaymentAmount" ,
          type : "text",
          filter : (item) => {
            return item.repaymentAmount==null ? 0 : item.repaymentAmount;
          }
        },
        {
          name : __this.languagePack['data']['repaymentTotal'] ,
          reflect : "advanceRepayAmount" ,
          type : "text",
          filter : (item) => {
            return item.advanceRepayAmount==null ? 0 : item.advanceRepayAmount;
          }
        },
        {
          name : __this.languagePack['data']['currentDayRepayAmount'] ,
          reflect : "currentDayRepayAmount" ,
          type : "text",
          filter : (item) => {
            return item.currentDayRepayAmount==null ? 0 : item.currentDayRepayAmount;
          }
        },
        {
          name : __this.languagePack['data']['dueRepayAmount'] ,
          reflect : "dueRepayAmount" ,
          type : "text",
          filter : (item) => {
            return item.dueRepayAmount==null ? 0 : item.dueRepayAmount;
          }
        },
        {
          name : __this.languagePack['data']['doneOrderCount'] ,
          reflect : "doneOrderCount" ,
          type : "text",
          filter : (item) => {
            return item.doneOrderCount==null ? 0 : item.doneOrderCount;
          }
        },
        {
          name : __this.languagePack['data']['beforeDoneOrderCount'] ,
          reflect : "beforeDoneOrderCount" ,
          type : "text",
          filter : (item) => {
            return item.beforeDoneOrderCount==null ? 0 : item.beforeDoneOrderCount;
          }
        },
        {
          name : __this.languagePack['data']['currentDayDoneOrderCount'] ,
          reflect : "currentDayDoneOrderCount" ,
          type : "text",
          filter : (item) => {
            return item.currentDayDoneOrderCount==null ? 0 : item.currentDayDoneOrderCount;
          }
        },
        {
          name : __this.languagePack['data']['dueDoneOrderCount'] ,
          reflect : "dueDoneOrderCount" ,
          type : "text",
          filter : (item) => {
            return item.dueDoneOrderCount==null ? 0 : item.dueDoneOrderCount;
          }
        },
        {
          name : __this.languagePack['data']['currentDayOutghtRepayAmount'] ,
          reflect : "currentDayOutghtRepayAmount" ,
          type : "text",
          filter : (item) => {
            return item.currentDayOutghtRepayAmount==null ? 0 : item.currentDayOutghtRepayAmount;
          }
        },
        {
          name : __this.languagePack['data']['currentDayRepayOrderCount'] ,
          reflect : "currentDayRepayOrderCount" ,
          type : "text",
          filter : (item) => {
            return item.currentDayRepayOrderCount==null ? 0 : item.currentDayRepayOrderCount;
          }
        },
        {
          name : __this.languagePack['data']['dueUndoneOrderAmount'] ,
          reflect : "dueUndoneOrderAmount" ,
          type : "text",
          filter : (item) => {
            return item.dueUndoneOrderAmount==null ? 0 : item.dueUndoneOrderAmount;
          }
        },
        {
          name : __this.languagePack['data']['dueUndoneOrderCount'] ,
          reflect : "dueUndoneOrderCount" ,
          type : "text",
          filter : (item) => {
            return item.dueUndoneOrderCount==null ? 0 : item.dueUndoneOrderCount;
          }
        },
        {
          name : __this.languagePack['data']['firstDueRate'] ,
          reflect : "firstDueRate" ,
          type : "text",
          filter : (item) => {
            let firstDueRate=item.firstDueRate;
            if(firstDueRate!=null){
              return (firstDueRate*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        },
        {
          name : __this.languagePack['data']['amountFirstDueRate'] ,
          reflect : "amountFirstDueRate" ,
          type : "text",
          filter : (item) => {
            let amountFirstDueRate=item.amountFirstDueRate;
            if(amountFirstDueRate!=null){
              return (amountFirstDueRate*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        }
      ]
    };
    this.getList();
  }
  downloandBottomList(){
    this.searchModel.startTime= this.searchModel.startTime ? unixTime(this.searchModel.startTime, 'y-m-d')+" 00:00:00":null,
    this.searchModel.endTime= this.searchModel.endTime ? unixTime(this.searchModel.endTime, 'y-m-d')+" 23:59:59":null
    this.service.downloandBottomList(this.searchModel);
  }
}
