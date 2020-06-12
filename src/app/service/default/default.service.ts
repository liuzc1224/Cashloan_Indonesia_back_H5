import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class DetaultService {
  constructor(private http: HttpClient) {}

  history() {
    const url = GLOBAL.API.default.history;

    return this.http.get(url);
  }

  lasttest() {
    const url = GLOBAL.API.default.lastest;

    return this.http.get(url);
  }

  today() {
    const url = GLOBAL.API.default.today;

    return this.http.get(url);
  }

  refreshToday() {
    const url = GLOBAL.API.default.refreshToday;

    return this.http.get(url);
  }
}
