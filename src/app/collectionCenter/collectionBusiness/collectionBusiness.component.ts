import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../share/table/table.model';
import {dataFormat} from '../../format';
import {CommonMsgService, MsgService} from '../../service/msg';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage';
import {DateToStamp, GetNow, ObjToArray} from '../../share/tool';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model';
import {CollectionBusiness} from '../../service/collectionBusiness';

let __this;

@Component({
  selector: '',
  templateUrl: './collectionBusiness.component.html',
  styleUrls: ['./collectionBusiness.component.less']
})
export class CollectionBusinessComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: CollectionBusiness,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  tableData: TableData;
  status : Array<String>;
  dayModel: boolean = false;
  freeModel: boolean = false;
  makeLoanMark: boolean = false;
  validateForm: FormGroup;
  isOkLoading:Boolean=false;
  title: String="";
  ngOnInit() {
    __this = this;
    this.getLanguage();
    this.validateForm = this.fb.group({
      id:[null],
      phaseName : [null, [Validators.required]],
      startOverdueTime : [null, [Validators.required]],
      endOverdueTime : [null, [Validators.required]],
      flowPattern : [null, [Validators.required]],
      retainedDays : [null],
      loanTermWithoutReminder : [null],
      select : [null],
      state : [null, [Validators.required]],
    });
  };

  getLanguage() {
    this.translateSer.stream(['collectionBusiness', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['collectionBusiness'],
            tabData:data['collectionBusiness']['tabData']
          };
          this.status=data['collectionBusiness']['state'];
          this.initialTable();
        }
      );
  };

  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['tabData']['id'],
          reflect: 'id',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['name'],
          reflect: 'phaseName',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['fromTime'],
          reflect: 'startOverdueTime',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['toTime'],
          reflect: 'endOverdueTime',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['days'],
          reflect: 'retainedDays',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['flowMode'],
          reflect: 'flowPattern',
          type: 'text',
          filter: (item) => {
            let data=__this.languagePack['list']['flowMode'];
            let type=data.filter(v => {
              return v.value==item['flowPattern'];
            });
            let flowMode=(type.length>0 && type[0].desc) ? type[0].desc : "";
            return (flowMode) ? flowMode : '';
          }
        },
        {
          name: __this.languagePack['tabData']['freeLoanTerm'],
          reflect: 'loanTermWithoutReminder',
          type: 'text'
        },
        {
          name: __this.languagePack['tabData']['state'],
          reflect: 'state ',
          type: 'text',
          filter: (item) => {
            let data=__this.status;
            let type=data.filter(v => {
              return v.value==item['state'];
            });
            let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
            return (state) ? state : '';
          },
        }
      ],
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [{
          textColor: '#0000ff',
          name: __this.languagePack['common']['operate']['edit'],
          bindFn: (item) => {
            this.validateForm.reset();
            this.title=this.languagePack["list"]["edit"];
            let str=item['loanTermWithoutReminder'];
            let x = this.getNum(str);
            this.validateForm.patchValue({
              id:item['id'],
              phaseName : item['phaseName'],
              startOverdueTime : item['startOverdueTime'],
              endOverdueTime : item['endOverdueTime'],
              flowPattern : item['flowPattern'],
              retainedDays : item['retainedDays'],
              loanTermWithoutReminder : x>0 ? str.substring(x,str.length) : null,
              select : x>0 ? str.substring(0,x) : null,
              state : item['state'],
            });
            if(str){
              this.freeModel=true;
            }
            if(item['retainedDays']){
              this.dayModel=true;
            }
            this.makeLoanMark=true;
          }
        }]
      }
    };
    this.getList();
  }

  totalSize: number = 0;

  getList(){
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      businessConfigState:model.businessConfigState,
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.getData(data)
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
  add(){
    this.title=this.languagePack["list"]["add"];
    this.validateForm.reset();
    this.makeLoanMark=true;
  }
  makeNew($event) {
    let from = this.validateForm.value;
    if(from.startOverdueTime>from.endOverdueTime){
      this.Cmsg.fetchFail(this.languagePack['list']['prompt']['tip']) ;
      return;
    }
    let data={
      id:from['id'],
      phaseName : from['phaseName'],
      startOverdueTime : from['startOverdueTime'],
      endOverdueTime : from['endOverdueTime'],
      flowPattern : from['flowPattern'],
      retainedDays : from['retainedDays'],
      loanTermWithoutReminder : from["select"] + from["loanTermWithoutReminder"],
      state : from['state'],
    };
    if(!this.freeModel){
      data["loanTermWithoutReminder"]=0;
    }
    if(!this.dayModel){
      data["retainedDays"]=0;
    }
    if(data["id"]){
      this.updateData(data);
    }else{
      this.addData(data);
    }
  }
  updateData(data){
    this.isOkLoading=true;
    this.service.update(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.makeLoanMark = false;
          this.getList();
        }
      );
  }
  addData(data){
    this.isOkLoading=true;
    this.service.addData(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.makeLoanMark = false;
          this.getList();
        }
      );
  }
  getNum(str) {
    if(str){
      let pattern = new RegExp("[0-9]+");
      if(str.indexOf('-')>-1){
        return str.indexOf('-');
      }else{
        let num = str.match(pattern);
        return str.indexOf(num);
      }
    }
  }
}
