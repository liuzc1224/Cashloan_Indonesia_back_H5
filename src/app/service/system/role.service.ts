import {Injectable, EventEmitter, OnInit} from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn:'root'
})
export class RoleService{

    constructor(
        private http : HttpClient 
    ){}

    getList(obj : Object){
        const url = GLOBAL.API.system.role ;

        const para = ObjToQuery(obj) ;
        
        return this.http.get(url , {
            params : para
        })
    };

    getRoleById(id:number){
        const url = GLOBAL.API.system.role + "/" + id ; 
        return this.http.get(url) ; 
    };

    addNewRole(data: object){
        const url = GLOBAL.API.system.role ; 
        
        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ; 
        
            return this.http.post(url , data , {
                headers : header
            })
    }; 

    deleteRole(id:number){
        const url = GLOBAL.API.system.role + "/" + id ; 
        return this.http.delete(url) ;
    }

    update(data: object){
        const url = GLOBAL.API.system.role ; 
        
        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ; 
        
            return this.http.put(url , data , {
                headers : header
            })
    }; 
};