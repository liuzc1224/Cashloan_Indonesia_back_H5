import { Injectable } from '@angular/core';
import { HttpEvent,HttpInterceptor,HttpHandler,HttpRequest,HttpResponse ,HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators' ;
import { Router } from '@angular/router';
import { MsgService } from './service/msg/msg.service' ;
import { SessionStorageService } from './service/storage/session_storage';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
export class LoginInterceptor implements HttpInterceptor {
  constructor(
    private router : Router ,
    private msg : MsgService ,
    private sgo : SessionStorageService , 
    private translate : TranslateService
  ){};


  postUrl : object = {} ;
  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const reg = /.*\/help\/\d+/g ;

    let headers ;

    let obj = {
        'withCredentials': true ,
        setParams : {
          // "lang" : this.sgo.get("locale")
        }
    };

    if(reg.test(req.url)){
      
    }else{

      headers = new HttpHeaders({
        "Accept-Language" : this.sgo.get("locale").replace("_" , "-")
      });
      obj['headers'] = headers ;
    };

    req = req.clone(obj);
    return next.handle(req)
      .pipe(
        catchError( error => {

          let code = error['status'] ;

          if(code == 401){
            this.router.navigate(['/login']) ;
          }
          else if(code == 0){

          }else {
            this.router.navigate(['error' , code]);
          };
          return throwError(error) ;
        })
      )
  };
};
// .do( event => {
//   return event ;
// }, err => {
//   let code = err['status'] ;
//   if(code == 401){
//     this.router.navigate(['/login']) ;
//   }else{
//     this.router.navigate(['error' , code]);
//   };
// })
