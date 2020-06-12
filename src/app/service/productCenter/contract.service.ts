import { Injectable } from '@angular/core' ;
import {HttpClient, HttpHeaders} from '@angular/common/http' ;
import { ObjToQuery } from '../ObjToQuery';
import { ObjToQueryString } from '../ObjToQueryString' ;
import { GLOBAL } from '../../global/global_settion';

@Injectable({
  providedIn : "root"
})
export class ContractService{
  constructor(
    private http : HttpClient
  ){} ;

  getContract(obj : Object){
    let url = GLOBAL.API.productCenter.contract.getContract ;
    let para = ObjToQuery(obj) ;
    return this.http.get(url , {
      params : para
    });
  }
  updateContract( data : Object){
    let url = GLOBAL.API.productCenter.contract.updateContract;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    return this.http.put(url,data,{
      headers : header
    });
  }
  addContract(data : Object){
    let url = GLOBAL.API.productCenter.contract.addContract;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    return this.http.post(url , data , {
      headers : header
    });
  }
  deleteContract(data : Object){
    let url = GLOBAL.API.productCenter.contract.deleteContract;
    console.log(data);
    return this.http.get(url+"/"+data["id"]);
  }
  getAllContractProtocolList(){
    let url = GLOBAL.API.productCenter.contract.getAllContractProtocolList;
    return this.http.get(url);
  }
}
