import {Injectable, EventEmitter, OnInit} from "@angular/core";

@Injectable({
    providedIn : "root"
})
export class EmitService{
    
    public eventEmit = new EventEmitter();
    
    constructor() {
        // this.eventEmit = new EventEmitter();
    };
    ngOnInit() {

    };
};