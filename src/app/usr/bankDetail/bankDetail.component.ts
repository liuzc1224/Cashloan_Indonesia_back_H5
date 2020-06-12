import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ParaModel } from './paraModel';
import { Adaptor } from '../../share/tool';
import { TableData } from '../../share/table/table.model';
import { dataFormat, accountTypetransform } from '../../format';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { BasicInfoComponent } from '../../share/basic-info/basicInfo.component';
import { ApproveComponent } from '../../share/approve/approve.component';
import { AuthComponent } from '../../share/auth/auth.component'
import { RecordComponent } from '../../record/record/record.component';
import { OrderService, UserService } from '../../service/order';
import { filter } from 'rxjs/operators'
import { SessionStorageService } from '../../service/storage';
import { Router } from '@angular/router';
import {UserListService} from '../../service/user/list.service'
let __this;
declare var $ : any ;
@Component({
    selector: "bankDetail",
    templateUrl: "./bankDetail.component.html",
    styleUrls: ['./bankDetail.component.less']
})
export class bankDetailComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private msg: CommonMsgService,
        private fb: FormBuilder,
        private routerInfo: ActivatedRoute,
        private orderSer: OrderService,
        private sgo: SessionStorageService,
        private usrSer: UserService,
        private router: Router,
        private service:UserListService
    ) { };

    orderTableData: Object;
    languagePack : Object ;

    para : any;
    ngOnInit() {
        this.routerInfo.queryParams
        .subscribe(
            (para) => {
                this.para = para;
                console.log(this.para);
                this.getLanguage();
                this.getUserInfo();
            }
        );
    }
    getLanguage(){
        this.translateSer.stream(["enums.sex" , 'common'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common : data['common'] ,
                        data : data['enums.sex'],
                    };
                }
            )
    };

    getUserInfo(){
        this.service.getBankInfo(this.para.usrId).pipe(
            filter(
                (res : Response) => {
                    if(res.success === false){
                        this.msg.operateFail(res.message);
                    }
                    return res.success === true;
                }
            )
        )
        .subscribe(
            res => {
                if(res.data){
                    // console.log(res.data)
                    this.orderTableData = res.data;
                }
            }
        )
    }
};
