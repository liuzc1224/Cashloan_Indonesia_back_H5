import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { SearchModel } from "./searchModel";
import { Adaptor, ObjToArray } from "../../share/tool";
import { TableData } from "../../share/table/table.model";
import { unixTime } from "../../format";

import { RiskListService } from "../../service/risk";
import { CommonMsgService } from "../../service/msg/commonMsg.service";
import { Response } from "../../share/model/reponse.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { filter } from "rxjs/operators";
import { SessionStorageService } from "../../service/storage";
import {  reviewOrderStatustransform } from "../../format";
import {ObjToQueryString} from "../../service/ObjToQueryString";

let __this;
@Component({
  selector: "",
  templateUrl: "./riskList.component.html",
  styleUrls: ["./riskList.component.less"]
})
export class riskListComponent implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private service: RiskListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private router: Router,
    private sgo: SessionStorageService
  ) {}

  ngOnInit() {
    __this = this;

    this.getLanguage();

    this.validateForm = this.fb.group({
      orderStatus: [null, [Validators.required]],
      backName: [null, [Validators.required]],
      billNo: [null, [Validators.required]],
      account: [null, [Validators.required]],
      reamark: [null]
    });
  }

  languagePack: Object;

  statusEnum: Array<Object>;

  validateForm: FormGroup;

  userLoginInfo: Object;

  roleShowPage: boolean = true;

  creditOrderNo: string;

  roleInitPage() {
    if (this.userLoginInfo && this.userLoginInfo != "undefined") {
      this.userLoginInfo["roleOutputBOS"];
      this.userLoginInfo["roleOutputBOS"].forEach((item, index) => {
        if (item["id"] == 13) {
          this.roleShowPage = false;
          return;
        }
      });
    }
  }

  getLanguage() {
    this.translateSer
      .stream(["common", "reviewRiskList.tableModule"])
      .subscribe(data => {
        this.languagePack = {
          common: data["common"],
          data: data["reviewRiskList.tableModule"]
        };
        this.statusEnum = data["common"]["reviewOrderStatus"];

        this.userLoginInfo = this.sgo.get("loginInfo");

        this.roleInitPage();

        this.initialTable();
      });
  }

  searchModel: SearchModel = new SearchModel();
  private searchCondition: Object = {
    status: false
  };

  changeStatus(status: string) {
    this.searchModel.status = status;
    this.searchModel.currentPage = 1;
    this.getRecordList();
  }

  tableData: TableData;

  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack["data"]["applyDateStr"],
          reflect: "applyDateStr",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["creditOrderNo"],
          reflect: "creditOrderNo",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["userPhone"],
          reflect: "userPhone",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["userGrade"],
          reflect: "userGrade",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["approveAmount"],
          reflect: "approveAmountMin",
          type: "text",
          filter: item => {
            let prod = item["productDTOList"].filter(res => {
              return res["loanProductType"] == 1;
            });
            if (prod.length) {
              const approveAmountMin = prod[0]["approveAmountMin"];
              const approveAmountMax = prod[0]["approveAmountMax"];
              return `${approveAmountMin}~${approveAmountMax}`;
            } else {
              return "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["approveDate"],
          reflect: "loanDays",
          type: "text",
          filter: item => {
            let time;
            let prod = item["productDTOList"].filter(res => {
              return res["loanProductType"] == 1;
            });
            if (prod.length) {
              const loanTermMix = prod[0]["loanTermMix"];
              const loanTermMax = prod[0]["loanTermMax"];
              if (prod[0]["loanTermType"] == 2) {
                time = `${loanTermMix}~${loanTermMax}月`;
              } else {
                time = `${loanTermMix}~${loanTermMax}日`;
              }
              return time;
            } else {
              return "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["fapproveAmount"],
          reflect: "approveAmountMin",
          type: "text",
          filter: item => {
            let prod = item["productDTOList"].filter(res => {
              return res["loanProductType"] == 2;
            });
            if (prod.length) {
              const approveAmountMin = prod[0]["approveAmountMin"];
              const approveAmountMax = prod[0]["approveAmountMax"];
              return `${approveAmountMin}~${approveAmountMax}`;
            } else {
              return "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["fapproveDate"],
          reflect: "loanDays",
          type: "text",
          filter: item => {
            let time;
            let prod = item["productDTOList"].filter(res => {
              return res["loanProductType"] == 2;
            });
            if (prod.length) {
              const loanTermMix = prod[0]["loanTermMix"];
              const loanTermMax = prod[0]["loanTermMax"];
              if (prod[0]["loanTermType"] == 2) {
                time = `${loanTermMix}~${loanTermMax}月`;
              } else {
                time = `${loanTermMix}~${loanTermMax}日`;
              }
              return time;
            } else {
              return "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["approveDays"],
          reflect: "approveDays",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["approveEffectDay"],
          reflect: "approveEffectDayStr",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["approveExpDay"],
          reflect: "approveExpDayStr",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["adminName"],
          reflect: "adminName",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["creditIdea"],
          reflect: "creditIdea",
          type: "text",
          filter: item => {
            const creditIdea = item["creditIdea"];
            const creditIdeaRemark = item["creditIdeaRemark"];
            if (creditIdea == 7) {
              return creditIdeaRemark;
            } else {
              return creditIdea;
            }
          }
        },
        {
          name: __this.languagePack["data"]["status"],
          reflect: "status",
          type: "mark",
          markColor: {
            "1": "#ec971f",
            "2": "#108ee9",
            "3": "#d9534f",
            "4": "#d9534f"
          },
          filter: item => {
            const status = item["status"];
            let name = reviewOrderStatustransform(status);
            return name;
          }
        }
      ],
      loading: false,
      showIndex: true,
      btnGroup: {
        title: __this.languagePack["common"]["operate"]["name"],
        data: [
          {
            textColor: "#80accf",
            name: __this.languagePack["common"]["btnGroup"]["a"],
            // ico : "anticon anticon-pay-circle-o" ,
            showContion: {
              name: "status",
              value: [1, 2, 3, 4, 5]
            },
            bindFn: item => {
              this.sgo.set("orderInfo", item.id);
              let that = this;
              if (item.status == 1) {
                //待审核 code 为9 刷新接口
                this.service.lockOrder(item.id).subscribe((res: Response) => {
                  if (res.success) {
                    let paramData={
                      from: "riskList",
                      status: item["status"],
                      usrId: item["userId"],
                      order: item["id"],
                      applyMoney: item["applyMoney"],
                      auditMoney: item["auditMoney"],
                      orderNo: item["creditOrderNo"]
                    };
                    let para = ObjToQueryString(paramData);
                    window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");

                    // let parentName = this.sgo.get("routerInfo");
                    // this.sgo.set("routerInfo" , {
                    //   parentName :parentName.menuName,
                    //   menuName :__this.languagePack['data']['info']
                    // }) ;
                    // that.router.navigate(["/usr/auth"], {
                    //   queryParams: {
                    //     from: "riskList",
                    //     status: item["status"],
                    //     usrId: item["userId"],
                    //     order: item["id"],
                    //     applyMoney: item["applyMoney"],
                    //     auditMoney: item["auditMoney"],
                    //     orderNo: item["creditOrderNo"]
                    //   }
                    // });
                  } else {
                    that.msg.fetchFail(res.message);
                    if (res.code == 9) {
                      that.getRecordList();
                    }
                  }
                });
              } else {
                let paramData={
                  from: "riskList",
                  status: item["status"],
                  usrId: item["userId"],
                  order: item["id"],
                  applyMoney: item["applyMoney"],
                  auditMoney: item["auditMoney"],
                  orderNo: item["creditOrderNo"]
                };
                let para = ObjToQueryString(paramData);
                window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");
                // let parentName = this.sgo.get("routerInfo");
                // this.sgo.set("routerInfo" , {
                //   parentName :parentName.menuName,
                //   menuName :__this.languagePack['data']['info']
                // }) ;
                // this.router.navigate(["/usr/auth"], {
                //   queryParams: {
                //     from: "riskList",
                //     status: item["status"],
                //     usrId: item["userId"],
                //     order: item["id"],
                //     applyMoney: item["applyMoney"],
                //     auditMoney: item["auditMoney"],
                //     orderNo: item["creditOrderNo"]
                //   }
                // });
              }
            }
          },
          {
            textColor: "#80accf",
            name: __this.languagePack["common"]["btnGroup"]["reviewRecord"],
            // ico : "anticon anticon-pay-circle-o" ,
            showContion: {
              name: "status",
              value: [1, 2, 3, 4, 5]
            },
            bindFn: item => {
              this.getCreditOrderRecord(item["id"]);
              this.makeLoanMark = true;
              this.creditOrderNo = item["creditOrderNo"];
              console.log(item);
            }
          }
        ]
      }
    };
    this.getRecordList();
  }

  selectItem: object;
  totalSize: number = 0;
  makeLoanMark: boolean = false;
  noteMark: boolean = false;
  remark: string = "";
  getRecordList() {
    this.tableData.loading = true;

    let data = this.searchModel;

    let applyDateEnd = unixTime(<Date>data.applyDateEnd,"y-m-d");
    data.applyDateBegin =data.applyDateBegin ? unixTime(<Date>data.applyDateBegin,"y-m-d")+" 00:00:00" : null;
    data.applyDateEnd =
      applyDateEnd
        ? applyDateEnd + " 23:59:59"
        : null;
    let start=(new Date(data.applyDateBegin)).getTime();
    let end=(new Date(data.applyDateEnd)).getTime();
    if( start - end >0 ){
      data.applyDateBegin=null;
      data.applyDateEnd=null;
    }
    let approveEffectDayEnd = unixTime(<Date>data.approveEffectDayEnd,"y-m-d");
    data.approveEffectDayBegin =data.approveEffectDayBegin ? unixTime(<Date>data.approveEffectDayBegin,"y-m-d")+" 00:00:00" : null;
    data.approveEffectDayEnd =
      approveEffectDayEnd
        ? approveEffectDayEnd + " 23:59:59"
        : null;
    let approveStart=(new Date(data.approveEffectDayBegin)).getTime();
    let approveEnd=(new Date(data.approveEffectDayEnd)).getTime();
    if( approveStart - approveEnd >0 ){
      data.approveEffectDayBegin=null;
      data.approveEffectDayEnd=null;
    }
    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;
    if (!this.roleShowPage) {
      data.status = "1";
    }
    this.service
      .getRecordList(data)
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

          return (
            res.success === true &&
            res.data &&
            (<Array<Object>>res.data).length > 0
          );
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
    this.getRecordList();
  }

  reset() {
    this.searchModel = new SearchModel();
    this.getRecordList();
  }

  search() {
    this.searchModel.currentPage = 1;
    this.getRecordList();
  }

  exportRisk() {
    let data = this.searchModel;
    let applyDateEnd = unixTime(<Date>data.applyDateEnd,"y-m-d");
    data.applyDateBegin =data.applyDateBegin ? unixTime(<Date>data.applyDateBegin,"y-m-d")+" 00:00:00" : null;
    data.applyDateEnd =
      applyDateEnd
        ? applyDateEnd + " 23:59:59"
        : null;
    let start=(new Date(data.applyDateBegin)).getTime();
    let end=(new Date(data.applyDateEnd)).getTime();
    if( start - end >0 ){
      data.applyDateBegin=null;
      data.applyDateEnd=null;
    }
    let approveEffectDayEnd = unixTime(<Date>data.approveEffectDayEnd,"y-m-d");
    data.approveEffectDayBegin =data.approveEffectDayBegin ? unixTime(<Date>data.approveEffectDayBegin,"y-m-d")+" 00:00:00" : null;
    data.approveEffectDayEnd =
      approveEffectDayEnd
        ? approveEffectDayEnd + " 23:59:59"
        : null;
    let approveStart=(new Date(data.approveEffectDayBegin)).getTime();
    let approveEnd=(new Date(data.approveEffectDayEnd)).getTime();
    if( approveStart - approveEnd >0 ){
      data.approveEffectDayBegin=null;
      data.approveEffectDayEnd=null;
    }


    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;
    // window.location.href = 'http://10.0.52.44:8301/creditOrder/export';
    this.service.exportRisk(data).subscribe(res => {
      let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display:none");
      a.setAttribute("href", objectUrl);
      a.setAttribute("download", "风控列表");
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
  //信审记录
  recordData: Array<Object> = [];
  getCreditOrderRecord(orderId) {
    this.service
      .getCreditOrderRecord(orderId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }

          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.recordData = <Array<Object>>res.data;
      });
  }
}
