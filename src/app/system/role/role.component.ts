import { Component, OnInit } from "@angular/core";
import { CommonMsgService } from "../../service/msg";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SearchModel } from "./search.model";
import { NzTreeNode } from "ng-zorro-antd";
import { TranslateService } from "@ngx-translate/core";
import { TableData } from "../../share/table/table.model";
import { RoleService, MenuService } from "../../service/system";

let __this;
@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.less"]
})
export class RoleComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private msg: CommonMsgService,
    private translate: TranslateService,
    private service: RoleService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    __this = this;
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
      id: [null]
    });
    this.getLanguage();
    this.getMap();
  }

  validateForm: FormGroup;

  searchModel: SearchModel = new SearchModel();

  roleId: number;

  refuseModel: boolean = false;

  roleButtonData: any;

  initTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack["table"]["roleName"],
          type: "text",
          reflect: "name"
        },
        {
          name: __this.languagePack["table"]["remark"],
          type: "text",
          reflect: "description"
        }
      ],
      data: [],
      showIndex: true,
      loading: false,
      btnGroup: {
        title: __this.languagePack["common"]["operate"]["name"],
        data: [
          {
            textColor: "#80accf",
            name: __this.languagePack["common"]["operate"]["edit"],
            ico: "anticon anticon-edit",
            bindFn: function(item) {
              __this.showEdit(item);
            }
          },
          {
            textColor: "#de0606",
            name: __this.languagePack["common"]["operate"]["delete"],
            ico: "anticon anticon-delete",
            bindFn: function(item) {
              __this.roleId = item.id;
              __this.refuseModel = true;
            }
          }
        ]
      }
    };
    this.roleButtonData = [];
    this.getList();
  }
  tableData: TableData;
  totalSize = 0;
  getList() {
    this["tableData"]["loading"] = true;
    this.service.getList(this.searchModel).subscribe(res => {
      this["tableData"]["loading"] = false;

      if (res["success"] === true) {
        this.tableData.data = res["data"];
        this.totalSize = res["page"]["totalNumber"];
      } else {
        this.msg.fetchFail(res["message"]);
      }
    });
  }
  menuTree: NzTreeNode[];
  raw_data: any[];
  getMap() {
    this.menuService.getAllmenu().subscribe(res => {
      if (res["success"] === true) {
        let rawTreeData = makeTreeNode(res["data"]);
        this.raw_data = rawTreeData;
        this.menuTree = rawTreeData;
      } else {
        this.msg.fetchFail(res["message"]);
      }
    });
  }

  infoBoxShow: boolean = false;
  editMark: boolean = false;
  firstStep: boolean = true;
  addNewRole() {
    this.validateForm.reset();

    let _obj = [];

    if (!this.raw_data) {
      return;
    }

    this.raw_data.forEach(item => {
      _obj.push(new Tree(item));
    });

    this.selectRoles = [];

    this.editMark = false;

    this.infoBoxShow = true;

    this.menuTree = _obj;
  }

  showEdit(item) {
    this.roleId = item.id;
    this.service.getRoleById(this.roleId).subscribe(res => {
      if (res["success"] === true) {
        let selectdKeys = [];
        res["data"]["menuDTOS"].forEach(item => {
          if (item.isButton == 0) {
            selectdKeys.push(item.id);
          }
        });

        let _obj = [];

        this.raw_data.forEach(item => {
          _obj.push(new Tree(item, selectdKeys));
        });

        this.selectRoles = selectdKeys;
        this.validateForm.patchValue(item);
        this.editMark = true;
        this.infoBoxShow = true;
        this.menuTree = _obj;
      } else {
        this.msg.fetchFail(res["message"]);
      }
    });
  }
  selectRoles: number[] = [];
  mouseAction($event) {
    // if(this.editMark)
    $event.node.isSelected = !$event.node.isSelected;

    if ($event.node.isSelected == true) {
      let id = $event.node.key;
      this.selectRoles.push(id);
    }

    if ($event.node.isSelected == false) {
      let id = $event.node.key;
      let idx = this.selectRoles.indexOf(id);
      this.selectRoles.splice(idx, 1);
    }

    this.validateForm.patchValue({
      menuIds: this.selectRoles
    });
  }

  log(data) {}

  makeNew() {
    this.infoBoxShow = true;
    let data = this.validateForm.value;
    let selectBtns = [];
    this.roleButtonData.forEach(tr => {
      tr.buttonList.forEach(item => {
        if (item.checked) {
          selectBtns.push(item.value);
        }
      });
    });
    let menuIds = this.selectRoles.concat(selectBtns);
    data.menuIds = menuIds;
    this.service.addNewRole(data).subscribe(res => {
      this.infoBoxShow = false;
      this.firstStep = true;
      if (res["success"] === true) {
        this.msg.operateSuccess();
        this.getList();
      } else {
        this.msg.operateFail(res["message"]);
      }
    });
  }

  pageChange($size: number, type: string): void {
    if (type == "size") {
      this.searchModel.pageSize = $size;
    }

    if (type == "page") {
      this.searchModel.currentPage = $size;
    }
    this.getList();
  }

  delete() {
    this.service.deleteRole(this.roleId).subscribe(res => {
      this.refuseModel = false;
      if (res["success"] === true) {
        this.msg.operateSuccess();

        this.getList();
      } else {
        this.msg.operateFail(res["message"]);
      }
    });
  }
  next() {
    this.roleButtonData = [];
    this.firstStep = false;
    let postData = {
      roleId: this.validateForm.value.id,
      buttons: []
    };
    this.selectRoles.forEach(item => {
      postData["buttons"].push({ id: item });
    });
    this.menuService.getButton(postData).subscribe(res => {
      let listData = res["data"];
      listData.forEach(item => {
        let childButton = [];
        if (item.buttonList) {
          item.buttonList.forEach(item => {
            let checked = item.isAuth == 1 ? true : false;
            childButton.push({
              label: item.menuDescriptions[0].description,
              value: item.id,
              checked: checked
            });
          });
        }
        let tr = {
          id: item.id,
          name: item.name,
          buttonList: childButton
        };
        this.roleButtonData.push(tr);
      });
    });
  }
  save() {
    let postData = this.validateForm.value;
    let selectBtns = [];
    this.roleButtonData.forEach(tr => {
      tr.buttonList.forEach(item => {
        if (item.checked) {
          selectBtns.push(item.value);
        }
      });
    });
    let menuIds = this.selectRoles.concat(selectBtns);
    postData.menuIds = menuIds;
    this.service.update(postData).subscribe(res => {
      this.infoBoxShow = false;
      this.firstStep = true;
      if (res["success"] === true) {
        this.msg.operateSuccess();
        this.getList();
      } else {
        this.msg.operateFail(res["message"]);
      }
    });
  }
  languagePack: object;
  getLanguage() {
    this.translate
      .stream(["common", "systemModule.role.table"])
      .subscribe(res => {
        this.languagePack = {
          common: res["common"],
          table: res["systemModule.role.table"]
        };
        this.initTable();
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
  data.forEach((item, index) => {
    if (item.isButton === 0) {
      item["key"] = item.id;
      item["title"] = item.menuDescriptions[0]["description"];

      if (item["children"]) {
        recursive(item["children"]);
      }
    } else {
      data.splice(index, 1);
      recursive(data);
    }
  });
};

let Tree = function(option, selectKeys?, parent?) {
  let _parent = this;

  this.title = option.title || "---";

  this.key = option.key || null;

  this.parentNode = parent;

  this.isSelected =
    (selectKeys && selectKeys.indexOf(option.key)) > -1 ? true : false;
  this.children = [];

  if (typeof option.children !== "undefined" && option.children !== null) {
    option.children.forEach(function(nodeOptions) {
      _parent.children.push(new Tree(nodeOptions, selectKeys, _parent));
    });
  }
};
Tree.prototype.getParentNode = function() {
  return this.parentNode;
};
Tree.prototype.getChildren = function() {
  return this.children;
};
