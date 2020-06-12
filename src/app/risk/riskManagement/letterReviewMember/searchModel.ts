export class SearchModel {
  groupId: number=null;
  id: number=null;
  staffName: string=null;
  phonenumber: string=null;


  firmName: string=null;
  firmType="";
  status="";

  firmId="";
  stageId="";
  groupType: number=null;
  groupName: string="";

  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
