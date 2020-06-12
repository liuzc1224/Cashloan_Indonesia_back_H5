export class SearchModel {
  title:string=null;
  status:string=null;
  id:string=null;



  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
