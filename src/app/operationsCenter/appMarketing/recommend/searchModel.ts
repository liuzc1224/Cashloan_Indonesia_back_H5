export class SearchModel {
  type : string =null;
  id :String="";
  name : string ="";
  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
