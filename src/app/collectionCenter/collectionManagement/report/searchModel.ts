export class SearchModel {
  orderType ="";
  loanTermsJudgeFlag : number =null;
  loanTerms : number =null;
  loanAmountJudgeFlag : number =null;
  loanAmount : number =null;
  userGrade : string =null;

  queryStartTime:any=null;
  queryEndTime:any=null;
  groupId : number =null;
  staffId : number =null;

  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
