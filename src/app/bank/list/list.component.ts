import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableData } from '../../share/table/table.model' ;

import { CommonMsgService } from '../../service/msg/commonMsg.service' ;
import { Response } from '../../share/model/reponse.model' ;
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import { filter } from 'rxjs/operators' ;
import { SessionStorageService } from '../../service/storage';
import { Router } from '@angular/router';
import { BankSerive } from '../../service/bank'
let __this ;
@Component({
    selector : "" ,
    templateUrl : "./list.component.html" ,
    styleUrls : ['./list.component.less']
})
export class ListComponent implements OnInit{

    constructor(
        private translateSer : TranslateService ,
        private msg : CommonMsgService ,
        private fb : FormBuilder ,
        private sgo : SessionStorageService ,
        private router : Router ,
        private service : BankSerive
    ){} ;

    ngOnInit(){
        __this = this ;

        this.getLanguage() ;

        this.validateForm = this.fb.group({
            "id" : [null] ,
            "bankName" : [null , [Validators.required]],
            "bankCode"	: [null , [Validators.required]],
            "singleLimit" :[null , [Validators.required]],
            "dailyLimit" :[null , [Validators.required]]
        });
    };

    languagePack : Object ;

    validateForm : FormGroup ;

    modalMark : boolean = false;
    editMark : boolean = false ;
    deleteMark : boolean = false ;
    getLanguage(){
        this.translateSer.stream(["bankModule.list" , 'common'])
            .subscribe(
                data => {

                    this.languagePack = {
                        common : data['common'] ,
                        data : data['bankModule.list'] ,
                    };

                    this.initialTable() ;
                }
            )
    };

    tableData : TableData ;

    initialTable(){
        this.tableData = {
            tableTitle : [{
                name : __this.languagePack['data']['bankName'] ,
                reflect : "bankName" ,
                type : "text"
            },{
                name : __this.languagePack['data']['bankCode'] ,
                reflect : "bankCode" ,
                type : "text"
            },{
                name : __this.languagePack['data']['singleLimit'] ,
                reflect : "singleLimit" ,
                type : "text"
            },{
                name : __this.languagePack['data']['dailyLimit'] ,
                reflect : "dailyLimit" ,
                type : "text"
            },{
                name : __this.languagePack['data']['icon'] ,
                reflect : "img" ,
                type : "text"
            }],
            loading : false ,
            showIndex : true ,
            btnGroup : {
                title : __this.languagePack['common']['operate']['name'] ,
                data : [{
                    textColor : "#80accf",
                    name : __this.languagePack['common']['operate']['delete'],
                    ico : "anticon anticon-delete" ,
                    bindFn : (item) => {
                        this.selectItem = item ;
                        this.deleteMark = true ;
                    }
                },{
                    textColor : "#80accf",
                    name : __this.languagePack['common']['operate']['edit'],
                    ico : "anticon anticon-edit" ,
                    bindFn : (item) => {

                        this.selectItem = item ;

                        this.modalMark = true ;

                        this.editMark = true ;

                        this.validateForm.reset();

                        this.validateForm.patchValue(item) ;
                    }
                }]
            }
        };
        this.getList() ;
    };

    getList(){

        this.tableData.loading = true ;

        this.service.getList()
            .pipe(
                filter( ( res : Response) => {
                    if(res.success !== true){
                        this.msg.fetchFail(res.message) ;
                    };

                    this.tableData.loading = false ;

                    if(res.data && res.data['length'] === 0){
                        this.tableData.data = [] ;
                    };

                    return res.success === true ;
                })
            )
            .subscribe(
                res => {
                    let data_arr = res.data ;

                    this.tableData.data = ( <Array< Object > >data_arr );
                }
            )
    };

    addNewBank(){
        this.modalMark = true ;
        this.editMark = false ;
        this.validateForm.reset() ;
    };

    makeNew($event){
        let result = this.makeFormData();

        let el = <HTMLButtonElement>$event.target ;

        el.disabled = true ;
        if(result['mark']){
            let data = result['formData'] ;

            this.service.post(data)
                .pipe(
                    filter(
                        (res : Response) => {
                            if(res.success === false){
                                this.msg.operateFail(res.message) ;
                            };

                            el.disabled = false ;
                            return res.success === true ;
                        }
                    )
                )
                .subscribe(
                    res => {
                        this.modalMark = false;
                        this.getList() ;
                    }
                )
        };
    };

    save($event){
        let result = this.makeFormData();

        let el = <HTMLButtonElement>$event.target ;

        el.disabled = true ;
        if(result['mark']){
            let data = result['formData'] ;

            this.service.update(data)
                .pipe(
                    filter(
                        (res : Response) => {
                            if(res.success === false){
                                this.msg.operateFail(res.message) ;
                            };

                            el.disabled = false ;
                            return res.success === true ;
                        }
                    )
                )
                .subscribe(
                    res => {
                        this.modalMark = false;
                        this.getList() ;
                    }
                )
        };
    };

    selectItem : Object ;

    delete($event){
        let id = this.selectItem['id'];

        let el = <HTMLButtonElement>$event.target ;

        el.disabled = true ;

        this.service.delete(id)
            .pipe(
                filter(
                    ( res : Response) => {
                        if(res.success === false){
                            this.msg.operateFail(res.message) ;
                        };

                        el.disabled = false ;
                        return res.success === true ;
                    }
                )
            )
            .subscribe(
                (res : Response) => {
                    this.msg.operateSuccess() ;
                    this.getList() ;
                    this.deleteMark = false ;
                }
            );
    };

    makeFormData(){

        let result = {
            mark : true ,
            formData : null
        };

        let data = this.validateForm.value ;

        let file = document.querySelector("#imgIco")['files'][0];

        if(file){

            let formData = new FormData();
            formData.append("bankName" , data.bankName) ;
            formData.append("bankCode" , data.bankCode) ;
            formData.append("singleLimit" , data.singleLimit)
            formData.append("dailyLimit" , data.dailyLimit);
            formData.append("file" , file) ;
            result.formData = formData ;
        }else{
            if(!this.editMark){
                result.mark = false ;
                this.msg.operateFail("请选择图片") ;
            };
        };
        return result ;
    };
};
