export class SearchModel {
  channelId:any='';
  invitationCode:String="";
  name:String="";
  contactUser:any="";
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
