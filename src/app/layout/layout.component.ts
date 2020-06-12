import { Component, OnInit } from '@angular/core';
import { fixZero } from '../share/tool'
import { SessionStorageService } from '../service/storage';
import { Router } from '@angular/router'
import { RiskListService } from '../service/risk';
import { Response } from '../share/model/reponse.model';
let __this;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
})
export class LayoutComponent implements OnInit {

  constructor(
    private sgo: SessionStorageService,
    private router: Router,
    private service: RiskListService
  ) { }

  isCanSign: boolean = false;
  signStatus: any = 'noSign';
  permission: boolean = false;
  ngOnInit() {
    const now = new Date();

    this.currentDate = now.getFullYear() + "-" + fixZero((now.getMonth() + 1)) + "-" + fixZero(now.getDate());

    this.currentTime = fixZero(now.getHours()) + " : " + fixZero(now.getMinutes()) + " : " + fixZero(now.getSeconds());

    // this.initSingStatus();


    // setTimeout(() => {
    //   let menuData = this.sgo.get("menuData");
    //
    //   menuData.forEach((item, idx) => {
    //     if (item.url === '/risk') {
    //       item['children'].forEach(list => {
    //         if (list['menuDescriptions'][0]['description'] === '签到') {
    //           this.permission = true;
    //         }
    //       });
    //     }
    //   });
    //
    // }, 1000);

    setInterval(() => {
      const date = new Date();

      this.currentTime = fixZero(date.getHours()) + " : " + fixZero(date.getMinutes()) + " : " + fixZero(date.getSeconds());

    }, 1000);

    this.role = this.sgo.get("loginInfo")['description'];

  };

  currentDate: string;

  currentTime: string;

  logout() {

    this.sgo.clear();

    window.location.href = "./";
  };

  backToIndex() {
    this.router.navigate(['/default']);
  }

  sing() {
    this.service.riskSignIn()
      .subscribe(res => {
        if (res['success']) {
          // this.initSingStatus()
        }
      })
  }

  loginOut() {
    this.service.riskSignOut()
      .subscribe(res => {
        if (res['success']) {
          // this.initSingStatus()
        }
      })
  }
  initSingStatus() {
    this.service.riskIsSignIn()
      .subscribe((res: Response) => {
        console.log(res.data);
        if (res.data) {
          this.signStatus = res.data['signOutState'] ;
        } else {
          //未签到
          this.signStatus = 'noSign' ;
        }

      })
  }
  role: string;
};
