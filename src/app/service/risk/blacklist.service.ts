import { Injectable } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn : "root"
})
export class BlacklistService{
  constructor(
    private http : HttpClient
  ){};
  //获取黑名单
  getBlackList(paras : Object){

    let para = ObjToQuery(paras) ;

    let url = GLOBAL.API.risk.blackList.getBlackList ;
    return this.http.get(url , {
      params : para
    });
  };


  //删除
  deleteBlackList(id : number){
    const url = GLOBAL.API.risk.blackList.delete+ "/" + id ;
    return this.http.delete(url) ;
  };
  //导出
  exportBlackList(paras : Object){
    const para = ObjToQuery(paras);
    let url = GLOBAL.API.risk.blackList.export+"?"+para ;
    window.location.href = url;
    return;
  };
  //导入
  importBlackList(data : FormData){
    let url = GLOBAL.API.risk.blackList.import ;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  };
  //下载导入模板
  templateBlackList(){
    let url = GLOBAL.API.risk.blackList.template ;
    window.location.href = url;
  };
  //更新
  updateBlackList(data : Object){
    let url = GLOBAL.API.risk.blackList.update ;

    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;

    return this.http.put(url , data , {
      headers : header
    });
  };
};
