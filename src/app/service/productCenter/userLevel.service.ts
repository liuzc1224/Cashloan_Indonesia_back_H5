import { Injectable } from '@angular/core' ;
import {HttpClient, HttpHeaders} from '@angular/common/http' ;
import { ObjToQuery } from '../ObjToQuery';
import { ObjToQueryString } from '../ObjToQueryString' ;
import { GLOBAL } from '../../global/global_settion';

@Injectable({
  providedIn : "root"
})
export class UserLevelService{
  constructor(
    private http : HttpClient
  ){} ;

  getUserLevel(obj : Object){
    let url = GLOBAL.API.productCenter.userLevel.getUserLevel ;
    let para = ObjToQuery(obj) ;
    return this.http.get(url , {
      params : para
    });
  }
  updateUserLevel( data : Object){
    let url = GLOBAL.API.productCenter.userLevel.updateUserLevel;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    return this.http.put(url,data,{
      headers : header
    });
  }
  realtimeUpdate(){
    let url = GLOBAL.API.productCenter.userLevel.realtimeUpdate;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    return this.http.put(url,{
      headers : header
    });
  }
  addUserLevel(data : Object){
    let url = GLOBAL.API.productCenter.userLevel.addUserLevel;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    return this.http.post(url , data , {
      headers : header
    });
  }
  deleteUserLevel(data : Object){
    let url = GLOBAL.API.productCenter.userLevel.deleteUserLevel;
    return this.http.get(url+"/"+data["id"]);
  }
  getLoanProduct(){
    let url = GLOBAL.API.productCenter.userLevel.getLoanProduct;
    return this.http.get(url);
  }
}
