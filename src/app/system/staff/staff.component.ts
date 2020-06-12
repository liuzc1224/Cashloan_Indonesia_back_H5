import { Component, OnInit } from "@angular/core";
import { CommonMsgService } from "../../service/msg";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import { SearchModel } from "./search.model";
import { EnumService } from "../../service/enum/enum.service";
// import { BelongService } from '../../service/belong/belong.service' ;
import { TranslateService } from "@ngx-translate/core";
import { TableData } from "../../share/table/table.model";
import { StaffService, RoleService, DepartService } from "../../service/system";
import { NzTreeNode } from "ng-zorro-antd";
let __this;
@Component({
  selector: "app-role",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.less"]
})
export class StaffComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private enmuSer: EnumService,
    private translate: TranslateService,
    private service: StaffService,
    private roleService: RoleService,
    private departService: DepartService,
    private msg: CommonMsgService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      description: [null, [Validators.required]],
      phoneNumber: [null],
      password: [null, [Validators.required]],
      password2: [null],
      roleIds: [[null], [Validators.required]],
      id: [null]
    });

    __this = this;
    this.getLanguage();
  }
  loadingNew:boolean=false;
  loadingSave:boolean=false;
  initTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack["table"]["userName"],
          type: "text",
          reflect: "username"
        },
        {
          name: __this.languagePack["table"]["mobile"],
          type: "text",
          reflect: "phoneNumber"
        },
        {
          name: __this.languagePack["table"]["realName"],
          type: "text",
          reflect: "description"
        },
        {
          name: __this.languagePack["table"]["department"],
          type: "text",
          reflect: "departmentNames",
          filter: item => {
            let str = "";
            item.departmentDTOS.forEach(item => {
              str += item.name + ",";
            });
            return str ? str.substring(0,str.length-1) : "";
          }
        },
        {
          name: __this.languagePack["table"]["role"],
          type: "text",
          reflect: "roleNames",
          filter: item => {
            let str = "";
            item.roleOutputVOS.forEach(item => {
              str += item.name+",";
            });
            return str ? str.substring(0,str.length-1) : "";
          }
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
            showContion: {
              name: "enabled",
              value: [true]
            },
            bindFn: function(item) {
              __this.showEdit(item);
            }
          },
          {
            textColor: "#de0606",
            name: __this.languagePack["common"]["operate"]["delete"],
            ico: "anticon anticon-delete",
            showContion: {
              name: "enabled",
              value: [true]
            },
            bindFn: function(item) {
              __this.stuffId = item.id;
              __this.refuseModel = true;
            }
          },
          {
            textColor: "#de0606",
            name: __this.languagePack["common"]["operate"]["deled"],
            ico: "anticon anticon-delete",
            showContion: {
              name: "enabled",
              value: [false]
            },
            bindFn: function(item) {}
          }
        ]
      }
    };
    this.getList();
    this.getRoles();
    this.getDepart();
  }
  searchModel: SearchModel = new SearchModel();
  tableData: TableData;
  totalSize = 0;
  stuffId: number;
  shopChange($event) {
    this.getList();
  }
  getList() {
    this.tableData.loading = true;
    this.service.getList(this.searchModel).subscribe(res => {
      this.tableData.loading = false;
      if (res["success"] === true) {
        if (res["data"]) {
          this.tableData.data = res["data"];
          this.totalSize = res["page"]["totalNumber"];
        }else{
          this.tableData.data=[];
          this.totalSize=0;
        }
      } else {
        this.msg.fetchFail(res["message"]);
      }
    });
  }
  infoBoxShow: boolean = false;
  validateForm: FormGroup;
  editMark: boolean = false;
  refuseModel: boolean;

  addNewStuff() {
    this.infoBoxShow = true;

    this.editMark = false;
    this.validateForm.setControl("password", new FormControl(null, Validators.required));
    this.validateForm.reset();


    this.selectDeaprt = [];

    let _obj = [];

    if (!this.raw_data) {
      return;
    }
    console.log(this.validateForm.value);
    this.raw_data.forEach(item => {
      _obj.push(new Tree(item));
    });

    this.departs = _obj;
  }

  makeNew() {
    if(!this.validateForm.valid){
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      return
    }
    this.loadingNew=true;
    let postData = this.validateForm.value;
    postData["departmentIds"] = this.selectDeaprt;
    // let _roleIds = [];
    // this.roles.forEach(item => {
    //   if (postData.roleIds.indexOf(item["name"]) > -1) {
    //     _roleIds.push(item["value"]);
    //   }
    // });
    // postData["roleIds"] = _roleIds;
    this.service.addNew(postData).subscribe(res => {
      this.loadingNew=false;
      if (res["success"] === true) {
        this.msg.operateSuccess();

        this.getList();

        this.infoBoxShow = false;
      } else {
        this.msg.operateFail(res["message"]);
      }
    });
  }
  delete() {
    this.service.deleteStaff(this.stuffId).subscribe(res => {
      if (res["success"] === true) {
        this.msg.operateSuccess();
        this.getList();
        this.refuseModel = false;
      } else {
        this.msg.operateFail(res["message"]);
      }
    });
  }

  showEdit(item) {
    let roles = [];

    let departs = [];

    item.roleOutputVOS.forEach(item => {
      roles.push(item.id);
    });

    item.departmentDTOS.forEach(item => {
      departs.push(item.id);
    });

    item.roleIds = roles;

    this.selectDeaprt = departs;

    let _obj = [];

    this.raw_data.forEach(item => {
      _obj.push(new Tree(item, departs));
    });
    this.validateForm.setControl("password", new FormControl(null));
    this.validateForm.patchValue(item);
    console.log(this.validateForm.value);

    this.editMark = true;

    this.infoBoxShow = true;

    this.departs = _obj;
  }

  save() {
    if(!this.validateForm.valid){
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      return
    }
    let postData = this.validateForm.value;
    postData["departmentIds"] = this.selectDeaprt;

    // let _roleIds = [];
    //
    // this.roles.forEach(item => {
    //   if (postData.roleIds.indexOf(item["value"]) > -1) {
    //     _roleIds.push(item["value"]);
    //   }
    // });
    //
    // postData["roleIds"] = _roleIds;

    if (!postData["password"]) delete postData["password"];

    this.service.update(postData).subscribe(res => {
      if (res["success"] === true) {
        this.getList();

        this.infoBoxShow = false;

        this.msg.operateSuccess();
      } else {
        this.msg.operateFail(res["message"]);
      }
    });
  }
  search(){
    this.searchModel.currentPage=1;
    this.getList();
  }
  reset() {
    this.searchModel = new SearchModel();
    this.getList();
  }

  languagePack: object;

  getLanguage() {
    this.translate
      .stream(["common", "systemModule.admin.table"])
      .subscribe(res => {
        this.languagePack = {
          common: res["common"],
          table: res["systemModule.admin.table"]
        };
        this.initTable();
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
  roles: object[] = [];
  getRoles() {
    let data={
      currentPage: 1,
      pageSize: 1000
    };
    this.roleService.getList(data).subscribe(res => {
      if (res["success"] === true) {
        res["data"].forEach(item => {
          this.roles.push({
            name: item.name,
            value: item.id
          });
        });
        console.log(this.roles)
      } else {
        this.msg.fetchFail(res["message"]);
      }
    });
  }
  changeSelect(){
    console.log(this.validateForm.value.roleIds)
  }
  departs: NzTreeNode[];

  raw_data: NzTreeNode[];

  getDepart() {
    this.departService.get().subscribe(res => {
      if (res["success"] === true) {
        let raw_data = makeTreeNode(res["data"]);
        this.raw_data = raw_data;
        this.departs = raw_data;
      } else {
        this.msg.fetchFail(res["message"]);
      }
    });
  }

  selectDeaprt: number[] = [];

  mouseAction($event) {
    $event.node.isSelected = !$event.node.isSelected;
    if ($event.node.isSelected == true) {
      let id = $event.node.key;
      this.selectDeaprt.push(id);
    }

    if ($event.node.isSelected == false) {
      let id = $event.node.key;
      let idx = this.selectDeaprt.indexOf(id);
      this.selectDeaprt.splice(idx, 1);
    }
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

