class lang{
    description : string ; 
    any ? : any ;
};
export class MenuData{ 
    url : string ;  
    iconPath : string ; 
    menuDescriptions : Array< lang > ;
    id : number ;
    children : Array< MenuData > ;
};