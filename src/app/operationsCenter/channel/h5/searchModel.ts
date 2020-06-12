export class SearchModel {
  id:any="";
  name:any="";
  createTimeStart : any="";
  createTimeEnd : any="";
  packageName : any;
  companyName : any;

  pageSize : Number = 10 ;
  currentPage : Number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
