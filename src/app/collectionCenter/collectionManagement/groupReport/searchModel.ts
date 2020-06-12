export class SearchModel {
  queryStartTime:any = null;
  queryEndTime:any = null;
  stageId = "";
  firstLoan = "";
  loanProductType = "";
  firmId : number = null;
  groupId : number = null;
  staffId : number = null;

  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
