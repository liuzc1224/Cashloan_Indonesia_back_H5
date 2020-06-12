import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {dataFormat, DateObjToString,unixTime} from '../../../format/index';
import {CommonMsgService, MsgService} from '../../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage/index';
import {ObjToArray} from '../../../share/tool/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model/index';
import {RecordService} from '../../../service/collectionManagement/record.service';

let __this;

@Component({
  selector: '',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.less']
})
export class RecordComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: RecordService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  tableData: TableData;
  recordType:Array<string>;
  chType:number=1;
  ngOnInit() {
    __this = this;
    this.getLanguage();
  };
  changeStatus(data){
    this.chType=data;
    this.initialTable();
  }
  getLanguage() {
    this.translateSer.stream(['collectionManagement.record', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['collectionManagement.record'],
            callRecords:data['collectionManagement.record']['callRecords'],
            smsRecord:data['collectionManagement.record']['smsRecord']
          };
          this.recordType=this.languagePack["data"]["recordType"];
          this.initialTable();
        }
      );
  };
  initialTable(){
    if(this.chType==1){
      this.initcallRecords();
    }
    if(this.chType==2){
      this.initsmsRecord();
    }
  };
  initcallRecords() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['callRecords']['id'],
          reflect: 'id',
          type: 'text'
        },
        {
          name: __this.languagePack['callRecords']['callingSeat'],
          reflect: 'caller',
          type: 'text'
        },
        {
          name: __this.languagePack['callRecords']['callNumber'],
          reflect: 'callee',
          type: 'text',
        },
        {
          name: __this.languagePack['callRecords']['callStartTime'],
          reflect: 'startTime',
          type: 'text',
          filter : ( item ) =>{
            return unixTime(new Date(item.startTime)) ;
          }
        },
        {
          name: __this.languagePack['callRecords']['callEndTime'],
          reflect: 'endTime',
          type: 'text',
          filter : ( item ) =>{
            return unixTime(new Date(item.endTime)) ;
          }
        },
        {
          name: __this.languagePack['callRecords']['callDuration'],
          reflect: 'feeTime',
          type: 'text',
        },
        {
          name: __this.languagePack['callRecords']['recordingFiles'],
          reflect: 'recodingUrl',
          type: 'audio'
        }
      ]
    };
    this.getList();
  }
  initsmsRecord() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['smsRecord']['id'],
          reflect: 'id',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['sender'],
          reflect: 'operatorName',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['send'],
          reflect: 'targetPhoneNumber',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['content'],
          reflect: 'content',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['sendTime'],
          reflect: 'sendTimeStr',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['sendResult'],
          reflect: 'sendResult',
          type: 'text'
        }
      ]
    };
    this.getList();
  }
  totalSize: number = 0;
  getList(){
    if(this.chType==1){
      this.getcallRecords();
    }
    if(this.chType==2){
      this.getsmsRecord();
    }
  }
  searchData(){
    let data;
    if(this.chType==1){
      let model=this.searchModel;
      let etime = unixTime(<Date>model.endTime,"y-m-d");
      model.startTime = model.startTime ? unixTime((<Date>model.startTime),"y-m-d")+" 00:00:00" : null;
      model.endTime = etime ? etime + " 23:59:59" : etime;
      let start=(new Date(model.startTime)).getTime();
      let end=(new Date(model.endTime)).getTime();
      if( start - end >0 ){
        model.startTime=null;
        model.endTime=null;
      }
      data ={
        callTo:model.callTo,
        callFrom:model.callFrom,
        callTimeStartBegin:model.startTime,
        callTimeStartEnd:model.endTime,
        currentPage:model.currentPage,
        pageSize:model.pageSize,
      };
    }
    if(this.chType==2){
      let model=this.searchModel;
      let etime = unixTime(<Date>model.endTime,"y-m-d");
      model.startTime = model.startTime ? unixTime((<Date>model.startTime),"y-m-d")+" 00:00:00" : null;
      model.endTime = etime ? etime + " 23:59:59" : etime;
      let start=(new Date(model.startTime)).getTime();
      let end=(new Date(model.endTime)).getTime();
      if( start - end >0 ){
        model.startTime=null;
        model.endTime=null;
      }
      data ={
        receiver:model.receiver,
        sendTimeStart:model.startTime,
        sendTimeEnd:model.endTime,
        currentPage:model.currentPage,
        pageSize:model.pageSize,
      };
    }
    return data;
  }
  getcallRecords(){
    this.tableData.loading = true ;
    let data =this.searchData();
    this.service.queryOverdueCallRecord(data)
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
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize = 0;
          }
        }
      );
  }
  getsmsRecord(){
    this.tableData.loading = true ;
    let data =this.searchData();
    this.service.queryOverdueMessageRecord(data)
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
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize = 0;
          }
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
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  exportData(){
    let data =this.searchData();
    if(this.chType==1){
      this.service.exportOverdueCallRecord(data);
    }
    if(this.chType==2){
      this.service.exportOverdueMessageRecord(data);
    }
  }
}
