export class SearchModel {
  signInBeginDate : any = null ;
  signInEndDate : any = null ;
  firmId = "";
  groupId : number =null;
  stageId ="";
  riskEmployeeName:string=null;
  riskEmployeeAccount:string=null;

  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
