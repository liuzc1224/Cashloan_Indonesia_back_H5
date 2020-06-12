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
import {MsgService} from '../../../service/msg';

let __this;
@Component({
  selector: "",
  templateUrl: "./letterReview.component.html",
  styleUrls: ['./letterReview.component.less']
})
export class LetterReviewComponent implements OnInit {

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
      morningStart: [null, [Validators.required]],
      morningEnd: [null, [Validators.required]],
      afternoonStart: [null, [Validators.required]],
      afternoonEnd: [null, [Validators.required]]
    });
    this.validForm = this.fb.group({
      id: [null],
      count: [null, [Validators.required]]
    });

  };

  languagePack: Object;
  validateForm: FormGroup;
  validForm: FormGroup;
  statusEum : Array<Object>;
  status : Array<Object>;
  creditContentData : Array<Object>;
  creditTimeData : Array<Object>;
  reviewType : Array<Object>;
  keys:Array<String>;
  isOkLoading : Boolean=false;
  numberOkLoading : Boolean=false;

  getLanguage() {
    this.translateSer.stream(['common','reviewRiskList.riskSetting'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data:data['reviewRiskList.riskSetting'],
            table:data['reviewRiskList.riskSetting']['table'],
          };
          this.statusEum=this.languagePack['data']['state'];
          this.status=this.languagePack['data']['status'];
          this.reviewType=this.languagePack['data']['reviewType'];
          this.initialTable();
        }
      )
  };

  tableData: Array<Object>;

  initialTable() {
    this.getCreditContent();
    this.getCreditTime();
  };

  selectItem: object;
  timeModal: boolean = false;
  timeLoading: boolean = false;

  numberLoading: boolean = false;
  numberModal: boolean = false;
  getCreditContent() {
    this.numberLoading=true;
    this.service.creditContent()
      .pipe(
        filter((res: Response) => {
          this.numberLoading=false;
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.creditContentData = [];
          this.creditContentData.push(res.data);
          console.log(this.creditContentData)

        }
      );
  };
  getCreditTime(){
    this.timeLoading=true;
    this.service.creditTime()
      .pipe(
        filter((res: Response) => {
          this.timeLoading=false;
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };
          if (res.data && res.data['length'] == 0) {
            this.creditTimeData = [];
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {

          let data_arr = res.data;

          this.creditTimeData = (<Array<Object>>data_arr);
          console.log(this.creditTimeData)
        }
      )
  }
  makeNew(){
    if(!this.validateForm.valid){
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    let data=this.validateForm.value;
    let postData={
      id:data['id'],
      morningStart:data['morningStart'] ? this.date(data['morningStart']) : null,
      morningEnd:data['morningEnd'] ? this.date(data['morningEnd']) : null,
      afternoonStart:data['afternoonStart'] ? this.date(data['afternoonStart']) : null,
      afternoonEnd:data['afternoonEnd'] ? this.date(data['afternoonEnd']) : null
    };
    this.isOkLoading=true;
    this.service.updateCreditTime(postData)
      .pipe(
        filter((res: Response) => {
          this.isOkLoading=false;
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {

          this.Cmsg.operateSuccess();
          this.timeModal = false;
          this.getCreditTime();
        });
  }
  makeNumber(){

    if(!this.validForm.valid){
      for (const i in this.validForm.controls) {
        this.validForm.controls[i].markAsDirty();
        this.validForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    this.numberOkLoading=true;
    let data=this.validForm.value;
    this.service.updateCreditContent(data)
      .pipe(
        filter((res: Response) => {
          this.numberOkLoading=false;
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {

          this.Cmsg.operateSuccess();
          this.numberModal = false;
          this.getCreditContent();
        });
  }
  setTime(data){
    this.validateForm.patchValue({
      id:data['id'],
      morningStart:data['morningStart'] ? new Date(data['morningStart']) : null,
      morningEnd:data['morningEnd'] ? new Date(data['morningEnd']) : null,
      afternoonStart:data['afternoonStart'] ? new Date(data['afternoonStart']) : null,
      afternoonEnd:data['afternoonEnd'] ? new Date(data['afternoonEnd']) : null
    });
    this.timeModal=true;
  }
  setNumber(data){
    this.validForm.reset();
    this.validForm.patchValue({
      id: data['id'],
      count: data['count']
    });
    this.numberModal=true;
  }
  timeToString(data){
    return unixTime(new Date(data),"h:i:s");
  }
  date(data){
    return unixTime(data)
  }
}
