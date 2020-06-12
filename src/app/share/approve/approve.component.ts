import { Component , OnInit , Input, Output } from '@angular/core';
import { UserService } from '../../service/order' ;
import { filter } from 'rxjs/operators';
import { CommonMsgService } from '../../service/msg'
import { Response } from '../model';
import { Router } from '@angular/router'
@Component({
    selector :"approve" , 
    templateUrl : "./approve.component.html" , 
    styleUrls : ["./approve.component.less"]
})
export class ApproveComponent implements OnInit{
    constructor(
        private usrSer : UserService ,
        private msg : CommonMsgService ,
        private router : Router
    ){};

    ngOnInit(){
    };

    getData(usrId : number){
        this.usrId = usrId ;
        this.usrSer.getAccountInfo(usrId)
            .pipe(
                filter( (res : Response) => {
                    if(res.success === false){
                        this.msg.fetchFail(res.message) ;
                    };

                    return res.success === true ;
                })
            )
            .subscribe(
                (res : Response ) => {
                    this.userInfo = res.data ;
                }
            )
    };

    userInfo : Object ; 
    usrId : number ;
    goToAuth(){

        let usrId = this.usrId ;

        this.router.navigate(['/usr/auth'] , {
            queryParams : {
                from : "usr" ,
                usrId :usrId
            }
        });
    };
};
