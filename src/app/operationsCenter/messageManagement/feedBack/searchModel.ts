export class SearchModel {
  startDate:any="";
  endDate:any="";
  solve:any="";
  phoneNumber: any="";
  rangeDate : any=null;

  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
