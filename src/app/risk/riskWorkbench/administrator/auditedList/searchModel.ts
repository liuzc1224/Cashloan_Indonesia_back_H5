export class SearchModel {
  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;


  loanProductType = "" ;
  operationResult = "" ;
  stageId ="" ;
  auditRes : number = null ;
  creditOrderNo : string = null ;
  userPhone : string = null ;
  channel : any="";
  promotionTypeStr : Number=null;
  referrerName : string=null;

  createTimeStart : any = null ;
  createTimeEnd : any = null ;
  historyAuditTimeStart : any = null ;
  historyAuditTimeEnd : any = null ;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
