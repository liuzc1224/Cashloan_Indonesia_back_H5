export class SearchModel {
  firstLoan ="";
  startDay:any=null;
  endDay:any=null;

  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
