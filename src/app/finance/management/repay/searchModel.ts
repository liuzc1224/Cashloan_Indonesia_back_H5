export class SearchModel {
  productType:number=null;
  createTimeStart:any=null;
  createTimeEnd:any=null;
  planRepaymentTimeStart:any=null;
  planRepaymentTimeEnd:any=null;
  paymentStatus:number=null;
  endStatus:number=null;
  orderNo : string = null;
  phoneNumber : string =null ;
  userName : string =null ;
  id:number=null;
  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
