export class SearchModel {
  orderId : any =null;
  type : any = "";
  status : any = "";

  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
