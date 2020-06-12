export class SearchModel {
  id:String="";
  loanProductName:String="";

  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
