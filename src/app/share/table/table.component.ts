import { Component, Input, OnInit } from "@angular/core";
import { WritePropExpr } from "@angular/compiler";
@Component({
  selector: "c-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.less"]
})
export class TableComponent implements OnInit {
  ngOnInit() {}
  @Input()
  tableData;

  icoActive: string = "top";

  icoIndex: number;
  sortObj: Object = {};
  setUp(fn, idx, item) {
    let sort = this.sortObj[idx];

    if (sort == "top") {
      this.sortObj[idx] = "bottom";
    } else {
      this.sortObj[idx] = "top";
    }

    // if(this.icoActive == 'top'){
    // 	this.icoActive = 'bottom' ;
    // }else{
    // 	this.icoActive = 'top' ;
    // };
    // this.icoIndex = idx ;
    fn(this.sortObj[idx], item);
  }
}
