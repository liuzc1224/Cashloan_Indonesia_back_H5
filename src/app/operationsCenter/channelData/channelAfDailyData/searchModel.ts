export class SearchModel {
  id:any="";
  name:any="";
  pageSize : Number = 10 ;
  currentPage : Number = 1;
  rangeDate : any=null;
  createTimeStart : any="";
  createTimeEnd : any="";
  packageName : any;
  ad : any="";
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
