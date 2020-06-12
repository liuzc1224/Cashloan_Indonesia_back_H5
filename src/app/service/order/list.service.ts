import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery';
import { ObjToQueryString } from '../ObjToQueryString';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})
export class OrderListService {

    constructor(
        private http: HttpClient
    ) {};

    getList( data : Object ){
        // console.log(data)
        const url = GLOBAL.API.order.list.all ; 
        
        const para = ObjToQuery(data) ; 

        return this.http.get(url , {
            params : para
        });
    };
    getPageNameList() {
        let url = GLOBAL.API.order.list.getPageNameList;
        let header = new HttpHeaders().set("Content-type", "application/json");
        return this.http.get(url, {
          headers: header
        });
    };
    getUserLevel(obj : Object){
        let url = GLOBAL.API.productCenter.userLevel.getUserLevel ;
        let para = ObjToQuery(obj) ;
        return this.http.get(url , {
          params : para
        });
    }
    downloadPageNameList(obj: Object){

      let para = ObjToQueryString(obj);
      let url = GLOBAL.API.order.list.downloadPageNameList+"?"+para;
      url = url.slice(0,-1);
      window.location.href = url;
    };

};
