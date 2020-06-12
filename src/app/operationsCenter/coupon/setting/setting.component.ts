import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CommonMsgService} from '../../../service/msg';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingModel} from './settingModel';
import {SessionStorageService} from '../../../service/storage';
import {FormBuilder} from '@angular/forms';
import {CouponService} from '../../../service/operationsCenter';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model';
import {DateObjToString,dataFormat,unixTime} from '../../../format'
let __this ;

@Component({
  selector : "" ,
  templateUrl : "./setting.component.html" ,
  styleUrls : ['./setting.component.less']
})
export class SettingComponent implements OnInit{
  constructor(
    private translateSer : TranslateService ,
    private msg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : CouponService ,
  ){};
  languagePack : Object ;
  ngOnInit(){
    __this = this ;
    this.getLanguage() ;
  };
  settingModel : SettingModel = new SettingModel() ;
  Model:Number=0;
  Model1:Number=0;
  registerTimeStart:any = '';
  registerTimeEnd:any = '';
  day:Number=0;
  dayModel:Boolean;
  timeType:Object;
  receive:Array< String >;
  crowd:Object;
  crowds:Array<String>=[];
  offer:Array<String>=[];
  offerValue:String;
  quantity:Array<Number>=[1,2,3,4,5,6,7,8,9,10];
  getLanguage(){
    this.translateSer.stream(["coupon.list","common"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            list:data['coupon.list']
          };

          let ty=this.languagePack["list"]["type"];
          this.timeType=Object.values(ty);

          this.receive=this.languagePack["list"]["receiveData"];
          // this.receive=Object.values(receive);
          // this.receive.splice(0,2);

          this.crowd=this.languagePack["list"]["crowd"];


          let offer=this.languagePack["list"]["offer"];
          this.offer=Object.values(offer);
          // this.offer.push(this.languagePack["list"]["offer"]['interestrateReduction']);

          // this.offer.splice(0,1);

          this.dayModel=false;
          this.routerInfo.queryParams
            .subscribe(
              (para) => {
                console.log(para);
                if(para["id"]){
                  this.getCoupon(para);
                }
              }
            );

        }
      )
  };
  Value:any=null;
  Val:any=null;
  getCoupon(para){
    console.log(para);
    this.service.getCoupon(para)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          // mxTime(res.data["effectiveDate"],"m/y/d")
          if(res.data["expDays"]==null){
            this.Model1=1;
          }else{
            this.Model1=0;
          }
          if(res.data["couponCondition"]){
            if(res.data["couponType"]==3){
              this.Value=res.data["couponDays"];
            }else{
              this.Value=res.data["couponValue"].toFixed(2);
            }

          }else{
            if(res.data["couponType"]==3){
              this.Val=res.data["couponDays"];
            }else{
              this.Val=res.data["couponValue"].toFixed(2);
            }
          }
          if(res.data["couponCondition"]){
            this.Model=0;
          }else{
            if(res.data["couponCondition"]==0){
              res.data["couponCondition"]='';
            }
            this.Model=1;
          }
          if(res.data["expDays"]){
            console.log(this.dayModel);
            console.log(res.data["expDays"]);
            this.dayModel=true;
            console.log(this.dayModel);
          }
          if(res.data["effectiveDate"]){
            res.data["effectiveDate"]=unixTime(res.data["effectiveDate"]);
          }
          if(res.data["expDate"]){
            res.data["expDate"]=unixTime(res.data["expDate"]);
          }
          console.log(res.data);
          __this.settingModel = (< Array<Object> >res.data);
          if(!__this.settingModel['couponDescription']){
            __this.settingModel['couponDescription']='';
          }
        }
      );
  }
  operateCrowd(option){
    let arr=this.crowds;
    if(option!==this.crowd[0]){
      if(!arr.includes(option)){
        arr.push(option);
      }
    }
  }
  cancel(){
    this.router.navigate(['/operationsCenter/coupon/list']);
  }
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.settingModel["effectiveDate"]) {
      return endValue.getTime() <  new Date().getTime();
    }
    return endValue.getTime() < new Date(this.settingModel["effectiveDate"]).getTime();
  };
  disabledStartDate= (startValue: Date): boolean => {
    if (!startValue || !this.settingModel["expDate"]) {
      return startValue.getTime() < new Date().getTime();
    }
    return startValue.getTime() < new Date().getTime();
  };
  setting(){
    if (!this.settingModel["couponName"]) {
      this.msg.operateFail(this.languagePack['list']['table']['couponName']+this.languagePack['common']['validator']['notEmpty']);
      return false;
    }
    if (!this.settingModel["couponDescription"]) {
      this.msg.operateFail(this.languagePack['list']['setting']['description']+this.languagePack['common']['validator']['notEmpty']);
      return false;
    }
    if(!this.settingModel["effectiveDate"] || !this.settingModel["expDate"]){
      this.msg.operateFail(this.languagePack['list']['table']['effectiveTime']+this.languagePack['common']['validator']['notEmpty']);
      return false;
    }else{
      let begin=new Date(this.settingModel["effectiveDate"]);
      let end=new Date(this.settingModel["expDate"]);

      // console.log(DateObjToString(this.settingModel["effectiveDate"])+"       "+DateObjToString(this.settingModel["expDate"]))
      if(begin.getTime()-end.getTime()>0){
        this.msg.operateFail(this.languagePack['list']['table']['effectiveTime']+this.languagePack['common']['validator']['notEmpty']);
        return false;
      }
      this.settingModel["effectiveDate"]= dataFormat(this.settingModel["effectiveDate"],"y-m-d")+" 00:00:00";
      this.settingModel["expDate"] = dataFormat(this.settingModel["expDate"],"y-m-d")+" 23:59:59";
    }
    if(!this.dayModel){
      this.settingModel["expDays"]=null;
    }
    if (!this.settingModel["obtainType"]) {
      this.msg.operateFail(this.languagePack['list']['prompt']['receiveType']+this.languagePack['common']['validator']['notEmpty']);
      return false;
    }
    if (this.settingModel["couponPeoples"]==null) {
      this.msg.operateFail(this.languagePack['list']['setting']['activityCrowd']+this.languagePack['common']['validator']['notEmpty']);
      return false;
    }
    if (!this.settingModel["couponType"]) {
      this.msg.operateFail(this.languagePack['list']['table']['offerType']+this.languagePack['common']['validator']['notEmpty']);
      return false;
    }
    if(this.Model==0){
      if(this.settingModel["couponType"]==3){
        this.settingModel.couponDays=this.Value;
        if(!this.settingModel["couponCondition"] || !this.settingModel["couponDays"] || parseFloat(this.settingModel["couponDays"])==0){
          this.msg.operateFail(this.languagePack['list']['setting']['preferentialConditions']+this.languagePack['common']['validator']['notEmpty']);
          return false;
        }
      }else{
        this.settingModel.couponValue=this.Value;
        if(!this.settingModel["couponCondition"] || !this.settingModel["couponValue"] || parseFloat(this.settingModel["couponValue"])==0){
          this.msg.operateFail(this.languagePack['list']['setting']['preferentialConditions']+this.languagePack['common']['validator']['notEmpty']);
          return false;
        }
      }

    }else{
      if(this.settingModel["couponType"]==3){
        this.settingModel.couponDays=this.Val;
        if(!this.settingModel["couponDays"] || parseFloat(this.settingModel["couponDays"])==0){
          this.msg.operateFail(this.languagePack['list']['setting']['preferentialConditions']+this.languagePack['common']['validator']['notEmpty']);
          return false;
        }
      }else {
        this.settingModel.couponValue = this.Val;
        if (!this.settingModel["couponValue"] || parseFloat(this.settingModel["couponValue"]) == 0) {
          this.msg.operateFail(this.languagePack['list']['setting']['preferentialConditions'] + this.languagePack['common']['validator']['notEmpty']);
          return false;
        }
      }
      this.settingModel.couponCondition=0;
    }
    let data=this.settingModel;
    console.log(data);
    if(data["id"]){
      this.service.update(data)
        .pipe(
          filter( (res : Response) => {
            if(res.success === false){
              this.msg.fetchFail(res.message) ;
            };
            return res.success === true;
          })
        )
        .subscribe(
          ( res : Response ) => {
            console.log(res);
            this.router.navigate(['/operationsCenter/coupon/list']);
          }
        );
    }else{
      this.service.addCoupon(data)
        .pipe(
          filter( (res : Response) => {
            if(res.success === false){
              this.msg.fetchFail(res.message) ;
            };
            return res.success === true;
          })
        )
        .subscribe(
          ( res : Response ) => {
            console.log(res.data);
            this.router.navigate(['/operationsCenter/coupon/list']);
          }
        );
    }
  }

  test(data){

    let value=this.settingModel[data];
    if(value.length>0){
      value=value.replace(/[^0-9]/g,'');
      if(value<1){
        value=1;
      }
    }
    else{
      value=1;
    }
    console.log(value);
    this.settingModel[data]=value;
    console.log(this.settingModel)
  }
  test1(data){

    let value=this[data];

    if(value["length"]>0){
      value=value.replace(/[^0-9]/g,'');
      if(value<1){
        value=1;
      }
    }
    else{
      value=1;
    }
    console.log(value);
    this[data]=value;
  }
  test2(data){
    let value=this[data];
    value=value.replace(/[^\d.]/g,'');
    value=value.replace(/\.{2,}/g,".");
    console.log(value);
    this[data]=value;
  }
  setCouponType(){
    this.Value=null;
    this.Val=null;
    this.settingModel.couponCondition=null;
  }
}
