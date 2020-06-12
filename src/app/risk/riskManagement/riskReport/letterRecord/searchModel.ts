export class SearchModel {
  stageIdList:string[] =["all"];
  reject:string[] =["all"];
  operationStatus:any="";


  timeStart : any=null;
  timeEnd : any=null;
  creditOrderNo : string="";

  pageSize : Number = 10 ;
  currentPage : Number = 1;

  columns : Array< String > = ['create_time'] ;
  orderBy : Array< Boolean > = [false] ;
}

