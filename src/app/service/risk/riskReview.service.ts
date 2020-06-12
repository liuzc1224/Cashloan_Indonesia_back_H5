import { Injectable } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn : "root"
})
export class RiskReviewService {
  constructor(
    private http: HttpClient
  ) {
  };


  getList(paras: Object) {

    let para = ObjToQuery(paras);

    let url = GLOBAL.API.risk.riskList;
    return this.http.get(url, {
      params: para
    });
  };
  setAllocation(data : Object) {
    let url = GLOBAL.API.risk.setEmployees ;

    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;

    return this.http.put(url , data , {
      headers : header
    });
  }
  getriskReview(paras) {
    let url = GLOBAL.API.risk.riskReview.getriskReview;
    let para = ObjToQuery(paras) ;
    return this.http.get(url , {
      params : para
    });
  }
  exportRiskReview(paras) {
    const para = ObjToQuery(paras);
    let url = GLOBAL.API.risk.riskReview.exportRiskReview+"?"+para ;
    window.location.href = url;
    return;
  }
  getUserSocialIdentityCode(){
    let url = GLOBAL.API.risk.riskReview.getUserSocialIdentityCode;
    return this.http.get(url);
  }

  setriskReview(data: Object) {
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    let url = GLOBAL.API.risk.riskReview.setriskReview;
    return this.http.put(url+"/"+data['id'], data, {
      headers: header
    });

  };
  //信审公司
  addCreditReviewFirm(data: Object) {
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    let url = GLOBAL.API.risk.letterReviewMember.addCreditReviewFirm;
    return this.http.post(url, data, {
      headers: header
    });
  };
  queryCreditReviewFirm(data: Object) {
    let url = GLOBAL.API.risk.letterReviewMember.queryCreditReviewFirm;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });

  };
  getAllCreditReviewFirm() {
    let url = GLOBAL.API.risk.letterReviewMember.getAllCreditReviewFirm;
    return this.http.get(url);

  };
  updateCreditReviewFirm(data: Object) {
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    let url = GLOBAL.API.risk.letterReviewMember.updateCreditReviewFirm;
    return this.http.post(url, data, {
      headers: header
    });

  };
  //信审小组
  addCreditReviewGroup(data: Object) {
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    let url = GLOBAL.API.risk.letterReviewMember.addCreditReviewGroup;
    return this.http.post(url, data, {
      headers: header
    });
  };
  queryCreditReviewGroup(data: Object) {
    let url = GLOBAL.API.risk.letterReviewMember.queryCreditReviewGroup;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });

  };
  getAllCreditReviewGroup() {
    let url = GLOBAL.API.risk.letterReviewMember.getAllCreditReviewGroup;
    return this.http.get(url);

  };
  updateCreditReviewGroup(data: Object) {
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    let url = GLOBAL.API.risk.letterReviewMember.updateCreditReviewGroup;
    return this.http.post(url, data, {
      headers: header
    });

  };
  //信审成员
  addCreditReviewStaff(data: Object) {
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    let url = GLOBAL.API.risk.letterReviewMember.addCreditReviewStaff;
    return this.http.post(url, data, {
      headers: header
    });
  };
  queryCreditReviewStaff(data: Object) {
    let url = GLOBAL.API.risk.letterReviewMember.queryCreditReviewStaff;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });

  };
  getAllCreditReviewStaff(data: Object) {
    let url = GLOBAL.API.risk.letterReviewMember.getAllCreditReviewStaff;
    return this.http.get(url);

  };
  updateCreditReviewStaff(data: Object) {
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    let url = GLOBAL.API.risk.letterReviewMember.updateCreditReviewStaff;
    return this.http.post(url, data, {
      headers: header
    });

  };
  //审核流程
  getReview(data: Object) {
    let url = GLOBAL.API.risk.businessConfig.review;
    let para = ObjToQuery(data) ;
    return this.http.get(url,{
      params:para
    });
  };
  //审核流程配置
  addReview(data: Object) {
    let url = GLOBAL.API.risk.businessConfig.review;
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    return this.http.post(url, data, {
      headers: header
    });
  };
  updateReview(data: Object) {
    let url = GLOBAL.API.risk.businessConfig.review;
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    return this.http.put(url, data, {
      headers: header
    });
  };
  deleteReview(data: Object) {
    let url = GLOBAL.API.risk.businessConfig.review;
    return this.http.delete(url+"/"+data['flowId']);
  };
  //信审工作配置
  creditContent() {
    let url = GLOBAL.API.risk.businessConfig.creditContent;
    return this.http.get(url);
  };
  updateCreditContent(data: Object) {
    let url = GLOBAL.API.risk.businessConfig.updateCreditContent;
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    return this.http.post(url, data, {
      headers: header
    });
  };
  creditTime() {
    let url = GLOBAL.API.risk.businessConfig.creditTime;
    return this.http.get(url);
  };
  updateCreditTime(data: Object) {
    let url = GLOBAL.API.risk.businessConfig.updateCreditTime;
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    return this.http.post(url, data, {
      headers: header
    });
  };
  systemCheck() {//阶段校验
    let url = GLOBAL.API.risk.businessConfig.systemCheck;
    return this.http.get(url);
  };
  systemUpdate() {//阶段更新
    let url = GLOBAL.API.risk.businessConfig.systemUpdate;
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    return this.http.put(url, {
      headers: header
    });
  };
}
