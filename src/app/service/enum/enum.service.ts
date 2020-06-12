import { Injectable } from '@angular/core';
import { locale } from './model' ;
@Injectable({
    providedIn : "root"
})
export class EnumService{
    constructor(
    ){};

    getLocale(){
        return locale ;
    };
}