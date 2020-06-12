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
import { ListComponent } from '../list/list.component';

import { UserListService } from '../../service/user/index';
import { filter } from 'rxjs/operators'
let __this;
@Component({
    selector: "orderList",
    templateUrl: "./orderList.component.html",
    styleUrls: ['./orderList.component.less']
})
export class OrderListComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private msg: CommonMsgService,
        private fb: FormBuilder,
        private routerInfo: ActivatedRoute ,
        private service : UserListService
    ) { };


    @ViewChild("list")
    listComponent: ListComponent;


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


                    this.listComponent.getList();


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


    loginInfo : Object ;

};