import { Injectable } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn : "root"
})
export class channelDataService{
  constructor(
    private http : HttpClient
  ){};

  getData(paras? : Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.channelData;
    return this.http.get(url, {
      params : para
    });
  };
  getDataH5(paras? : Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.channelDataH5 ;
    return this.http.get(url, {
      params : para
    });
  };
  exChannelBranch(data : Object,type:Number){
    let url;
    if(type===1){
      let str='';
      if(data["startDate"]){
        str+="&startDate=" + data["startDate"]
      }
      if(data["endDate"]){
        str+="&endDate="+data['endDate']
      }
      if(data["serialNumber"]){
        str+="&serialNumber="+data['serialNumber']
      }
      if(data["invitationCode"]){
        str+="&invitationCode="+data['invitationCode']
      }
      if(data["channelBranchName"]){
        str+="&channelBranchName="+data['channelBranchName']
      }
      url = GLOBAL.API.reportCenter.channelExport+"?isPaging=false"+str;
    }
    else if(type===2){
      let str='';
      if(data["startDate"]){
        str+="&startDate=" + data["startDate"]
      }
      if(data["endDate"]){
        str+="&endDate="+data['endDate']
      }
      if(data["id"]){
        str+="&id="+data['id']
      }
      if(data["name"]){
        str+="&name="+data['name']
      }
      url = GLOBAL.API.reportCenter.channelH5Export+"?isPaging=false"+str;
    }
    window.location.href = url;
    return ;
  }
  //财务数据
  getFinanceCurrent(paras? : Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.financeCurrent ;
    return this.http.get(url, {
      params : para
    });
  };
  getFinanceHistory(paras? : Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.financeHistory ;
    return this.http.get(url, {
      params : para
    });
  };
  //平台数据
  getPlatformCurrent(paras? : Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.platformCurrent ;
    return this.http.get(url, {
      params : para
    });
  };
  getPlatformHistory(paras? : Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.platformHistory ;
    return this.http.get(url, {
      params : para
    });
  };
  getConvert(paras? : Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.convert ;
    return this.http.get(url, {
      params : para
    });
  };
  platformConversionDataTopList(paras :Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.platformConversionDataTopList;
    return this.http.get(url, {
      params : para
    });
  }
  platformConversionDataBottomList(paras :Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.platformConversionDataBottomList;
    return this.http.get(url, {
      params : para
    });
  }
  downloandBottomList(obj: Object){
    let url = GLOBAL.API.reportCenter.downloandBottomList;
    location.href=url+"?startTime="+obj["startTime"]+"&endTime="+obj["endTime"];
  }
  platformUsersBuriedTopList(paras :Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.platformUsersBuriedTopList;
    return this.http.get(url, {
      params : para
    });
  }
  platformUsersBuriedBottomList(paras :Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.platformUsersBuriedBottomList;
    return this.http.get(url, {
      params : para
    });
  }
}
