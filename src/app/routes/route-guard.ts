import { Injectable , OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from "@angular/router";
import { SessionStorageService } from '../service/storage/session_storage';
import { EmitService } from '../service/event-emit.service' ;
@Injectable()
export class RouteguardService implements CanActivate ,OnInit{

  constructor(
    private router: Router ,
		private sgo : SessionStorageService,
		private emit : EmitService
	) { };
	
	ngOnInit(){
	}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
  	let userInfo = this.sgo.get("loginInfo") ;

  	if(userInfo){
  		return true ;
  	}else{
  		this.router.navigate(['/login'])
	  	return false ;
  	}
  };
}