export class SearchModel {
  businessId:Number=null;
  activate:Number=null;
  status:Number=null;
  startDate : any=null;
  endDate : any=null;
  rangeDate : any=null;

  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
