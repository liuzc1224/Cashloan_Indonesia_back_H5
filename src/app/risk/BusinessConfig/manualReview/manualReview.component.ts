import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TableData } from '../../../share/table/table.model';
import { unixTime } from "../../../format";
import { RiskReviewService } from '../../../service/risk';
import { CommonMsgService } from '../../../service/msg/commonMsg.service';
import { Response } from '../../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../service/storage';
import {SearchModel} from './searchModel';
import {MsgService} from '../../../service/msg';

let __this;
@Component({
  selector: "",
  templateUrl: "./manualReview.component.html",
  styleUrls: ['./manualReview.component.less']
})
export class ManualReviewComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private service: RiskReviewService,
    private msg : MsgService ,
    private Cmsg: CommonMsgService,
    private fb: FormBuilder,
    private sgo : SessionStorageService
  ) { };

  ngOnInit() {
    __this = this;

    this.getLanguage();

    this.validateForm = this.fb.group({
      id: [null],
      flowName: [null, [Validators.required]],
      nextStepPass: [null, [Validators.required]],
      nextStepRefuse: [null, [Validators.required]],
      previousStep: [null, [Validators.required]],
      status: [null, [Validators.required]],
      type: [null]
    });

  };

  languagePack: Object;
  searchModel : SearchModel = new SearchModel() ;
  validateForm: FormGroup;
  status : Array<Object>;
  status1 : Array<Object>;
  selectDataBy : Array<Object>;
  selectDataByData : Array<Object>;
  selectDataRefuseData : Array<Object>;
  selectDataRefuse : Array<Object>;
  selectData : Array<Object>;
  selectAllData : Array<Object>;
  allSelectData : Array<Object>;
  checkParametersData : Array<Object>;
  keys:Array<String>;
  isOkLoading : Boolean=false;
  checkSetMark : Boolean=false;
  isCheckOkLoading : Boolean=false;
  getLanguage() {
    this.translateSer.stream(["BusinessConfig.machineReview", 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data:data['BusinessConfig.machineReview'],
          };
          this.status=this.languagePack['data']['status'];
          this.status1=this.languagePack['data']['status1'];
          this.getCheckParameters();
          this.getSelectData();
          this.initialTable();
        }
      )
  };

  tableData: TableData;

  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack['data']['id'],
          reflect: "id",
          type: "text"
        },
        {
          name: __this.languagePack['data']['stageName'],
          reflect: "flowName",
          type: "text"
        },
        // {
        //   name: __this.languagePack['data']['parameter'],
        //   reflect: "checkParameters",
        //   type: "text",
        //   filter:(item)=>{
        //     if (item['checkParameters'] != null) {
        //       let checkParameters = item['checkParameters'].split('_');
        //       const map = this.checkParametersData;
        //       let str = "";
        //       checkParameters.forEach(v => {
        //         let name = map.filter(item => {
        //           return item['id'] == v;
        //         });
        //         str = (name.length > 0 && name[0]['paramName']) ? str + ',' + name[0]['paramName'] : ""
        //       });
        //
        //       return str.substring(1);
        //     }
        //   }
        // },
        {
          name: __this.languagePack['data']['previous'],
          reflect: "previousStep",
          type: "text",
          filter : ( item ) => {
            let previousStep = item['previousStep'] ;
            const map = this.allSelectData ;
            let name = map.filter( item => {
              return item['id'] == previousStep ;
            });
            return (name.length>0 && name[0]['flowName'] ) ? name[0]['flowName'] : "" ;
          }
        }, {
          name: __this.languagePack['data']['through'],
          reflect: "nextStepPass",
          type: "text",
          filter : ( item ) => {
            let nextStepPass = item['nextStepPass'] ;
            const map = this.allSelectData ;
            let name = map.filter( item => {
              return item['id'] == nextStepPass ;
            });
            return (name.length>0 && name[0]['flowName'] ) ? name[0]['flowName'] : "" ;
          }
        },{
          name: __this.languagePack['data']['rejection'],
          reflect: "nextStepRefuse",
          type: "text",
          filter : ( item ) => {
            let nextStepRefuse = item['nextStepRefuse'] ;
            const map = this.allSelectData ;
            let name = map.filter( item => {
              return item['id'] == nextStepRefuse ;
            });
            return (name.length>0 && name[0]['flowName'] ) ? name[0]['flowName'] : "" ;
          }
        },{
          name: __this.languagePack['data']['updater'],
          reflect: "employeeName",
          type: "text",
        },{
          name: __this.languagePack['data']['updateTime'],
          reflect: "modifyTime",
          type: "text",
          filter: (item)=>{
            return unixTime(item.modifyTime, 'y-m-d h:i:s');
          }
        }, {
          name: __this.languagePack['data']['state'],
          reflect: "status",
          type: "text",
          filter: (item) => {
            const status = item['status'];
            let desc = this.status.filter(item => {
              return item['value'] == status;
            });
            return (desc && desc[0]['desc']) ? desc[0]['desc'] : "no";
          }
        }
      ],
      loading: false,
      showIndex: true,
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [{
          textColor: "#80accf",
          name: __this.languagePack['common']['operate']['edit'],
          ico : "anticon anticon-edit" ,
          bindFn: (item) => {
            let params;
            this.selectDataByData=this.selectDataBy.filter(v=>{
              return v['id']!==item.id
            });
            this.selectDataRefuseData=this.selectDataRefuse.filter(v=>{
              return v['id']!==item.id
            });
            this.selectAllData=this.selectData.filter(v=>{
              return v['id']!==item.id
            });
            this.validateForm.patchValue({
              id: item.id,
              flowName: item.flowName,
              // checkParameters: item.checkParameters ? item.checkParameters.split('_') : [],
              nextStepPass: item.nextStepPass,
              nextStepRefuse : item.nextStepRefuse,
              previousStep : item.previousStep,
              status : item.status,
              type : item.type
            });
            this.riskSetMark = true;
          }
        }]
      }
    };
    this.getList();
  };
  resultText : number;
  resultMsg : string = "";
  selectItem: object;
  riskSetMark: boolean = false;
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  getList() {
    this.tableData.loading = true;
    let data = this.searchModel;
    this.service.getReview(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };

          this.tableData.loading = false;

          if (res.data && res.data['length'] == 0) {
            this.tableData.data = [];
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {

          let data_arr = res.data;

          this.tableData.data = (<Array<Object>>data_arr);
          this.getSelectData();
        }
      )
  };
  getSelectData(){
    let data = {

    };
    this.service.getReview(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };
          if (res.data && res.data['length'] == 0) {
            this.selectDataBy = this.languagePack['data']['stageDataByManualReview'];
            this.selectDataRefuse = this.languagePack['data']['stageDataRefuseManualReview'];

            this.selectData = this.languagePack['data']['stageData'];
            this.allSelectData = this.languagePack['data']['stageData'];
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {
          this.allSelectData = (<Array<Object>>res.data);
          this.selectData=(<Array<Object>>res.data).filter(v=>{
            return v['status']==1
          });
          this.selectDataBy = this.selectData.concat(this.languagePack['data']['stageDataByManualReview']);
          this.selectDataRefuse = this.selectData.concat(this.languagePack['data']['stageDataRefuseManualReview']);
          this.selectData=this.selectData.concat(this.languagePack['data']['stageData']);
          this.allSelectData=this.allSelectData.concat(this.languagePack['data']['stageData']);
          this.selectDataByData=this.selectDataBy;
          this.selectDataRefuseData=this.selectDataRefuse;
          this.selectAllData=this.selectData;
        }
      )
  }
  getCheckParameters() {
    let data = {
      isPaging:false
    };
    this.service.getriskReview(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };
          if (res.data && res.data['length'] == 0) {
            this.checkParametersData = [];
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {

          let data_arr = res.data;

          this.checkParametersData = (<Array<Object>>data_arr).filter(v=>{
            return v['status']=='ON_LINE'
          });

        }
      )
  };
  // delete(){
  //   let data={
  //     flowId:2
  //   };
  //   this.service.deleteReview(data).pipe(
  //     filter((res: Response) => {
  //       if (res.success !== true) {
  //         this.Cmsg.fetchFail(res.message);
  //       };
  //       return res.success === true ;
  //     })
  //   )
  //     .subscribe(
  //       (res: Response) => {
  //         this.Cmsg.operateSuccess();
  //         this.getList();
  //       }
  //     )
  // }
  handleCancel(){
    this.validateForm.reset();
    this.riskSetMark=false;
  }
  makeNew(){
    if(!this.validateForm.valid){
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      return
    }
    this.isOkLoading = true;
    let value = this.validateForm.value;
    let data={
      id: value['id'],
      flowName: value['flowName'],
      nextStepPass: value['nextStepPass'],
      nextStepRefuse: value['nextStepRefuse'],
      previousStep: value['previousStep'],
      status: value['status'],
      type: value['type']
    };
    // if(value['checkParameters']){
    //   data['checkParameters']=value['checkParameters'].join('_');
    // }
    if(data['id']){
      this.updateStage(data);
    }else{
      this.addStage(data);
    }
  }
  updateStage(data){
    this.service.updateReview(data)
      .pipe(
        filter((res: Response) => {

          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {

          this.Cmsg.operateSuccess();
          this.riskSetMark = false;
          this.getList();
        });
  }
  addStage(data){
    this.service.addReview(data)
      .pipe(
        filter((res: Response) => {

          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          };
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {

          this.Cmsg.operateSuccess();
          this.riskSetMark = false;
          this.getList();
        });
  }
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  }
  change(i,$event){
    let aa=$event.target.value;
    aa=aa.substring(0,aa.length);
    let value=this.validateForm.value['params'];
    value[i]=aa;
  }
  add(){
    this.validateForm.reset();
    this.validateForm.patchValue({
      type : 1
    });
    this.riskSetMark = true;
  }
  update(){
    this.service.systemCheck()
      .pipe(
        filter((res: Response) => {

          if (res.success !== true) {
            this.checkSetMark=true;
            this.resultText=1;
            this.resultMsg=res.message;
            // this.Cmsg.operateFail(res.message);
          };
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.resultText=0;
          this.resultMsg=null;
          this.checkSetMark=true;
        });
  }
  checkCancel(){
    this.checkSetMark=false;
  }
  checkMakeNew(){
    this.resultText=null;
    this.resultMsg=null;
    this.service.systemUpdate()
      .pipe(
        filter((res: Response) => {

          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          };
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.checkSetMark=false;
          this.Cmsg.operateSuccess();
          this.resultText=null;
          this.resultMsg=null;
        });
  }
}
