export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;


    phoneNumber : string = null ;
    username : string = null ;
    userGrade : number =null;
    packageName : string =null;
    inviteCode:string=null;
    id : any=null;
    registerTimeStart : any = null ;
    registerTimeEnd : any = null ;
    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
    channelId:string=null;
    channel:any;
    promotionTypeStr:any;
    referrerName:any;
    areaCode:any;
}
