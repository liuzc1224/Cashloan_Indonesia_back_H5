import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { SearchModel } from "./searchModel";
import { TableData } from "../../../../share/table/table.model";
import { unixTime } from "../../../../format";
import { ActivatedRoute } from "@angular/router";

import { RiskListService } from "../../../../service/risk";
import { CommonMsgService } from "../../../../service/msg/commonMsg.service";
import { Response } from "../../../../share/model/reponse.model";
import { FormGroup, FormBuilder } from "@angular/forms";
import { filter } from "rxjs/operators";
import { SessionStorageService } from "../../../../service/storage";
import { DateObjToString } from "../../../../format";

let __this;
@Component({
  selector: "",
  templateUrl: "./riskAttendance.component.html",
  styleUrls: ["./riskAttendance.component.less"]
})
export class riskAttendanceComponent implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private service: RiskListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private router: Router,
    private sgo: SessionStorageService,
    private routerInfo: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routerInfo.queryParams.subscribe(queryParams => {
      this.isCommon = queryParams.isCommon == "true" ? true : false;
    });
    __this = this;
    this.getLanguage();
  }
  userId: string = "";
  languagePack: Object;
  isCommon: boolean = false;
  statusEnum: Array<Object>;

  statusEnum1: Array<Object>;

  validateForm: FormGroup;

  userLoginInfo: Object;

  roleShowPage: boolean = true;

  getLanguage() {
    this.translateSer.stream(["atendanceModule", "common", "riskModule"]).subscribe(data => {
      this.languagePack = {
        common: data["common"],
        data: data["atendanceModule"],
        risk: data["riskModule"]
      };
      this.statusEnum = data["riskModule"]["searchTabStatus"];
      this.statusEnum1 = data["riskModule"]["searchTabStatus1"];

      this.userLoginInfo = this.sgo.get("loginInfo");

      this.initialTable();
    });
  }

  searchModel: SearchModel = new SearchModel();

  changeStatus(status: string) {
    this.searchModel.currentPage = 1;
    this.getList();
  }

  tableData: TableData;

  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack["data"]["table"]["auditWorkerAccount"],
          reflect: "riskEmployeeAccount",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["table"]["auditWorkerRealName"],
          reflect: "riskEmployeeName",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["table"]["signinTime"],
          reflect: "signInDate",
          type: "text",
          filter: item => {
            return unixTime(item.signInDate);
          }
        },
        {
          name: __this.languagePack["data"]["table"]["signOutTime"],
          reflect: "signOutDate",
          type: "text",
          filter: item => {
            return unixTime(item.signOutDate);
          }
        },
        {
          name: __this.languagePack["data"]["table"]["allocateTotal"],
          reflect: "totalAllocateCount",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["table"]["auditedNumber"],
          reflect: "auditCount",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["table"]["unauditNumber"],
          reflect: "unAuditCount",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["table"]["workingHour"],
          reflect: "workTime",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["table"]["perHourAuditNumber"],
          reflect: "hourAuditCount",
          type: "text"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.getList();
  }

  totalSize: number = 0;
  getList() {
    this.tableData.loading = true;
    let data = this.searchModel;
    let signInEndDate = unixTime(<Date>data.signInEndDate,"y-m-d");
    data.signInBeginDate =data.signInBeginDate ? unixTime(<Date>data.signInBeginDate,"y-m-d")+" 00:00:00" : null;
    data.signInEndDate =
      signInEndDate
        ? signInEndDate + " 23:59:59"
        : null;
    let start=(new Date(data.signInBeginDate)).getTime();
    let end=(new Date(data.signInEndDate)).getTime();
    if( start - end >0 ){
      data.signInBeginDate=null;
      data.signInEndDate=null;
    }


    this.service
      .getAttendanceList(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }

          this.tableData.loading = false;

          if (res.data && res.data["length"] == 0) {
            this.tableData.data = [];
            this.totalSize = 0;
          }

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe((res: Response) => {
        let data_arr = res.data;

        this.tableData.data = <Array<Object>>data_arr;

        this.totalSize = res.page.totalNumber;
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

  reset() {
    this.searchModel = new SearchModel();
    this.getList();
  }

  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
}
