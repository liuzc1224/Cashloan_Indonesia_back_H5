import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { RecordComponent } from './record/record.component'
const routes  : Routes = [
    {
        path : "list" ,
        component : RecordComponent ,
        data : {
            reuse : true ,
            title : "Notas de préstamo"
        }
    }
];

const component = [
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
export class RecordModule{ };