export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;

    ktp : string ="";
    creditStatus : any="" ;
    phoneNumber : string="" ;
    createTimeStart : any=null ;
    createTimeEnd : any=null ;

    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
};
