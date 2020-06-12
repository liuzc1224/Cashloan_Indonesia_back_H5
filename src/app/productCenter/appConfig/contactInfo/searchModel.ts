export class SearchModel {
  startDate:any="";
  endDate:any="";
  title:string="";
  id:any="";
  contactWay:string="";
  status:string="";

  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
