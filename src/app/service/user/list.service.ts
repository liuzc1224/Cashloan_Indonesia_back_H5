import {Injectable, EventEmitter, OnInit} from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn : "root"
})
export class UserListService{

    constructor(
        private http : HttpClient
    ){};

    getList( obj : Object ){
        let url = GLOBAL.API.usr.list ; 
            
        let para = ObjToQuery(obj) ; 

        return this.http.get(url , {
            params : para
        });
    };

    getLoginInfo(usrId :number){
        const url = GLOBAL.API.usr.login.info  + "/" + usrId ; 

        return this.http.get(url) ;
    }
    getUserInfo(usrId :number){
        const url = GLOBAL.API.usr.basicInfo  + "/" + usrId ; 

        return this.http.get(url) ;
    }
    getBankInfo(usrId :number){
        const url = GLOBAL.API.usr.bankIcfo  + "/" + usrId ; 

        return this.http.get(url) ;
    }
};