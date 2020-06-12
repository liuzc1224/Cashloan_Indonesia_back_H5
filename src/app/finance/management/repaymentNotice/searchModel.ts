export class SearchModel {
  startDate : any = null ;
  endDate : any = null ;

  status : any ="";

  orderNo : any =null;
  tel : any =null;
  username : any =null

    pageSize : number = 10 ;
    currentPage : number = 1;
    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
  }
  