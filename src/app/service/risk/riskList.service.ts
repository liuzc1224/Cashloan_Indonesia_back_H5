import { Injectable } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn : "root"
})
export class RiskListService{
  constructor(
      private http : HttpClient
  ){};
  //获取借款订单风控列表
  getList(paras : Object){

      let para = ObjToQuery(paras) ;

      let url = GLOBAL.API.risk.riskList ;
      return this.http.get(url , {
          params : para
      });
  };


  //获取信审订单风控列表
  getRecordList(paras : Object){

      let para = ObjToQuery(paras) ;

      let url = GLOBAL.API.risk.riskRecordList ;
      return this.http.get(url , {
          params : para
      });
  };

  getCreditOrderRecord(orderId : number){
      let url = GLOBAL.API.risk.record + `/${orderId}`;
      return this.http.get(url);
  };

  getRiskEmployees(){
      let url = GLOBAL.API.risk.employees;
      return this.http.get(url);
  };

  setAllocation(data : Object) {
      let url = GLOBAL.API.risk.setEmployees ;

      let header = new HttpHeaders()
          .set("Content-type" , 'application/json') ;

      return this.http.put(url , data , {
          headers : header
      });
  }

  getTotleList(paras : Object){

      let para = ObjToQuery(paras) ;

      let url = GLOBAL.API.risk.riskTotleList ;
      return this.http.get(url , {
          params : para
      });
  };

  getTotle(paras : Object){

      let para = ObjToQuery(paras) ;

      let url = GLOBAL.API.risk.riskTotle ;
      return this.http.get(url , {
          params : para
      });
  };

  getShureList(paras : Object){

      let para = ObjToQuery(paras) ;

      let url = GLOBAL.API.risk.riskShureList ;
      return this.http.get(url , {
          params : para
      });
  };

  postLoan(data : Object){
      let url = GLOBAL.API.finance.loanList;

      let header = new HttpHeaders()
          .set("Content-type" , 'application/json') ;

      return this.http.post(url , data , {
          headers : header
      });
  };

  makeLoan(data : Object){
      let url = GLOBAL.API.finance.loan.loan ;

      let header = new HttpHeaders()
          .set("Contype-type" , "application/json") ;

      return this.http.patch(url , data , {
          headers : header
      });
  };
  //签到
  riskSignIn(){
      let url = GLOBAL.API.risk.riskSignIn ;
      let header = new HttpHeaders()
          .set("Contype-type" , "application/json") ;
      return this.http.post(url , null, {
          headers : header
      });
  };
  //迁出
  riskSignOut(){
      let url = GLOBAL.API.risk.riskSignOut ;
      let header = new HttpHeaders()
          .set("Contype-type" , "application/json") ;
      return this.http.patch(url , null, {
          headers : header
      });
  };
  //审核签退
  riskSignOutAudit(data : Object){

      let header = new HttpHeaders()
          .set("Contype-type" , "application/json") ;
      let url = GLOBAL.API.risk.riskSignOutAudit;
      return this.http.patch(url , data , {
          headers : header
      });
  };

  //是否签到
  riskIsSignIn(){
      let url = GLOBAL.API.risk.isSignIn ;
      return this.http.get(url);
  };

  //锁订单
  lockOrder( orderId : number){
      let url = GLOBAL.API.risk.lockOrder + "/" + orderId ;
      let header = new HttpHeaders()
          .set("Contype-type" , "application/json") ;
      return this.http.post(url , null, {
          headers : header
      });
  };
  //根据id查询信审人员信息
  getCurrentCreditAuditStaff(){
    let url = GLOBAL.API.risk.getCurrentCreditAuditStaff ;
    return this.http.get(url);
  }

  orderLock( orderId : number){
    let url = GLOBAL.API.risk.riskWorkbench.orderLock + "/" + orderId ;
    let header = new HttpHeaders()
      .set("Contype-type" , "application/json") ;
    return this.http.post(url , null, {
      headers : header
    });
  }
  exportOverdueOrder(data: Object){
    let para = ObjToQueryString(data) ;
    let url = GLOBAL.API.risk.management.exportOverdueOrder ;
    location.href=url+"?"+(para.length>0 ? para.substring(0,para.length-1) : "");

  }
  //导出订单
  exportRisk(paras: Object){
      let para = ObjToQuery(paras) ;

      let url = GLOBAL.API.risk.exportList ;
      return this.http.get(url , {
          params : para,
          responseType : 'blob'
      });
  }
  //获取开关
  getSetList(data){

    let url = GLOBAL.API.risk.riskConfig ;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  };
  //设置开关
  postFaceStatus(data : Object){

      let header = new HttpHeaders()
          .set("Content-type" , 'application/json') ;

      let url = GLOBAL.API.risk.compare ;

      return this.http.put(url , data , {
          headers : header
      });
  };
  //信审报表
  getRiskTotalList(paras : Object){
      let para = ObjToQuery(paras) ;

      let url = GLOBAL.API.risk.riskTotalList ;
      return this.http.get(url , {
          params : para
      });
  };

  //信审操作台列表
  getAuditList(paras : Object){
      let para = ObjToQuery(paras) ;

      let url = GLOBAL.API.risk.auditList ;
      return this.http.get(url , {
          params : para
      });
  }

  //签到
  goSignin(){
      let url = GLOBAL.API.risk.goSignin ;
      let header = new HttpHeaders()
          .set("Contype-type" , "application/json") ;
      return this.http.post(url,null, {
          headers : header
      });
  }
  goSignOut(){
      let url = GLOBAL.API.risk.goSignOut ;
      return this.http.delete(url);
  }
  getAttendanceList(paras : Object){
      let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.attendanceList ;
        return this.http.get(url , {
            params : para
        });
    }
    getCount(){
        let url = GLOBAL.API.risk.getCount;
        return this.http.get(url);
    }
    //查询信审人员签到状态
    querySiginStatus(){
        let url = GLOBAL.API.risk.querySiginStatus;
        return this.http.get(url);
    }

    //查询“第三方接口调用”
    getThirdParty(paras : Object){
        // console.log(paras);
        let para = ObjToQuery(paras) ;
        let url = GLOBAL.API.risk.getThirdParty ;
        return this.http.get(url , {
            params : para
        });
    }
    //"第三方接口调用"点击“导出”
    getExportList(paras : Object){
        // console.log(paras)
        // let para = ObjToQuery(paras) ;
        let url = GLOBAL.API.risk.getExportList ;
        // console.log(para)
         location.href=url+"?startDate="+paras["startDate"]+"&endDate="+paras["endDate"];
        // return this.http.get(url , {
        //     params : para
        // });
    }
    //查询“信审阶段数据”
    getStageList(paras : Object){
        // console.log(paras);
        let para = ObjToQuery(paras) ;
        let url = GLOBAL.API.risk.getStageList ;
        return this.http.get(url , {
            params : para
        });
    }
    //“信审阶段数据”点击“导出”
    downloadStageList(paras :Object){
        let url = GLOBAL.API.risk.downloadStageList;
        // console.log(url+"?timeStart="+paras["timeStart"]+"&timeEnd="+paras["timeEnd"])
        location.href=url+"?timeStart="+paras["timeStart"]+"&timeEnd="+paras["timeEnd"];
    }
    //“信审订单转化报表”初始化请求“顶部数据”
    onLoadGetConversionTop(){
        let url = GLOBAL.API.risk.onLoadGetConversionTop ;
        return this.http.get(url);
    }
    //查询"信审订单转化报表"底部表格信息
    getConversionListBottom(paras : Object){
        let para = ObjToQuery(paras) ;
        let url = GLOBAL.API.risk.getConversionListBottom ;
        return this.http.get(url , {
            params : para
        });
    }
    //“信审订单转化报表”点击“导出”
    downloadConversionListBottom(paras :Object){
        let url = GLOBAL.API.risk.downloadConversionListBottom;
        // console.log(paras)
        location.href=url+"?auditStartDate="+paras["auditStartDate"]+"&auditEndDate="+paras["auditEndDate"];
    }
  //考勤绩效
  getPerformance(paras : Object){
    let url = GLOBAL.API.risk.riskReport.performance;
    let para = ObjToQuery(paras) ;
    return this.http.get(url , {
      params : para
    });
  }
  exportPerformance(paras :Object){

    let para = ObjToQueryString(paras);
    let url = GLOBAL.API.risk.riskReport.exportPerformance+"?"+para;
    url = url.substring(0,url.length-1);
    window.location.href = url;
  }
  //考勤记录
  getRecord(paras : Object){
    let url = GLOBAL.API.risk.riskReport.record;
    let para = ObjToQuery(paras) ;
    return this.http.get(url , {
      params : para
    });
  }
  exportRecord(paras :Object){
    let para = ObjToQueryString(paras);
    let url = GLOBAL.API.risk.riskReport.exportRecord+"?"+para;
    url = url.substring(0,url.length-1);
    window.location.href = url;
  }


  getData(data:Object){
    let url = GLOBAL.API.risk.management.getData;//信审订单订单汇总页，查询所有订单，查询接口;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  //信审订单可分配人员
  getCreditOrderAllocationStaffList(data:Object){
    let url = GLOBAL.API.risk.management.getCreditOrderAllocationStaffList;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  //分配
  allocation(data:Object){
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;

    let url = GLOBAL.API.risk.management.allocation ;

    return this.http.put(url , data , {
      headers : header
    });
  }
  //信审订单-流转记录
  getCreditOrderFlowHistory(data : Object){
    let url = GLOBAL.API.risk.management.getCreditOrderFlowHistory+"/"+data['creditOrderId'];
    return this.http.get(url);
  }
  //信审记录
  getLetterRecord(data : Object){
    let url = GLOBAL.API.risk.management.detail;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  //审核阶段
  listAuditStage(){
    let url = GLOBAL.API.risk.management.listAuditStage;
    return this.http.get(url);
  }
  //组内已审核列表
  getGroupAuditList(data : Object){
    let url = GLOBAL.API.risk.riskWorkbench.getGroupAuditList;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  //考勤
  attendance(data : Object){
    let url = GLOBAL.API.risk.riskWorkbench.attendance;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  //查询审核拒绝理由
  listAuditRejectDesc(){
    let url = GLOBAL.API.risk.riskWorkbench.listAuditRejectDesc;
    return this.http.get(url);
  }
  //确定批量关闭/拒绝/回退阶段
  batchCloseOrRejectOrRollbackStage(data:Object){
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;

    let url = GLOBAL.API.risk.management.batchCloseOrRejectOrRollbackStage ;

    return this.http.put(url , data , {
      headers : header
    });
  }
};
