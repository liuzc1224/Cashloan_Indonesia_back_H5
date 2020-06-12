export class SearchModel {
  startDate:any="";
  endDate:any="";
  title:string="";
  status : string;

  bankName:any="";
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
