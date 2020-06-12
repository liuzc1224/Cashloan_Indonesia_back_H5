export class SearchModel {
  id:any="";
  name:any="";
  pageSize : Number = 10 ;
  currentPage : Number = 1;
  rangeDate : any=null;
  startDate : any="";
  endDate : any="";
  packageName : any;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
