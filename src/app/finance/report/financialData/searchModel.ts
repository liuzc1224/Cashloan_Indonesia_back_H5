export class SearchModel {
  start: any=new Date();
  end: any=new Date();

  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
};
