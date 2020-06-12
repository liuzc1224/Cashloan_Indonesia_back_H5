export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;
    status : string ="";
    applyDateBegin : any ;
    applyDateEnd : any ;
    approveEffectDayBegin : any ;
    approveEffectDayEnd : any ;
    userPhone : any ;
    creditOrderNo : any ;
    userGrade : any ;
    columns : Array< String > = ['status'] ;
    orderBy : Array< Boolean > = [true] ;
};