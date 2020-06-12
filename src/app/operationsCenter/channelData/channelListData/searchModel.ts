export class SearchModel {
  name:String="";
  serialNumber:String="";
  pageSize : Number = 10 ;
  currentPage : Number = 1;
  rangeDate : any=null;
  startDate : any="";
  endDate : any="";
  invitationCode : any="";
  channelBranchName : any="";
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}