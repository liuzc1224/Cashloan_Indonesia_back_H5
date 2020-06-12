import {Component, OnInit} from '@angular/core';
import {unixTime} from '../../format';
import {SearchModel} from './searchModel';
import {TableData} from '../../share/table/table.model';
import {CommonMsgService} from '../../service/msg/commonMsg.service';
import {Response} from '../../share/model/reponse.model';
import {filter} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {channelDataService} from '../../service/report';

let __this;

@Component({
  selector: 'platform-users-buried',
  templateUrl: './platformUsersBuried.component.html',
  styleUrls: ['./platformUsersBuried.component.less']
})
export class PlatformUsersBuriedComponent implements OnInit {

  constructor(
    private msg: CommonMsgService,
    private translateSer: TranslateService,
    private service : channelDataService ,
  ) {
  };

  searchModel: SearchModel = new SearchModel();
  tableData : TableData ;
  languagePack: Object;
  platformHistory: Object;
  platformCurrent: Object;
  dayType : number=null;
  TopList: Object={};
  chooseOneList:Array<Object>=[];
  clickNN:string="";
  userNN:string="";
  obj1 =  {}; //折线图1
  obj2 =  {}; //折线图2
  whitchClick:"";
  ngOnInit() {
    // this.searchModel.endTime=unixTime(new Date(),"y-M-d");

    // this.searchModel.startTime=unixTime(new Date(),"y-M-d");
    this.setDay();
    __this = this;
    this.getLanguage();
  };
  getLanguage() {
    this.translateSer.stream(['reportModule.platformUsersBuried', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['reportModule.platformUsersBuried']['table'],
          };
          this.clickNN=data['reportModule.platformUsersBuried']['clickCount']
          this.userNN=data['reportModule.platformUsersBuried']['userNumber']
          this.getList();
        }
      );
  }

  reset() {
    this.dayType=null;
    this.searchModel = new SearchModel;
    // this.searchModel.endTime=unixTime(new Date(),"y-M-d");
    // this.searchModel.startTime=unixTime(new Date(),"y-M-d");
    this.setDay();
    this.getList();
  };
  search() {
    this.getList();
  };
  getList() {
    this.searchModel.startTime= this.searchModel.startTime ? unixTime(this.searchModel.startTime, 'y-m-d')+" 00:00:00":null,
    this.searchModel.endTime= this.searchModel.endTime ? unixTime(this.searchModel.endTime, 'y-m-d')+" 23:59:59":null
    this.service.platformUsersBuriedTopList(this.searchModel)
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
        this.TopList=res.data;
      }
    );
    this.obj1={
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
    };
    this.obj2={
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
  changeShow(name,clickNN,userNN,keyNN){
    this.whitchClick=name;
    this.searchModel.eventName=keyNN;
    this.service.platformUsersBuriedBottomList(this.searchModel)
      .pipe(
        filter( (res : Response) => {
          if(res.success !== true){
            this.msg.fetchFail(res.message) ;
        }
        return res.success === true  && res.data && (< Array<Object>>res.data).length >= 0 ;
        })
      )
      .subscribe(
        ( res : Response ) => {
          // this.platformCurrent = (< Array<Object> >res.data);
          this.chooseOneList=(< Array<Object> >res.data);
          this.obj1={
            title: {
              text: clickNN+"： "+name
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
          };
          this.obj2={
            title: {
              text:userNN+"： "+name
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
          this.chooseOneList.forEach((value,index)=>{
            // console.log(value['repaymentAmount'])
            this.obj1['xAxis'].data.push(value['dateStr'])
            this.obj1['series'][0].data.push(value["clickCount"]==null ? 0 : value["clickCount"])
            this.obj1['tooltip'].data.push(value["clickCount"]==null ? 0 : value["clickCount"])
            this.obj2['xAxis'].data.push(value['dateStr'])
            this.obj2['series'][0].data.push(value["userCount"]==null ? 0 : value["userCount"])
            this.obj2['tooltip'].data.push(value["userCount"]==null ? 0 : value["userCount"])
          })
        }
      );
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
}
