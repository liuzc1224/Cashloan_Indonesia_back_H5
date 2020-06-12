import { RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class SimpleReuseStrategy implements RouteReuseStrategy {

    public static handlers: { [key: string]: DetachedRouteHandle } = {} ;

    private static waitDelete : string ;

    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        let shouldReuse = route.data.reuse ? true : false ;
        return shouldReuse;
    };

    public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        // if(SimpleReuseStrategy.waitDelete && SimpleReuseStrategy.waitDelete==this.getRouteUrl(route)){
        //     SimpleReuseStrategy.waitDelete=null
        //     return;
        // } ; 
        const name = route.data['title'] ; 

        console.log(name) ;
        SimpleReuseStrategy.handlers[name] = handle ;
    };

    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const name = route.data['title'] ;  
        return !!SimpleReuseStrategy.handlers[name] ; 
    };

    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {

        if (!route.routeConfig) {
            return null
        };
        const name = route.data['title'] ;

        return SimpleReuseStrategy.handlers[name] ;
    };

    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {        
        return future.routeConfig===curr.routeConfig && 
            JSON.stringify(future.params)==JSON.stringify(curr.params);
    };

    public static deleteRouteSnapshot(name:string):void{

        console.log(name) ; 
        console.log(SimpleReuseStrategy.handlers) ;
        if(SimpleReuseStrategy.handlers[name]){
            delete SimpleReuseStrategy.handlers[name];
        }else{
            SimpleReuseStrategy.waitDelete = name;
        };
    };
};
