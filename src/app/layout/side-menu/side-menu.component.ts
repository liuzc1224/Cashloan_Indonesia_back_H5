import { Component , OnInit } from '@angular/core' ;

import { MenuService } from '../../service/system' ;
import { CommonMsgService  } from '../../service/msg'

import { MenuData } from './menu.model' ;
import { Response } from '../../share/model';
import { SessionStorageService } from '../../service/storage';
import { Router } from '@angular/router';
@Component({
    selector : "side-menu" ,
    template :`
            <div *ngFor = 'let items of menuData'>
                <ul nz-menu [nzMode]="'inline'" [nzInlineCollapsed]="isCollapsed">
                    <li
                        nz-submenu
                        *ngIf = 'items.children.length > 0 && items.isButton == 0'
                        class="itemMenu"
                    >
                        <span title>
                            <i [className]="items.iconPath" style="color:#fff"></i>
                            <span>{{items.menuDescriptions[0].description}}</span>
                        </span>
                        <ul >
                            <div *ngFor = 'let item of items.children'>
                              <div *ngIf="item.children.length===0">
                                <li
                                  nz-menu-item
                                  (click) = 'urlLink(item,items)'
                                  *ngIf = 'item.isButton != 1'
                                >
                                  <span>{{item.menuDescriptions[0].description}}</span>
                                </li>
                              </div>
                              <div *ngIf="item.children.length > 0 && select(item.children)===0">
                                <li
                                  nz-menu-item
                                  (click) = 'urlLink(item,items)'
                                  *ngIf = 'item.isButton != 1'
                                >
                                  <span>{{item.menuDescriptions[0].description}}</span>
                                </li>
                              </div>
                              <div *ngIf="item.children.length > 0 && select(item.children)!==0">
                                <li
                                  nz-submenu
                                  *ngIf = 'item.children.length > 0 && item.isButton === 0'
                                  class="itemMenu"
                                >
                                  <span title  style="margin-left: -20px">
                                      <i [className]="item.iconPath" style="color:#fff"></i>
                                      <span>{{item.menuDescriptions[0].description}}</span>
                                  </span>
                                  <ul >


                                    <div *ngFor = 'let options of item.children'>
                                      <div *ngIf="options.children.length===0">
                                        <li
                                          nz-menu-item
                                          (click) = 'urlLink(options,item)'
                                          *ngIf = 'options.isButton != 1'
                                        >
                                          <span style="margin-left: 20px">{{options.menuDescriptions[0].description}}</span>
                                        </li>
                                      </div>
                                      <div *ngIf="options.children.length > 0 && select(options.children)===0">
                                        <li
                                          nz-menu-item
                                          (click) = 'urlLink(options,item)'
                                          *ngIf = 'options.isButton != 1'
                                        >
                                          <span style="margin-left: 20px">{{options.menuDescriptions[0].description}}</span>
                                        </li>
                                      </div>
                                      <div *ngIf="options.children.length > 0 && select(options.children)!==0">
                                        <li
                                          nz-submenu
                                          *ngIf = 'options.children.length > 0 && options.isButton === 0'
                                          class="itemMenu"
                                        >
                                      <span title>
                                          <i [className]="options.iconPath" style="color:#fff"></i>
                                          <span>{{options.menuDescriptions[0].description}}</span>
                                      </span>
                                          <ul >
                                            <div *ngFor = 'let option of options.children'>
                                              <li
                                                nz-menu-item
                                                (click) = 'urlLink(option,options)'
                                                *ngIf = 'option.isButton === 0'
                                              >
                                                <span style="margin-left: 40px">{{option.menuDescriptions[0].description}}</span>
                                              </li>
                                            </div>
                                          </ul>
                                        </li>
                                      </div>
                                    </div>
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
<!--                                    <div *ngFor = 'let option of item.children'>-->
<!--                                      <li-->
<!--                                        nz-menu-item-->
<!--                                        (click) = 'urlLink(option,item)'-->
<!--                                        *ngIf = 'option.isButton === 0'-->
<!--                                      >-->
<!--                                        <span style="margin-left: 20px">{{option.menuDescriptions[0].description}}</span>-->
<!--                                      </li>-->
<!--                                    </div>-->
                                    
                                  </ul>
                                </li>
                              </div>
                            </div>
                        </ul>
                    </li>
                </ul>
            </div>
    `,
    styles : [`
        ::ng-deep .ant-menu{
            background: none repeat scroll 0 0 rgba(0,0,0,.1);
            box-shadow: 0 1px 0 rgba(0,0,0,.1) !important;
            color: #fff;
            cursor:pointer ;
            border-right: none !important ;
            margin :0 10px 10px 10px ;
            width :calc(100% - 20px) ;
            border-radius: 3px;
        }
        ::ng-deep .ant-menu-submenu-title{
            margin: 0px !important;
            padding: 10px 0 ;

        }
        ::ng-deep .ant-menu-submenu-title:hover{
            background-color: rgba(0,0,0,.2);
            color: #fff!important;
            text-shadow: none;
            border-left: 2px solid #fff;
            padding-left: 28px;
            position: relative;
        }
        ::ng-deep .ant-menu-sub.ant-menu-inline{
            width:100% !important;
        }

        ::ng-deep .ant-menu-submenu>.ant-menu{
            background: none repeat scroll 0 0 rgba(0,0,0,.3);
            color: rgba(255,255,255,.9)!important;
        }

        ::ng-deep .ant-menu-item:hover{
            background-color: rgba(0,0,0,.1);
            color: #fff!important;
            text-shadow: none;
            border-left: 2px solid #fff;
            padding-left: 28px;
            position: relative;
        }
        ::ng-deep .ant-menu-inline .ant-menu-item{
            margin-top: 0px;
            margin-bottom: 0px;
        }
        ::ng-deep .ant-menu-item{
            padding-left: 30px !important;
        }
        ::ng-deep .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{
            background-color: rgba(0,0,0,.1) !important;
            color: #fff!important;
        }
    `]
})
export class SideMenuComponent implements OnInit{
    constructor(
        private service : MenuService ,
        private commonMsgSer : CommonMsgService ,
        private sgo : SessionStorageService ,
        private router : Router
    ){};

    ngOnInit(){
        const menu = this.sgo.get("menuData") ;

        if(menu){
            this.menuData = menu ;
            console.log(menu);
        }else{
            this.getMenuData() ;
        };
    };

    menuData : MenuData ;

    getMenuData(){
        const userId = this.sgo.get("loginInfo")['id'] ;
        this.service.getLoginMenu(userId)
            .subscribe(
                (res : Response ) => {
                  console.log(res);
                    if(res.success === true){
                        this.menuData = ( < MenuData > res.data) ;
                        console.log(this.menuData);
                        this.sgo.set("menuData" , this.menuData) ;
                    }else{
                        this.commonMsgSer.fetchFail(res.message) ;
                    }
                }
            )
    };
    select(item){
      let arr=item.filter(v=>v.isButton!==1);
      return arr.length;
    }
    urlLink(item , parent){

        const url = item.url ;

        const menuName = item.menuDescriptions[0].description ;

        const parentName = parent.menuDescriptions[0].description ;

        this.sgo.set("routerInfo" , {
            menuName :menuName ,
            parentName : parentName
        }) ;

        this.sgo.set("menuInfo" , item) ;
        this.router.navigate([url]) ;
    };
};
