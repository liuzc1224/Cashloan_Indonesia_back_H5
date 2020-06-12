import {Injectable, EventEmitter, OnInit} from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn : "root"
})
export class StaffService{

    constructor(
        private http : HttpClient 
    ){}

    getList(obj : Object){
        const url = GLOBAL.API.system.staff ;

        const para = ObjToQuery(obj) ;
        
        return this.http.get(url , {
            params : para
        })
    };

    update(data: object){
        const url = GLOBAL.API.system.staff ; 
        
        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ; 
        
            return this.http.put(url , data , {
                headers : header
            })
    }; 
    addNew(data: object){
        const url = GLOBAL.API.system.staff ; 
        
        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ; 
        
            return this.http.post(url , data , {
                headers : header
            })
    }; 
    deleteStaff(id:number){
        const url = GLOBAL.API.system.staff + "/" + id ; 
        return this.http.delete(url) ;
    };
    getStaffById(id:number){
        const url = GLOBAL.API.system.staff + "/" + id ; 
        return this.http.get(url) ; 
    };
};