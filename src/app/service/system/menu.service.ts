import {Injectable, EventEmitter, OnInit} from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn : "root"
})
export class MenuService{

    constructor(
        private http : HttpClient 
    ){}

    getLoginMenu( usrId : Number ){
        const url = GLOBAL.API.system.loginMenu + "/" + usrId  ;
        return this.http.get(url) ;
    };

    getAllmenu(){
        const url = GLOBAL.API.system.loginMenu ; 

        return this.http.get(url) ;
    }
    addNew(data : object){
        const url = GLOBAL.API.system.menu ;

        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;

        return this.http.post(url , data , {
            headers : header
        });
    }
    delMenu(id :number){
        const url = GLOBAL.API.system.menu +"/" + id ;
        return this.http.delete(url);
    }

    editMenu(data : object){
        const url = GLOBAL.API.system.menu ;

        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;

        return this.http.put(url , data , {
            headers : header
        });
    }
    getButton(data : object){
        const url = GLOBAL.API.system.button ;

        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;

        return this.http.post(url , data , {
            headers : header
        });
    }
};