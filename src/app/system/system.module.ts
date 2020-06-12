import { NgModule } from "@angular/core";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ShareModule } from "../share/share.module";
import { RouterModule, Router, Routes } from "@angular/router";
import { SysComponent } from "./sys/sys.component";
import { RoleComponent } from "./role/role.component";
import { StaffComponent } from "./staff/staff.component";
import { SySMenuComponent } from "./menu/sysMenu.component";
import { DepartComponent } from "./depart/depart.component";
const routes: Routes = [
  {
    path: "role",
    component: RoleComponent,
    data: {
      reuse: true,
      title: "角色"
    }
  },
  {
    path: "admin",
    component: StaffComponent,
    data: {
      reuse: true,
      title: "管理员"
    }
  },
  {
    path: "menu",
    component: SySMenuComponent,
    data: {
      reuse: true,
      title: "菜单"
    }
  },
  {
    path: "depart",
    component: DepartComponent,
    data: {
      reuse: true,
      title: "部门"
    }
  }
];

const component = [
  SysComponent,
  RoleComponent,
  StaffComponent,
  SySMenuComponent,
  DepartComponent
];
@NgModule({
  declarations: [...component],
  imports: [ShareModule, NgZorroAntdModule, RouterModule.forChild(routes)],
  providers: [],
  bootstrap: []
})
export class SystemModule {}
