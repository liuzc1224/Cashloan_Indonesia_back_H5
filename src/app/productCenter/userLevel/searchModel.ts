export class SearchModel {
  id:String="";
  userLevelName:String="";
  productId : number=null;

  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
