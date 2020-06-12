export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;

    userId :any =null;
    loanDaysFlag :number =0;
    loanDays :number =null;

    creditOrderNo : string = null ;
    orderNo : string = null ;
    phoneNumber : any = null;
    userName : string = null ;
    userGrade : string[] =["all"];
    packageName : string[] =["all"];
    orderType : string[] =["all"];
    firstLoan : any = "";
    channel:any="";
    referrerName:any="";
    promotionType:string[] =[];
    rangeDate : any=null;
    payDate : any=null;
    createTimeStart : any = null ;
    createTimeEnd : any = null ;
    payDateStart : any = null ;
    payDateEnd : any = null ;

    orderStatusList :Array<any> = [];
    status : Array<any> = [];
    
    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
}
