import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class BankSerive {
  constructor(private http: HttpClient) {}

  getList() {
    const url = GLOBAL.API.bank.list;
    return this.http.get(url);
  }

  post(data: FormData) {
    const url = GLOBAL.API.bank.add;
    return this.http.post(url, data);
  }

  update(data: FormData) {
    const url = GLOBAL.API.bank.update;
    return this.http.post(url, data);
  }

  delete(id: number) {
    const url = GLOBAL.API.bank.delete + "/" + id;
    return this.http.delete(url);
  }
}
