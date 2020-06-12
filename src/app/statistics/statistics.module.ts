import { NgModule } from "@angular/core";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ShareModule } from "../share/share.module";
import { RouterModule, Router, Routes } from "@angular/router";
import { defaultComponent } from "./default/default.component";
const routes: Routes = [
  {
    path: "default",
    component: defaultComponent,
    data: {
      reuse: true,
      title: "数据总览"
    }
  }
];

const component = [defaultComponent];

@NgModule({
  declarations: [...component],
  imports: [ShareModule, NgZorroAntdModule, RouterModule.forChild(routes)],
  providers: [],
  bootstrap: []
})
export class StatisticsModule {}
