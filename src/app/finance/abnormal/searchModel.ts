export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;


    status : string = '1,3,4,5,6' ;
    loanType : Number=null;

    creditOrderNo : string = null;
    orderNo : string = null;
    userPhone : string =null ;
    userName : string =null ;


    minPlanRepaymentDate : any = null ;
    maxPlanRepaymentDate : any = null ;

    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
}
