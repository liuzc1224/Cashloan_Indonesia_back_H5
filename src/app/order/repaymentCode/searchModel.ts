export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;

    orderId : any =null;
    type : any = "";
    status : any = "";
    
    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
}
