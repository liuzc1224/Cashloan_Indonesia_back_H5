export class SearchModel {
  flowName:string=null;
  status:string="";

  type:number=0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
