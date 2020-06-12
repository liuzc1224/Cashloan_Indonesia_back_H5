import { Component , OnInit } from '@angular/core' ;
import { FormBuilder , FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../service/system'
import { MsgService } from '../service/msg';
import { TranslateService } from '@ngx-translate/core';
import { Response } from '../share/model' ;
import { SessionStorageService } from '../service/storage';
import { Router } from '@angular/router';
import { NzI18nService ,en_GB} from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import id from '@angular/common/locales/id';
import en from '@angular/common/locales/en';
@Component({
  selector : "app-login" ,
  templateUrl : "./login.component.html" ,
  styleUrls : ['./login.component.less']
})
export class LoginComponent implements OnInit{

  constructor(
    private fb : FormBuilder ,
    private service : LoginService ,
    private msg : MsgService ,
    private translate : TranslateService ,
    private sgo : SessionStorageService ,
    private router : Router ,
    private nzI18nService : NzI18nService
  ){};

  ngOnInit(){
    this.validForm = this.fb.group({
      "username" : [null , [Validators.required] ] ,
      "password" : [null , [Validators.required] ] ,
      "locale" : [ 'zh_CN' ]
    });
    if(window.sessionStorage.getItem("locale")){
      this.validForm.patchValue({
        locale:window.sessionStorage.getItem("locale")
      })
    }
    this.getLang() ;
  }
  validForm : FormGroup;

  login(){

    this.isLoading = true ;
    let valid = this.validForm.valid ;

    if(!valid){
      this.msg.error(this.languagePack['login']['tips']['empty'])
      this.isLoading = false ;
      return ;
    };

    let postData = this.validForm.value ;
    this.service.login(postData)
      .subscribe(
        ( res : Response ) => {
          this.isLoading = false ;
          window.localStorage.setItem("locale",this.validForm.value['locale']);
          if(res.success === true){
            this.sgo.set("loginInfo" , res['data']) ;
            this.router.navigate(['/default'])
          }else{
            const msg = this.languagePack['login']['tips']['invalid'] ;
            this.msg.error(msg) ;
          };

          this.isLoading = false ;
        }
      )


  };

  languagePack : Object ;
  getLang(){
    this.translate.stream(["common" , "login"])
      .subscribe(
        res =>{
          this.languagePack = res ;
        }
      )
  };

  isLoading : boolean = false ;

  choseLocale($event){
    this.translate.use($event) ;
    this.sgo.set("locale" , $event) ;

    if ( $event === 'id_ID') {
      this.nzI18nService.setLocale(en_GB) ;
      registerLocaleData(en);
    }
    this.translate.getTranslation($event)
      .subscribe(
        res => {
          this.sgo.set("lang" , res) ;
        }
      );
  };

  languageEnmu : Array<Object> = [{
    name : "中文" ,
    value : "zh_CN"
  } , {
    name : "indonesia" ,
    value : "id_ID"
  }]
}
