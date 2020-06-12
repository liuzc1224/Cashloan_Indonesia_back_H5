import { Component } from '@angular/core'
import { Router, NavigationEnd , ActivatedRoute} from '@angular/router';
import { filter , map , mergeMap } from 'rxjs/operators' ;
import { SessionStorageService } from '../../service/storage';
import { SimpleReuseStrategy } from '../../routes/router-strategy' ;
@Component({
    selector: "tag-nav" , 
    template :`
        <div class='tag-header c-flex-row-start'>
            <div class='currentName c-flex-row-start'>
                <i class="anticon anticon-tags-o"></i>
                <span>
                    {{ parentTitle }}
                </span>
            </div>
            <div class='tag-list'>
                <ul class='c-list-unstyled tag-ul'>
                    <li 
                        class='c-flex-row-start' 
                        *ngFor = 'let item of routerArray'
                        [ngClass] = '{"tag-item-active" : item.isSelect}'
                    >
                        <span class = 'hoverText' (click) = 'urlTrans(item)'>
                            {{ item.title }}
                        </span>
                        <i class="anticon anticon-close icoClose hoverText" (click) = 'closeUrl(item.url , item.isSelect , item)'></i>
                    </li>
                </ul>
            </div>
        </div>
    ` , 
    styles: [`
        .tag-header{
            width: 100%;
            height: 55px;
            box-sizing: border-box;
            overflow: hidden;
            padding: 0 0 0 42px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }

        .currentName{
            padding: 0 15px 0 10px;
            color: #7690ab!important;
            border-right: 1px dashed #ccc;
            height: 100%;
            font-size: 18px;
            font-weight: bolder;
        }
        .currentName>i{
            margin-right: 5px;
            margin-top: 3px;
        }
        .tag-item-active::before {
            content: "";
            display: block;
            position: absolute;
            width: 76%;
            height: 3px;
            background: #1890ff;
            bottom: 0px;
        }
        .tag-list{
            overflow : hidden ;
            height: 55px;
        }

        .tag-ul{
            width: 100%;
            height: 100%;
            padding: 0px;
            margin: 0px;
        }

        .tag-ul > li{
            height: 100%;
            float: left;
            padding: 0 10px;
            color: #9ea7b3!important;
            cursor : pointer ;
            position: relative ;
        }

        .icoClose{
            display:block ; 
            height:100% ;
            line-height : 57px;
            margin-left : 10px;
        }

        .hoverText{
            transition : color .2s ease-in ;
        }

        .hoverText:hover{
            color : #c5c5c5;
        }
    `]
})
export class TagNavComponent{
    constructor(
        private router : Router , 
        private activedRoute : ActivatedRoute , 
        private sgo : SessionStorageService
    ){
        this.router.events
            .pipe(
                filter( event => event instanceof NavigationEnd) , 
                map( () => this.activedRoute) ,
                map( route => {
                    while (route.firstChild) route = route.firstChild;
                    return route;
                }) ,
                filter( route => route.outlet === 'primary') , 
                mergeMap( route => route.data) ,
                filter( event => {
                    let mark = event.title != null || event.title != undefined;

                    if(!mark){

                        let lang = JSON.parse(window.sessionStorage['lang'])['common']['workBench'] ;
                        
                        this.parentTitle = lang ;

                        this.routerArray = [] ;
                    };

                    return mark ;
                })
            )
            .subscribe(
                event => {

                    let currentRoute = this.sgo.get("routerInfo") ; 

                    let title = currentRoute['menuName'] ;

                    this.parentTitle = currentRoute['parentName'] ;

                    let url = this.router.url.replace(/\?.*/gi,"");

                    let para = this.activedRoute.queryParams['value'] ;

                    this.routerArray.forEach(p => p.isSelect=false);

                    var menu = { title: title ,url : url , isSelect:true ,raw : event , para : para , name : currentRoute};

                    let exitMenu=this.routerArray.find(info=>info.title==title);

                    if(exitMenu){
                        this.routerArray.forEach(p => p.isSelect = p.url == url);
                        return ;
                    };
                    this.routerArray.push(menu);

                }
            )
    };

    parentTitle : string ; 

    routerArray : Array<{ title: string , url : string ,isSelect:boolean , raw? : object , name : any }> = [] ;

    urlTrans( item ) : void {
        this.sgo.set("routerInfo" , item.name) ; 
		this.router.navigate([item.url] , {
			queryParams : item.para
        }) ;
    };
    
    closeUrl(module:string,isSelect:boolean , router : Object){

		let index=this.routerArray.findIndex(p=>p.url==module);
	
        
        let arr = this.routerArray.filter( item => {
            return item.url != module
        });

        this.routerArray = arr ;
        const routerTitle = router['title'] ;

        SimpleReuseStrategy.deleteRouteSnapshot(routerTitle);
        
        if(!isSelect) return;
        
		let menu = this.routerArray[index-1];

		if(!menu) {
           menu=this.routerArray[index+1];
		};
        
        this.routerArray.forEach( p => p.isSelect = p.url == menu.url );
        

		if(this.routerArray.length == 0){
            this.router.navigate(['/default']);
            
		}else{

            this.sgo.set("routerInfo" , menu.name) ;

			this.router.navigate(['/'+menu.url] ,{
				queryParams : menu['para']
			});
        };
	};
};
