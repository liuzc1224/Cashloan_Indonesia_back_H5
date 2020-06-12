export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;

    orderNo:any=null;
    disburseId:string=null;
    accountName:string=null;
    senderName:string=null;
    bankAccount:string=null;

    createTimeStart : any = null ;
    createTimeEnd : any = null ;

    platformId : any ="";
    paymentStatus : any ="";

    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
}
