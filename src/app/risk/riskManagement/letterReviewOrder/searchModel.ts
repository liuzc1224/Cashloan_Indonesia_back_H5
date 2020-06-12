export class SearchModel {
  applyDateBegin : any= null;
  applyDateEnd : any= null;
  userGrade : string= null;
  loanProductType:string[] =["all"];
  creditOrderStatus:string[] =["all"];
  auditRejectStageId : string[] =null;
  rejectId : string[] =null;
  creditOrderNo : string= null;
  userPhone : string= null;

  currentAuditStaffName : string= null;

  loanDaysFlag :number =0;
  loanDays :number =null;
  channel : any="";
  promotionTypeStr : Number=null;
  referrerName : string=null;
  firstLoan : any = "";
  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;

  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
