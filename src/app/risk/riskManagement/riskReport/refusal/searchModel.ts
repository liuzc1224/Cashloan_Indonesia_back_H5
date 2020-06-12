export class SearchModel {
  createTimeStart : any=null;
  createTimeEnd : any=null;
  firstLoan : any="";
  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
