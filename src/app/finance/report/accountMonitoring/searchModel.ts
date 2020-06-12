export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;


    platformName : string = null;

    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
}
