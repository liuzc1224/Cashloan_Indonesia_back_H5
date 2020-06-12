export class SearchModel {
  flowName:string='';
  status:string='';

  type:number=1;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
