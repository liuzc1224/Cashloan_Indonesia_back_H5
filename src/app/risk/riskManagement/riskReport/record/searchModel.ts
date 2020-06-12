export class SearchModel {
  stageId="";
  firmId="";
  groupId:Number=null;
  riskEmployeeName:String=null;
  riskEmployeeAccount:String=null;
  signInBeginDate : any=null;
  signInEndDate : any=null;

  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
