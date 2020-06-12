export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;


    status : string = '1,2,9,12';

    startDate : any ;
    endDate : any ;
    serialNumber : any ;
    channelBranchName:String="";
    invitationCode : any ;
    id:any="";
    name:any="";

    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
};
