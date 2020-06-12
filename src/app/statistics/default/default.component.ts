import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DetaultService } from "../../service/default/default.service";
import { Response } from "../../share/model";
import { filter } from "rxjs/operators";
import { MsgService } from "../../service/msg";
import { TranslateService } from "@ngx-translate/core";
import { dataFormat } from "../../format/index";
declare let echarts: any;
@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.less"]
})
export class defaultComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private defaultSer: DetaultService,
    private msg: MsgService,
    private transSer: TranslateService
  ) {}

  ngOnInit() {
    this.getHistory();
    this.getToday();
    this.getLang();
    // this.initChart_first() ;
  }

  hisData: Object;

  getHistory() {
    this.defaultSer
      .history()
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.error(res.message);
          }

          return res.success === true;
        })
      )
      .subscribe(res => {
        this.hisData = res.data;
      });
  }

  toDayData: Object;
  getToday() {
    this.defaultSer
      .today()
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.error(res.message);
          }

          return res.success === true;
        })
      )
      .subscribe(res => {
        this.toDayData = res.data;
      });
  }

  getLast() {
    this.defaultSer
      .lasttest()
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.error(res.message);
          }

          return res.success === true && res.data != null;
        })
      )
      .subscribe((res: Response) => {
        this.initChart_first(res.data);
      });
  }

  initChart_first(data?) {
    const chart = echarts.init(document.querySelector("#chart_fitst"));

    let text = this.languagePack;

    let dataArr = [];

    let dataBlock = {
      0: [],
      1: [],
      2: [],
      3: []
    };

    data.forEach((item, index) => {
      dataArr.push(dataFormat(item.dataOfDay, "y-m-d"));
      dataBlock[0].push(item.registerUserCount);
      dataBlock[1].push(item.withdrawDepositCount);
      dataBlock[2].push(item.withdrawDepositAmount);
      dataBlock[3].push(item.borrowUserCount);
    });
    const option = {
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: [
          text["registerUserCount"],
          text["withdrawDepositCount"],
          text["withdrawDepositAmount"],
          text["borrowUserCount"]
        ]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: dataArr
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: text["registerUserCount"],
          type: "line",
          stack: "总量",
          data: dataBlock["0"]
        },
        {
          name: text["withdrawDepositCount"],
          type: "line",
          stack: "总量",
          data: dataBlock["1"]
        },
        {
          name: text["withdrawDepositAmount"],
          type: "line",
          stack: "总量",
          data: dataBlock["2"]
        },
        {
          name: text["borrowUserCount"],
          type: "line",
          stack: "总量",
          data: dataBlock["3"]
        }
      ]
    };
    console.log(option);
    chart.setOption(option);
  }

  languagePack: Object;

  getLang() {
    this.transSer.stream(["default"]).subscribe((res: Response) => {
      let cols = res["default"]["cols"]["his"];
      this.languagePack = cols;
      this.getLast();
    });
  }

  isLoadingOne: boolean = false;

  refresh(): void {
    this.isLoadingOne = true;
    this.defaultSer.refreshToday().subscribe((res: Response) => {
      this.isLoadingOne = false;
      if (res.success) {
        this.getToday();
      } else {
        this.msg.error(res.message);
      }
    });
  }
}
