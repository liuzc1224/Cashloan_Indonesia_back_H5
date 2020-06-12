import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN, en_GB} from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { HttpClientModule , HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import en from '@angular/common/locales/en';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RoutesModule } from './routes/route.module';
import { ShareModule } from './share/share.module';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {CKEditorModule} from 'ng2-ckeditor';
import {QRCodeModule} from 'angular2-qrcode';
import { SessionStorageService } from './service/storage';

const I18nLoader = function(http : HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

const object = {
  "zh_CN" : zh_CN ,
  "id_ID" : en_GB
};
const lang =  window.localStorage.getItem("locale") == 'id_ID' ? en_GB : (object[window.navigator.language.replace("-" , "_")] ? object[window.navigator.language.replace("-" , "_")] : zh_CN) ;
console.log(window.navigator.language);
console.log(lang);

if( window.navigator.language.replace("-" , "_") == 'id_ID'){
  console.log("666");
  if(window.localStorage.getItem("locale") == 'id_ID'){
    registerLocaleData(en);
  }else {
    registerLocaleData(zh);
  }
  lang['Pagination'] = {
    items_per_page: "artículos/hojas" ,
    jump_to: "siguente" ,
    jump_to_confirm: "confirmar" ,
    next_3: "siguente 3 hojas" ,
    next_5: "siguente 5 hojas" ,
    next_page: "siguente" ,
    page: "hoja" ,
    prev_3: "anterior 3 hojas" ,
    prev_5: "anterior 5 hojas" ,
    prev_page: "anterior"
  };

}else{
  console.log("555");
  if(window.localStorage.getItem("locale") == 'id_ID'){
    registerLocaleData(en);
  }else {
    registerLocaleData(zh);
  }

}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule ,
    RoutesModule ,
    ShareModule ,
    CKEditorModule,
    QRCodeModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (I18nLoader),
          deps: [ HttpClient ]
      }
    }),
  ],
  bootstrap: [ AppComponent ],
  providers   : [ { provide: NZ_I18N, useValue: lang } , {provide: LocationStrategy, useClass: HashLocationStrategy}]
})
export class AppModule { }
