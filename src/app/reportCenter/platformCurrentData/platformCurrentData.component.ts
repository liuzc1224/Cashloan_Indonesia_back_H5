import {Component, OnInit} from '@angular/core';
import { unixTime} from '../../format';
import {Response} from '../../share/model/reponse.model';
import {TranslateService} from '@ngx-translate/core';
import {channelDataService} from '../../service/report/channelData.service';

let __this;

@Component({
  selector: 'platform-current-data',
  templateUrl: './platformCurrentData.component.html',
  styleUrls: ['./platformCurrentData.component.less']
})
export class platformCurrentDataComponent implements OnInit {

  constructor( 
    private translateSer : TranslateService ,
    private service : channelDataService ,
    ) {};
  languagePack : Object ;
  PlatformHistory : Object={};
  nowTime : string=unixTime(new Date());
  ngOnInit() {
    __this = this;
    this.getLanguage();
    this.getPlatformHistory();
    setInterval(()=>{
      this.nowTime=unixTime(new Date());
    },1000)
  };
  getLanguage(){
    this.translateSer.stream(["reportModule.platformCurrentData","common"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['reportModule.platformCurrentData'],
          };
          // this.initialTable();
        }
      )
  };
  getPlatformHistory(){//end=2019-9-29 10:37:14
    let time=new Date()
    let data={"end":time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()}
    // console.dir(data)
    this.service.getPlatformHistory(data)
      .subscribe(
        ( res : Response ) => {
          this.PlatformHistory=res.data;
          console.log(this.PlatformHistory)
        }
      );
  };

}
