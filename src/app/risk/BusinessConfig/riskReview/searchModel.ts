export class SearchModel {
  type:string="";
  paramName:string=null;
  status:string="";


  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
