export class SearchModel {
  businessId:Number=null;
  activate:Number=null;
  status:Number=null;
  timeStart : any=null;
  timeEnd : any=null;
  rangeDate : any=null;

  channel : any="";
  promotionTypeStr : Number=null;
  referrerName : string=null;


  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
