import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {dataFormat, DateObjToString, unixTime} from '../../../format';
import {CommonMsgService, MsgService} from '../../../service/msg';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage';
import {ObjToArray} from '../../../share/tool';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model';
import {RecommendService} from '../../../service/operationsCenter/recommend.service';
import {NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd';
import {injectTemplateRef} from '@angular/core/src/render3';
import {group} from '@angular/animations';

let __this;

@Component({
  selector: '',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.less']
})
export class RecommendComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg: CommonMsgService,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: RecommendService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  recommendType : Array<Object>;
  recommendState : Array<Object>;
  tableData: TableData;
  validForm : FormGroup;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  avatarUrl;
  fileList;
  loading:Boolean=false;
  ngOnInit() {
    __this = this;
    this.validForm = this.fb.group({
      "id":[null],
      "name" : [null , [Validators.required] ] ,
      "sort" : [null , [Validators.required] ] ,
      "type" : [null , [Validators.required] ],
      "recommendUrl":[null],
      "state" : [true , [Validators.required]],
      "file": [null],
      "url": [null]
    });
    this.getLanguage();
  };

  getLanguage() {
    this.translateSer.stream(['appMarketing.recommend', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['appMarketing.recommend'],
          };
          this.recommendType=this.languagePack["data"]["type"];
          this.recommendState=this.languagePack["data"]["state"];
        }
      );
    this.initialTable();
  };
  initialTable(){
    this.tableData = {
      loading:false,
      showIndex : true ,
      tableTitle : [
        {
          name : __this.languagePack['data']['table']['id'] ,
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['name'] ,
          reflect : "name" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['sort'] ,
          reflect : "sort" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['type'] ,
          reflect : "type" ,
          type : "text",
          filter:(item)=>{
            let name=this.recommendType.filter(v=>{
              return v['value']===item['type']
            });
            if(name.length>0){
              return (name && name[0]['desc']) ? name[0]['desc'] : "";
            }
          }
        },
        {
          name : __this.languagePack['data']['table']['state'] ,
          reflect : "state" ,
          type : "text",
          filter:(item)=>{
            let name=this.recommendState.filter(v=>{
              if(item.sort===-1){
                item['state']=-1;
              }
              return v['value']===item['state']
            });
            if(name.length>0){
              return (name && name[0]['desc']) ? name[0]['desc'] : "";
            }
          }
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['edit'],
            bindFn : (item) => {

              this.validForm.patchValue({
                id:item.id,
                name : item.name ,
                sort : item.sort ,
                type : item.type,
                recommendUrl: item.recommendUrl,
                state : item.state,
                file: null,
                url: item.url
              });
              this.avatarUrl = item.url;
              this.isVisible=true;
            },
            showContion: {
              name: "sort",
              value: ["!-1"]
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['delete'],
            bindFn : (item) => {
              this.isDelete=true;
              this.sgo.set('recommendId', {
                id: item.id,
              });
            },
            showContion: {
              name: "sort",
              value: ["!-1"]
            }
          }
        ]
      }
    };
    this.getList();
  }
  totalSize: number = 0;
  getList(){
    this.tableData.loading = true ;
    let data = this.searchModel;
    this.service.getRecommend(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          }
          this.tableData.loading = false;

          if (res.data && res.data['length'] === 0) {
            this.tableData.data = [];
            this.totalSize = 0 ;
          }
          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {

          let data_arr = res.data;

          this.tableData.data = (<Array<Object>>data_arr);

          this.totalSize = res.page.totalNumber;
        }
      )
  }
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  add(){
    this.avatarUrl=null;
    this.validForm.reset();
    this.validForm.patchValue({
      "sort" : this.tableData['length'] ? this.tableData['length']+1 : 1
    });
    this.isVisible=true;
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk() {
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("recommendId").id
    };
    this.service.deleteRecommend(data)
      .pipe(
        filter( (res : Response) => {
          this.isDeleteLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.isDelete=false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.validForm.reset();
    this.isVisible=false;
  }
  handleOk(){
    this.isOkLoading=true;
    let mode=this.validForm.value;
    if(!mode['name']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['name']);
      return ;
    }
    if(!mode['sort']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['sort']);
      return ;
    }
    if(!mode['type']){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['type']);
      return ;
    }
    if(mode['type']==="THIRD_PARTY_LINK"){
      if(!mode['recommendUrl']){
        this.isOkLoading = false;
        this.msg.error(this.languagePack['data']['prompt']['recommendUrl']);
        return ;
      }else{
        if(!this.IsURL(mode['recommendUrl'])){
          this.isOkLoading = false;
          this.msg.error(this.languagePack['data']['prompt']['true']);
          return ;
        }
      }
    }
    if(this.validForm.get('state').value==null){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['state']);
      return ;
    }
    if(!this.validForm.get('url').value){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['prompt']['img']);
      return ;
    }
    if(mode['id']){
      let data =new FormData();

      data.append("id",mode.id);
      data.append("name",mode.name);
      data.append("sort",mode.sort);
      data.append("type",mode.type);
      data.append("state",mode.state);
      if(mode['type']==="THIRD_PARTY_LINK"){
        data.append("recommendUrl",mode.recommendUrl);
      }
      else{
        data.append("recommendUrl","");
      }
      if(this.fileList &&　this.validForm.get('url').value){
        data.append("file",this.fileList[0]);
      }
      this.updateRecommend(data);
    }else{
      let data =new FormData();
      data.append("name",mode.name);
      data.append("sort",mode.sort);
      data.append("type",mode.type);
      data.append("state",mode.state);
      data.append("file",this.fileList[0]);
      if(mode['type']==="THIRD_PARTY_LINK"){
        data.append("recommendUrl",mode.recommendUrl);
      }
      else{
        data.append("recommendUrl","");
      }
      this.addRecommend(data);
    }
  }
  addRecommend(data){
    this.service.addRecommend(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isVisible = false;
          this.Cmsg.operateSuccess();
          this.getList();
        }
      );
  }
  updateRecommend(data){
    this.service.updateRecommend(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isVisible = false;
          this.Cmsg.operateSuccess();
          this.getList();
        }
      );
  }
  beforeUpload=(file=>{
    this.fileList =[];
    this.fileList = this.fileList.concat(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      //获取图片尺寸
      __this.avatarUrl = this.result;
      __this.validForm.patchValue({
        url : this.result
      })
    };
    console.log(file);
    return false;
  });
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    }
    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    }
    this.getList() ;
  };
  IsURL(strUrl){
    let strRegex = "^((https|http|ftp|rtsp|mms)?://)"
      + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
      + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
      + "|" // 允许IP和DOMAIN（域名）
      + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
      + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
      + "[a-z]{2,6})" // first level domain- .com or .museum
      + "(:[0-9]{1,4})?" // 端口- :80
      + "((/?)|" // a slash isn't required if there is no file name
      + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    let re=new RegExp(strRegex);
    //re.test()
    if (re.test(strUrl)){
      return (true);
    }else{
      return (false);
    }
  }
  keyupId(){
    let val=this.searchModel.id;
    if(val){
      this.searchModel.id=val.replace(/[^0-9]/g,'');
    }
  }
  num(){
    let val=this.validForm.get('sort').value;
    if(val){
      this.validForm.patchValue({
        "sort":val.replace(/[^0-9]/g,'')
      })
    }
  }
}
