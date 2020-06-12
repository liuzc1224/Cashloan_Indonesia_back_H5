export class SearchModel {
  pushTimeStart:any="";
  pushTimeEnd:any="";
  subject:string="";
  pushStatus:number=null;
  rangeDate : any=null;
  noticeStatus : any="";
  isNotice:boolean=true;

  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
