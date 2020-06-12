export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;

    orderNo:any=null;
    serialNumber:string=null;
    account:string=null;
    userName:string=null;
    card:string=null;

    startTime : any = null ;
    endTime : any = null ;
    payMinDate : any = null;
    payMaxDate : any =null;

    paymentResult : any ="";
    paymentChannel : any ="";

    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
}
