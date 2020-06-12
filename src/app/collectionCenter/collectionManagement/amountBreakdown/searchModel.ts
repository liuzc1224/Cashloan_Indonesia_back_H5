export class SearchModel {
  recallDateStart:any=null;
  recallDateEnd:any=null;
  currentPeriodRepayDateStart:any=null;
  currentPeriodRepayDateEnd:any=null;
  stageId : number =null;
  overdueDayStart : number =null;
  overdueDayEnd : number =null;
  orderNo : string =null;
  phoneNumber : string =null;
  dealStatus="";
  loanProductType : any = "";
  firmId : number =null;
  groupId : number =null;
  staffName : number =null;

  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
