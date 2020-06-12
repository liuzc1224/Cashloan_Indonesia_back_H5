export class SearchModel {
  businessId="";
  activate="";
  status="";


  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
