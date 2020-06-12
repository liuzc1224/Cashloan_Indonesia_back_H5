export class SearchModel {
  startDate:any="";
  endDate:any="";
  status:boolean=null;
  userAccount: any="";
  username: any="";
  orderNo: any="";


  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
