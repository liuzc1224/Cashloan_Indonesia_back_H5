import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { ListComponent }from './list/list.component'
const routes  : Routes = [
    {
        path : "list" , 
        component : ListComponent , 
        data : {
            reuse : true , 
            title : "银行卡列表"
        }
    }
];

const component = [
	ListComponent ,
];

@NgModule({
	declarations : [
		...component
	],
	imports: [
		ShareModule,
		NgZorroAntdModule,
		RouterModule.forChild(routes)
	],
	providers: [],
	bootstrap: []
})
export class BankModule{ };