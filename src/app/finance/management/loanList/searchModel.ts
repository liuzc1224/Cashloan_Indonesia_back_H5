export class SearchModel {
  createTimeStart:any=null;
  createTimeEnd:any=null;

  auditTimeStart:any=null;
  auditTimeEnd:any=null;
  productType:any="";
  status:any="";
  orderNo:string=null;
  phoneNumber:string=null;
  userName:string=null;



  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;



  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
