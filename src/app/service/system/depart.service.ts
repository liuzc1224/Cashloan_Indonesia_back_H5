import {Injectable, EventEmitter, OnInit} from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn:"root"
})
export class DepartService{

    constructor(
        private http : HttpClient 
    ){}
    get(){
        const url = GLOBAL.API.system.depart.list ;
        return this.http.get(url);
    };

    post(departObj : object){
        const url = GLOBAL.API.system.depart.opera ; 

        let postData = departObj ; 
        
        return this.http.post(url , postData);
    };

    put(departObj : object){
        const url = GLOBAL.API.system.depart.opera ; 

        const postData = departObj ; 

        const header = new HttpHeaders()
            .set("Content-type" , "application/json");
        
        return this.http.put(url , postData , {
            headers : header
        });
    };

    delete(departId : number){
        const url = GLOBAL.API.system.depart.opera+ "/" + departId ; 

        return this.http.delete(url) ;
    }
};