import { Injectable } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn : "root"
})
export class RiskReportService {
  constructor(
    private http: HttpClient
  ) {
  };
  //信审记录明细
  creditAuditRecordDetail(paras: Object) {

    let para = ObjToQuery(paras);

    let url = GLOBAL.API.risk.riskReport.creditAuditRecordDetail;
    return this.http.get(url, {
      params: para
    });
  };
  //导出 信审记录明细
  creditAuditRecordDetailExport(paras : Object){
    const para = ObjToQuery(paras);
    let url = GLOBAL.API.risk.riskReport.creditAuditRecordDetailExport+"?"+para ;
    window.location.href = url;
    return;

  };
  //查询机审拒绝理由统计数据
  machineRejectStatistics(paras: Object) {

    let para = ObjToQuery(paras);

    let url = GLOBAL.API.risk.riskReport.machineRejectStatistics;
    return this.http.get(url, {
      params: para
    });
  };
  //导出机审拒绝理由统计数据
  machineRejectStatisticsExport(paras : Object){
    const para = ObjToQuery(paras);
    let url = GLOBAL.API.risk.riskReport.machineRejectStatisticsExport+"?"+para ;
    window.location.href = url;
    return;

  };
  //查询人审拒绝理由统计数据
  manpowerRejectStatistics(paras: Object) {

    let para = ObjToQuery(paras);

    let url = GLOBAL.API.risk.riskReport.manpowerRejectStatistics;
    return this.http.get(url, {
      params: para
    });
  };
  //导出人审拒绝理由统计数据
  manpowerRejectStatisticsExport(paras : Object){
    const para = ObjToQuery(paras);
    let url = GLOBAL.API.risk.riskReport.manpowerRejectStatisticsExport+"?"+para ;
    window.location.href = url;
    return;

  };
  //审核拒绝理由
  listAuditRejectDesc(){
    let url = GLOBAL.API.risk.riskReport.listAuditRejectDesc;
    return this.http.get(url);
  }
}
