import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ParaModel } from './paraModel';
import { Adaptor } from '../../share/tool';
import { TableData } from '../../share/table/table.model';
import { dataFormat } from '../../format';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { BasicInfoComponent } from '../../share/basic-info/basicInfo.component';
import { ApproveComponent } from '../../share/approve/approve.component';
import { AuthComponent } from '../../share/auth/auth.component'
import { letterComponent } from '../../share/letter/letter.component'
import { RecordComponent } from '../../record/record/record.component';
import { ListComponent} from '../../order/list/list.component';
import { UserListService } from '../../service/user/index';
import { filter } from 'rxjs/operators'
let __this;
@Component({
    selector: "",
    templateUrl: "./detail.component.html",
    styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private msg: CommonMsgService,
        private fb: FormBuilder,
        private routerInfo: ActivatedRoute ,
        private service : UserListService
    ) { };

    @ViewChild("basicInfo")
    basicInfoComponent: BasicInfoComponent;

    @ViewChild("approve")
    approveComponent: ApproveComponent;

    @ViewChild("auth")
    authComponent: AuthComponent;

    @ViewChild("record")
    recordComponent: RecordComponent;

    @ViewChild("list")
    listComponent: ListComponent;

    @ViewChild("recordAsk")
    recordAskComponent: RecordComponent;

    @ViewChild("letter")
    letterComponent: letterComponent;

    loanTitle : string ;
    creditTitle: string ;
    applyTitle : string ;

    ngOnInit() {
        __this = this;
        this.getLanguage();

        this.routerInfo.queryParams
            .subscribe(
                (para) => {

                    this.para = para;

                    this.basicInfoComponent.getData(para.usrId);

                    // this.approveComponent.getData(para.usrId);

                    // this.recordComponent.getData(para.usrId);

                    this.listComponent.getData(para.usrId);

                    this.getLoginInfo();

                }
            );
    };
    private para: ParaModel;

    languagePack: Object;

    getLanguage() {
        this.translateSer.stream(['common'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common: data['common'],
                    };

                    this.loanTitle = this.languagePack['common']['orderList'][0] ;
                    this.applyTitle = this.languagePack['common']['btnGroup']['c'] ;
                    this.creditTitle=this.languagePack['common']['orderList'][1] ;
                }
            )
    };

    selectTab(type) {
        switch (type) {
            case '1':
                // this.recordComponent.getData(this.para.usrId);
                this.listComponent.getData(this.para.usrId);
                break;
            case '2':
                this.recordAskComponent.getData(this.para.usrId);
                break;
            case '3':
                this.authComponent.getData(this.para.usrId, this.para.order);
                break;
            case '4':
                this.letterComponent.getData(this.para.usrId);
                break;
            default:
                break;
        }
    };

    loginInfo : Object ;
    getLoginInfo(){
        this.service.getLoginInfo(this.para.usrId)
            .pipe(
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
                    this.loginInfo = res.data ;
                    // console.log(this.loginInfo)
                }
            )
    }
};
