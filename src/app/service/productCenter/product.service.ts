import { Injectable } from '@angular/core' ;
import {HttpClient, HttpHeaders} from '@angular/common/http' ;
import { ObjToQuery } from '../ObjToQuery';
import { ObjToQueryString } from '../ObjToQueryString' ;
import { GLOBAL } from '../../global/global_settion';

@Injectable({
  providedIn : "root"
})
export class ProductService{
  constructor(
    private http : HttpClient
  ){} ;
  getProduct(obj : Object){
    let url = GLOBAL.API.productCenter.product.getProduct ;
    let para = ObjToQuery(obj) ;
    return this.http.get(url , {
      params : para
    });
  }
  updateProduct( data : Object){
    let url = GLOBAL.API.productCenter.product.updateProduct;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    console.log(data);
    return this.http.put(url,data,{
      headers : header
    });
  }
  addProduct(data : Object){
    let url = GLOBAL.API.productCenter.product.addProduct;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    return this.http.post(url , data , {
      headers : header
    });
  }
  loanProductPreview(data : Object){
    let url = GLOBAL.API.productCenter.product.loanProductPreview;
    return this.http.get(url+"/"+data['id']);
  }
  //实时更新
  realtime(){
    let url = GLOBAL.API.productCenter.product.realtime;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, {
      headers: header
    });
  }
  deleteProduct(data : Object){
    let url = GLOBAL.API.productCenter.product.deleteProduct;
    return this.http.get(url+"/"+data["id"]);
  }
  //工作日历管理
  getCalendar(data : String){
    let url = GLOBAL.API.productCenter.calendar.getCalendar;
    // console.log(url+data)
    return this.http.get(url+"?yearMonth="+data);
  }
  changeWorkDay(data : Object){
    let url = GLOBAL.API.productCenter.calendar.changeWorkDay;
    let header = new HttpHeaders().set("Content-type", "application/json");
    // console.log(data)
    return this.http.put(url, data, {
      headers: header
    });
  }
//帮助中心
  getHelpCenter(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.productCenter.helpCenter.getHelp;
    return this.http.get(url, {
      params: para
    });
  }
  getMaxOrderAddOne() {
    let url = GLOBAL.API.productCenter.helpCenter.getMaxOrderAddOne;
    return this.http.get(url);
  }
  addHelp(data: Object) {
    let url = GLOBAL.API.productCenter.helpCenter.addHelp;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  updateHelp(data: Object) {
    let url = GLOBAL.API.productCenter.helpCenter.updateHelp;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }
  deleteHelp(data: Object) {
    let url = GLOBAL.API.productCenter.helpCenter.deleteHelp;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.delete(url + "/" + data["id"]);
  }
  moveUp(data: Object){
    let url = GLOBAL.API.productCenter.helpCenter.moveUp;
    return this.http.patch(url+"/"+data['id'],data);
  }
  moveDown(data: Object){
    let url = GLOBAL.API.productCenter.helpCenter.moveDown;
    return this.http.patch(url+"/"+data['id'],data);
  }
  //短信模板
  getSMS(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.productCenter.SMSTemplate.getSMS;
    return this.http.get(url, {
      params: para
    });
  }
  updateSMS(data: Object) {
    let url = GLOBAL.API.productCenter.SMSTemplate.updateSMS;
    let header = new HttpHeaders().set("Content-type", "application/json");
    console.log(data)
    return this.http.put(url, data, {
      headers: header
    });
  }
  //push推送模板
  getPushTemplate(paras: Object) {
    // console.log(paras)
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.productCenter.pushTemplate.getPushTemplate;
    return this.http.get(url, {
      params: para
    });
  }
  updatePushTemplate(data: Object) {
    let url = GLOBAL.API.productCenter.pushTemplate.updatePushTemplate;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }
  //联系方式
  getContactInfo(paras: Object) {
    // console.log(paras)
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.productCenter.contactInfo.getContactInfo;
    return this.http.get(url, {
      params: para
    });
  }
  updateContactInfo(data: Object) {
    // console.log(data)
    let url = GLOBAL.API.productCenter.contactInfo.updateContactInfo;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }
  //银行管理
  getBank(paras: Object) {
    // console.log(paras)
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.productCenter.bankManagement.getBank;
    return this.http.get(url, {
      params: para
    });
  }
  getMaxSortAddOne() {
    let url = GLOBAL.API.productCenter.bankManagement.getMaxSortAddOne;
    return this.http.get(url);
  }
  addBank(data: FormData) {
    // console.log(data)
    let url = GLOBAL.API.productCenter.bankManagement.addBank;
    // let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data);
  }
  updateBank(data: FormData) {
    // console.log(data)
    let url = GLOBAL.API.productCenter.bankManagement.updateBank;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data,{
      headers: header
    });
  }
  deleteBank(data: Object) {
    // console.log(data)
    let url = GLOBAL.API.productCenter.bankManagement.deleteBank;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.delete(url + "/" + data["id"]);
  }
  moveUpInBank(data: Object){
    let url = GLOBAL.API.productCenter.bankManagement.moveUpInBank;
    return this.http.patch(url+"/"+data['id'],data);
  }
  moveDownInBank(data: Object){
    let url = GLOBAL.API.productCenter.bankManagement.moveDownInBank;
    return this.http.patch(url+"/"+data['id'],data);
  }
  //版本更新
  getVersion(paras: Object) {
    // console.log(paras)
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.productCenter.versionUpdate.getVersion;
    return this.http.get(url, {
      params: para
    });
  }
  deleteVersion(data: Object) {
    // console.log(data)
    let url = GLOBAL.API.productCenter.versionUpdate.deleteVersion;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.delete(url + "/" + data["id"]);
  }
  addVersion(data: FormData) {
    // console.log(data)
    let url = GLOBAL.API.productCenter.versionUpdate.addVersion;
    // let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data);
  }
  settleRule(){
    let url = GLOBAL.API.productCenter.product.settleRule;
    return this.http.get(url);
  }
  updateSettleRule( data : Object){
    let url = GLOBAL.API.productCenter.product.settleRule;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    console.log(data);
    return this.http.put(url,data,{
      headers : header
    });
  }
}





