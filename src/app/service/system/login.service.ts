import {Injectable, EventEmitter, OnInit} from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn : "root"
})
export class LoginService{

    constructor(
        private http : HttpClient
    ){};

    login( userInfo : Object ){
        const url = GLOBAL.API.system.login ;

        const userName = userInfo['username'] ; 
        const password = userInfo['password'] ; 

        const postData = new HttpParams()
            .set("username" , userName)
            .set("password" , password) ;
        
        return this.http.post(url , postData );
    };
};