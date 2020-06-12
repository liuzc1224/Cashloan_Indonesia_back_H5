import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import {CommonMsgService, MsgService} from "../../service/msg";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzTreeNode, NzTdComponent } from "ng-zorro-antd";
import { MenuService } from "../../service/system";

@Component({
  selector: "app-root",
  templateUrl: "./sysMenu.component.html",
  styleUrls: ["./sysMenu.component.less"]
})
export class SySMenuComponent implements OnInit {
  constructor(
    private Cmsg: CommonMsgService,
    private msg : MsgService ,
    private fb: FormBuilder,
    private service: MenuService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      url: [null, [Validators.required]],
      iconPath: ["anticon anticon-bars", [Validators.required]],
      parentId: [null],
      zh_CN: [null],
      id_ID: [null],
      isButton: [null, [Validators.required]],
      id: [null]
    });
    this.getMenuData();
  }

  getMenuData() {
    this.service.getAllmenu().subscribe(res => {
      if (res["success"] === true) {
        let _arr = [];
        res["data"].forEach(item => {
          _arr.push(new NzTreeNode(item));
        });
        this.treeInfo = makeTreeNode(res["data"]);
      } else {
        this.Cmsg.fetchFail("获取菜单信息失败,原因" + res["message"]);
      }
    });
  }

  infoBoxShow: boolean = false;
  editMark: boolean = false;
  treeInfo: NzTreeNode[];
  addParentNode(parentId: number = 0) {
    this.infoBoxShow = true;
    this.validateForm.reset();
    this.validateForm.patchValue({
      parentId: parentId,
      iconPath: "anticon anticon-bars"
    });
    this.editMark = false;
  }

  validateForm: FormGroup;

  makeNew() {
    let formData = this.validateForm.value;
    let postObj = {
      url: formData["url"],
      iconPath: formData["iconPath"],
      isButton: formData["isButton"],
      menuDescriptionVOS: [
        {
          description: formData["zh_CN"],
          locale: "zh_CN"
        },
        {
          description: formData["id_ID"],
          locale: "id_ID"
        }
      ]
    };

    if (formData.parentId) postObj["parentId"] = formData.parentId;

    this.service.addNew(postObj).subscribe(res => {
      if (res["success"] === true) {
        this.Cmsg.operateSuccess();

        this.infoBoxShow = false;

        this.getMenuData();
      } else {
        this.Cmsg.operateFail(res["message"]);
      }
    });
  }
  selectItem: object;
  showMenu($event) {
    this.selectItem = $event.node;
    let el = <Element>document.querySelector(".menu");
    if($event.event.clientY>717){
      el["style"].top = $event.event.clientY - 250 + "px";
    }else{
      el["style"].top = $event.event.clientY - 90 + "px";
    }

    el["style"].left = $event.event.clientX - 170 + "px";
    el["style"].display = "block";
  }
  hideMenu() {
    let el = <Element>document.querySelector(".menu");
    el["style"].display = "none";
  }

  removeItem() {
    if(this.selectItem['origin']['i_menu_parent'] == 0){
      this.msg.warn("菜单根节点不可删除") ;
      this.hideMenu() ;
      return ;
    };
    let id = this.selectItem["key"];
    this.service.delMenu(id).subscribe(res => {
      if (res["success"] === true) {
        this.Cmsg.operateSuccess();

        this.getMenuData();

        this.hideMenu();
      } else {
        this.Cmsg.operateFail(res["message"]);
      }
    });
  }

  editItem() {
    this.validateForm.reset();

    this.hideMenu();
    this.infoBoxShow = true;
    this.editMark = true;
    let obj = this.selectItem["origin"];

    let _obj = {
      url: obj["url"],
      iconPath: obj["iconPath"],
      parentId: obj["parentId"],
      zh_CN: null,
      id_ID: null,
      isButton: obj["isButton"] + "",
      id: obj["id"]
    };

    obj["menuDescriptions"].forEach(item => {
      if (_obj.hasOwnProperty(item.locale)) {
        _obj[item.locale] = item.description;
      }
    });

    this.validateForm.patchValue(_obj);
  }
  addItem() {
    let id = this.selectItem["origin"]["key"];
    this.addParentNode(id);
    this.hideMenu();
  }

  save() {
    let formData = this.validateForm.value;
    let postObj = {
      url: formData["url"],
      iconPath: formData["iconPath"],
      isButton: formData["isButton"],
      id: formData["id"],
      parentId: formData["parentId"],
      menuDescriptionVOS: [
        {
          description: formData["zh_CN"],
          locale: "zh_CN"
        },
        {
          description: formData["id_ID"],
          locale: "id_ID"
        }
      ]
    };

    this.service.editMenu(postObj).subscribe(res => {
      if (res["success"] === true) {
        this.Cmsg.operateSuccess();
        this.getMenuData();
        this.infoBoxShow = false;
      } else {
        this.Cmsg.operateFail(res["message"]);
      }
    });
  }
}

let makeTreeNode = function(data): Array<NzTreeNode> {
  let treeArr = [];
  recursive(data);
  // console.log(data) ;
  data.forEach(item => {
    treeArr.push(new NzTreeNode(item));
  });
  return treeArr;
};

let recursive = function(data) {
  data.forEach(item => {
    item["key"] = item.id;
    item["title"] = item.menuDescriptions[0]["description"];

    if (item["children"]) recursive(item["children"]);
  });
};
