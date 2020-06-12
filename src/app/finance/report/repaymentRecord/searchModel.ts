export class SearchModel {
  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;

  createTimeStart : any = null ;
  createTimeEnd : any = null ;
  dealTimeStart : any = null ;
  dealTimeEnd : any = null ;

  status : any ="";
  paymentMethod : any ="";

  orderNo : any =null;
  merchantOrderId : any =null;
  account : any =null;
  vaNumber : any =null;

  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
