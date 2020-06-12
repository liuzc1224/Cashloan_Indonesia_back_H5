export class SearchModel {
  businessId:Number=null;
  activate:Number=null;
  status:Number=null;
  auditStartDate : any=null;
  auditEndDate : any=null;
  rangeDate : any=[new Date(new Date().getTime()-604800000),new Date()];
  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
