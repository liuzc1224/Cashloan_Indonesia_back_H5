import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { CommonMsgService } from "../../service/msg";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzTreeNode, NzTdComponent } from "ng-zorro-antd";
import { DepartService } from "../../service/system";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-depart",
  templateUrl: "./depart.component.html",
  styleUrls: ["./depart.component.less"]
})
export class DepartComponent implements OnInit {
  constructor(
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private service: DepartService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      parentId: [null],
      id: [null]
    });
    this.getMenuData();
    this.getLanguage();
  }

  getMenuData() {
    this.service.get().subscribe(res => {
      if (res["success"] === true) {
        this.treeInfo = makeTreeNode(res["data"]);
      } else {
        this.msg.fetchFail(res["message"]);
      }
    });
  }

  infoBoxShow: boolean = false;
  editMark: boolean = false;
  treeInfo: NzTreeNode[];
  addParentNode(parentId: number = null) {
    this.infoBoxShow = true;
    this.validateForm.reset();
    this.validateForm.patchValue({
      parentId: parentId
    });
    this.editMark = false;
  }

  validateForm: FormGroup;

  makeNew() {
    let postObj = this.validateForm.value;
    this.service.post(postObj).subscribe(res => {
      if (res["success"] === true) {
        this.msg.operateSuccess();

        this.infoBoxShow = false;

        this.getMenuData();
      } else {
        this.msg.operateFail(res["message"]);
      }
    });
  }
  selectItem: object;
  showMenu($event) {
    this.selectItem = $event.node;
    let el = <Element>document.querySelector(".menu");
    el["style"].top = $event.event.clientX - 90 + "px";
    el["style"].left = $event.event.clientX + 170 + "px";
    el["style"].display = "block";
  }
  hideMenu() {
    let el = <Element>document.querySelector(".menu");
    el["style"].display = "none";
  }

  removeItem() {
    let id = this.selectItem["key"];
    this.service.delete(id).subscribe(res => {
      if (res["success"] === true) {
        this.msg.operateSuccess();
        this.getMenuData();
        this.hideMenu();
      } else {
        this.msg.operateFail(res["message"]);
      }
    });
  }

  editItem() {
    this.hideMenu();
    this.infoBoxShow = true;
    this.editMark = true;
    let obj = this.selectItem["origin"];
    this.validateForm.patchValue(obj);
  }
  addItem() {
    let id = this.selectItem["origin"]["key"];
    this.addParentNode(id);
    this.hideMenu();
  }

  save() {
    let postData = this.validateForm.value;
    this.service.put(postData).subscribe(res => {
      if (res["success"] === true) {
        this.msg.operateSuccess();
        this.getMenuData();
        this.infoBoxShow = false;
      } else {
        this.msg.operateFail(res["message"]);
      }
    });
  }

  languagePack: object;
  getLanguage() {
    this.translate.stream(["common", "systemModule.depart"]).subscribe(res => {
      this.languagePack = {
        common: res["common"],
        table: res["systemModule.depart"]
      };
    });
  }
}
let makeTreeNode = function(data): Array<NzTreeNode> {
  let treeArr = [];
  recursive(data);
  data.forEach(item => {
    treeArr.push(new NzTreeNode(item));
  });
  return treeArr;
};

let recursive = function(data) {
  data.forEach(item => {
    item["key"] = item.id;
    item["title"] = item.name;
    if (item["children"]) recursive(item["children"]);
  });
};
