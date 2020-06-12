export class SearchModel {
  planRepaymentDateStart : any='';
  planRepaymentDateEnd : any='';
  dueDays : number=null;
  stageId : number=null;
  staffId : number=null;
  remindDateStart : any='';
  remindDateEnd : any='';
  orderType ="";
  userGrade : string =null;
  orderNo : string=null;
  phonenum : number=null;
  username : string=null;

  isAscend : any ;
  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;

  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
