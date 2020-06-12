export class SearchModel {
  startTime: any= null;
  endTime: any = null;
  callNumber: string=null;
  callTo: string=null;
  callFrom: string=null;
  receiver: string=null;

  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
