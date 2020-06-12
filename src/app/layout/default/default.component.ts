import { Component, OnInit } from '@angular/core';
import { MsgService } from '../../service/msg';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: "default",
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.less']
})
export class DefaultComponent implements OnInit {
    constructor(
        private msg: MsgService,
        private transSer: TranslateService
    ) { };

    ngOnInit() {

    };


}
