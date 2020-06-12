import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {CommonMsgService, MsgService} from '../../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model/index';
import {MemberManagementService} from '../../../service/collectionManagement/memberManagement.service';
import {CollectionBusiness} from '../../../service/collectionBusiness';
import { NzTreeNode,NzTreeNodeOptions } from 'ng-zorro-antd';
import md5 from 'js-md5';
let __this;

@Component({
  selector: '',
  templateUrl: './memberManagement.component.html',
  styleUrls: ['./memberManagement.component.less']
})
export class MemberManagementComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: MemberManagementService,
    private CollectionBusiness:CollectionBusiness
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  tableData: TableData;
  chType:number=1;
  weights:Array<number>=[1,2,3,4,5,6,7,8,9,10];
  managementType : Array<string>;
  isPersonnel : Boolean=false;
  isGroup : Boolean=false;
  isCompany : Boolean=false;
  personnelForm: FormGroup;
  groupForm: FormGroup;
  companyForm: FormGroup;
  personnelLoading:Boolean=false;
  groupLoading:Boolean=false;
  companyLoading:Boolean=false;
  allOverdueFirm : Array<Object>;
  allOverdueGroup : Array<Object>;
  NzTreeNode : NzTreeNode[];
  NzTreeNodes : NzTreeNode[];
  allStage : Array<Object>;
  personnelTitle: string="";
  groupTitle: string="";
  companyTitle: string="";
  groupType : string="";
  personnelDisabled : Boolean=false;
  groupDisabled : Boolean=false;
  companyDisabled : Boolean=false;
  ngOnInit() {
    __this = this;
    this.getLanguage();
    //人员
    this.personnelForm= this.fb.group({
      "id" : [null] ,
      "staffName" : [null , [Validators.required] ] ,
      "phonenumer" : [null , [Validators.required] ] ,
      "groupId" : [null , [Validators.required] ] ,
      "weight" : [null] ,
      "username" : [null , [Validators.required] ] ,
      "password" : [null ] ,
      "recallPhone" : [null , [Validators.required] ] ,
      "recallPhonePassword" : [null ] ,
      "status" : [null , [Validators.required] ] ,
      "releaseCase" : [null , [Validators.required] ]
    });
    //小组
    this.groupForm= this.fb.group({
      "id" : [null] ,
      "groupType" : [null , [Validators.required] ] ,
      "groupName" : [null , [Validators.required] ] ,
      "groupDescription" : [null] ,
      "firmId" : [null , [Validators.required] ] ,
      "stageId" : [null , [Validators.required] ] ,
      "loanProductTypeList" : [null , [Validators.required] ] ,
      "weight" : [null] ,
      "status" : [null , [Validators.required] ] ,
      "releaseCase" : [null]
    });
    //公司
    this.companyForm= this.fb.group({
      "id" : [null] ,
      "firmName" : [null , [Validators.required] ] ,
      "firmIntroduction" : [null] ,
      "firmType" : [null , [Validators.required] ] ,
      "status" : [null , [Validators.required] ] ,
      "releaseCase" : [null , [Validators.required] ]
    });
    this.getAllOverdueFirm();
    this.getAllOverdueGroup();
    this.getStage();
    this.getAllGroup();
  };
  getAllOverdueFirm(){
    this.service.getAllOverdueFirm()
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allOverdueFirm = (< Array<Object> >res.data).filter(item=>{
            return item['status']==2;
          });
        }
      );
  };
  getAllOverdueGroup(){

    let $this=this;
    this.service.getAllOverdueGroup()
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allOverdueGroup=(< Array<Object> >res.data);
          let arr=[];
          this.allOverdueGroup.map(item=>{
            if(!arr.includes(item['firmName'])){
              arr.push(item['firmName']);
            }
          });
          let node = new Array<NzTreeNode>();
          for (let v of arr) {
            let children = new Array<NzTreeNodeOptions>();
            let a=this.allOverdueGroup.filter(item=>{
              return item['firmName']==v;
            });
            for (let child of a) {
              children.push(
                {
                  title: child['groupName'],
                  key: child['id'],
                  isLeaf:true
                }
              )
            }
            node.push(new NzTreeNode({
              title: v,
              key: null,
              disabled:true,
              children:children
            }));
          }
          $this.NzTreeNode=node;
        }
      );
  };


  getAllGroup(){
    let $this=this;
    this.service.getAllOverdueGroup()
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allOverdueGroup=(< Array<Object> >res.data);
          let arr=[];
          this.allOverdueGroup.map(item=>{
            if(!arr.includes(item['firmName'])){
              arr.push(item['firmName']);
            }
          });
          let node = new Array<NzTreeNode>();
          for (let v of arr) {
            let children = new Array<NzTreeNodeOptions>();
            let a=this.allOverdueGroup.filter(item=>{
              return item['firmName']==v;
            });
            for (let child of a) {
              children.push(
                {
                  title: child['groupName'],
                  key: child['id'],
                  isLeaf:true
                }
              )
            }
            node.push(new NzTreeNode({
              title: v,
              key: null,
              disabled:true,
              children:children
            }));
          }
          $this.NzTreeNodes=node;
        }
      );
  };



  getStage(){
    let data={
      isPage:false
    };
    this.CollectionBusiness.getData(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allStage = (< Array<Object> >res.data).filter(item=>{
            return item['state'] == "ACTIVATE" ;
          });
        }
      );
  }
  changeStatus(data){
    this.chType=data;
    this.getAllOverdueFirm();
    this.getAllOverdueGroup();
    this.getStage();
    this.getAllGroup();
    this.initialTable();
  }
  getLanguage() {
    this.translateSer.stream(['collectionManagement.management', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['collectionManagement.management'],
            personnel:data['collectionManagement.management']["personnel"],
            group:data['collectionManagement.management']["group"],
            company:data['collectionManagement.management']["company"],
          };
          this.personnelTitle = this.languagePack["data"]["personnelAdd"];
          this.groupTitle = this.languagePack["data"]["groupAdd"];
          this.companyTitle = this.languagePack["data"]["companyAdd"];
          this.managementType=this.languagePack["data"]["managementType"];
          this.initialTable();
        }
      );
  };
  initialTable(){
    if(this.chType==1){
      this.initPersonnel();
    }
    if(this.chType==2){
      this.initGroup();
    }
    if(this.chType==3){
      this.initCompany();
    }
  }
  //催收人员
  initPersonnel() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['personnel']['id'],
          reflect: 'id',
          type: 'text'
        },
        {
          name: __this.languagePack['personnel']['name'],
          reflect: 'staffName',
          type: 'text'
        },
        {
          name: __this.languagePack['personnel']['phoneNumber'],
          reflect: 'phonenumer',
          type: 'text',
        },
        {
          name: __this.languagePack['personnel']['group'],
          reflect: 'groupName',
          type: 'text',
        },
        {
          name: __this.languagePack['personnel']['groupType'],
          reflect: 'groupType',
          type: 'text',
          filter : ( item ) => {
            let firmType = item['groupType'] ;
            const map = __this.languagePack['data']['personnelType'] ;
            let name = map.filter( item => {
              return item.value == firmType ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        },
        {
          name: __this.languagePack['personnel']['company'],
          reflect: 'firmName',
          type: 'text',
        },
        {
          name: __this.languagePack['data']['model']['recallPhone'],
          reflect: 'recallPhone',
          type: 'text',
        },
        {
          name: __this.languagePack['personnel']['stage'],
          reflect: 'stageName',
          type: 'text'
        },
        {
          name: __this.languagePack['personnel']['weights'],
          reflect: 'weight',
          type: 'text'
        },
        {
          name: __this.languagePack['personnel']['status'],
          reflect: 'status',
          type: 'text',
          filter : ( item ) => {
            let status = item['status'] ;
            const map = __this.languagePack['data']['status1'] ;
            let name = map.filter( item => {
              return item.value == status ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        },
        {
          name: __this.languagePack['personnel']['freed'],
          reflect: 'releaseCase',
          type: 'text',
          filter : ( item ) => {
            let releaseCase = item['releaseCase'] ;
            const map = __this.languagePack['data']['freed'] ;
            let name = map.filter( item => {
              return item.value == releaseCase ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        }
      ],
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [{
          textColor: '#0000ff',
          name: __this.languagePack['common']['operate']['edit'],
          bindFn: (item) => {
            this.personnelForm.reset();
            this.personnelTitle = this.languagePack["data"]["personnelEdit"];
            this.personnelForm.patchValue({
              "id" : item.id ,
              "staffName" : item.staffName ,
              "phonenumer" : item.phonenumer ,
              "groupId" : item.groupId ,
              "weight" : item.weight ,
              "username" : item.username ,
              "password" : item.password ,
              "recallPhone" : item.recallPhone ,
              "recallPhonePassword" : item.recallPhonePassword ,
              "status" : item.status ,
              "releaseCase" : item.releaseCase
            });
            this.isPersonnel=true;
          }
        }]
      }
    };
    this.getList();
  }
  //催收小组
  initGroup() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['group']['id'],
          reflect: 'id',
          type: 'text'
        },
        {
          name: __this.languagePack['group']['name'],
          reflect: 'groupName',
          type: 'text'
        },
        {
          name: __this.languagePack['group']['introduction'],
          reflect: 'groupDescription',
          type: 'text',
        },
        {
          name: __this.languagePack['group']['company'],
          reflect: 'firmName',
          type: 'text',
        },
        {
          name: __this.languagePack['group']['type'],
          reflect: 'groupType',
          type: 'text',
          filter : ( item ) => {
            let firmType = item['groupType'] ;
            const map = __this.languagePack['data']['personnelType'] ;
            let name = map.filter( item => {
              return item.value == firmType ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        },
        {
          name: __this.languagePack['group']['stage'],
          reflect: 'stageName',
          type: 'text',
        },
        {
          name: __this.languagePack['group']['weights'],
          reflect: 'weight',
          type: 'text',
        },
        {
          name: __this.languagePack['group']['status'],
          reflect: 'status',
          type: 'text',
          filter : ( item ) => {
            let status = item['status'] ;
            const map = __this.languagePack['data']['status'] ;
            let name = map.filter( item => {
              return item.value == status ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        },
        {
          name: __this.languagePack['group']['freed'],
          reflect: 'releaseCase',
          type: 'text',
          filter : ( item ) => {
            let releaseCase = item['releaseCase'] ;
            const map = __this.languagePack['data']['freed'] ;
            let name = map.filter( item => {
              return item.value == releaseCase ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        }
      ],
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [{
          textColor: '#0000ff',
          name: __this.languagePack['common']['operate']['edit'],
          bindFn: (item) => {
            this.groupForm.reset();
            this.groupTitle = this.languagePack["data"]["groupEdit"];
            let arr=[];
            if(item.loanProductTypeList.split("_").length>0){
              item.loanProductTypeList.split("_").forEach(v=>{
                arr.push(v-0);
              })
            };
            this.groupForm.patchValue({
              "id" : item.id ,
              "groupType" : item.groupType ,
              "groupName" : item.groupName ,
              "groupDescription" : item.groupDescription ,
              "firmId" : item.firmId ,
              "stageId" : item.stageId ,
              "loanProductTypeList" : Array.from(new Set(arr)),
              "weight" : item.weight ,
              "status" : item.status ,
              "releaseCase" : item.releaseCase
            });
            console.log( this.groupForm);
            this.isGroup=true;
          }
        }]
      }
    };
    this.getList();
  }
  //催收公司
  initCompany(){
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['company']['id'],
          reflect: 'id',
          type: 'text'
        },
        {
          name: __this.languagePack['company']['name'],
          reflect: 'firmName',
          type: 'text'
        },
        {
          name: __this.languagePack['company']['introduction'],
          reflect: 'firmIntroduction',
          type: 'text'
        },
        {
          name: __this.languagePack['company']['type'],
          reflect: 'firmType',
          type: 'text',
          filter : ( item ) => {
            let firmType = item['firmType'] ;
            const map = __this.languagePack['data']['type'] ;
            let name = map.filter( item => {
              return item.value == firmType ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        },
        {
          name: __this.languagePack['company']['status'],
          reflect: 'status ',
          type: 'text',
          filter : ( item ) => {
            let status = item['status'] ;
            const map = __this.languagePack['data']['status1'] ;
            let name = map.filter( item => {
              return item.value == status ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        },
        {
          name: __this.languagePack['company']['freed'],
          reflect: 'releaseCase ',
          type: 'text',
          filter : ( item ) => {
            let releaseCase = item['releaseCase'] ;
            const map = __this.languagePack['data']['freed'] ;
            let name = map.filter( item => {
              return item.value == releaseCase ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        }
      ],
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [{
          textColor: '#0000ff',
          name: __this.languagePack['common']['operate']['edit'],
          bindFn: (item) => {
            this.companyForm.reset();
            this.companyTitle = this.languagePack["data"]["companyEdit"];
            this.companyForm.patchValue({
              "id" : item.id ,
              "firmName" : item.firmName ,
              "firmIntroduction" : item.firmIntroduction ,
              "firmType" : item.firmType ,
              "status" : item.status ,
              "releaseCase" : item.releaseCase
            });
            this.isCompany=true;
          }
        }]
      }
    };
    this.getList();
  }

  totalSize: number = 0;

  getList(){
    this.tableData.loading = true ;
    if(this.chType==1){
      let model=this.searchModel;
      let data ={
        groupId: model.groupId,
        groupType: model.groupType,
        firmId: model.firmId,
        stageId: model.stageId,
        status: model.status,
        staffName: model.staffName,
        phonenumer: model.phonenumer,
        currentPage:model.currentPage,
        pageSize:model.pageSize,
      };
      this.service.queryOverdueStaff(data)
        .pipe(
          filter( (res : Response) => {

            this.tableData.loading = false ;
            if(res.success === false){
              this.Cmsg.fetchFail(res.message) ;
            };
            return res.success === true;
          })
        )
        .subscribe(
          ( res : Response ) => {
            this.tableData.data = (< Array<Object> >res.data);
            if(res.page){
              this.totalSize = res.page["totalNumber"] || 0;
            }else{
              this.totalSize = 0;
            }
          }
        );
    }
    if(this.chType==2){
      let model=this.searchModel;
      let data ={
        firmId: model.firmId,
        status: model.status,
        stageId: model.stageId,
        groupType: model.groupType,
        groupName :model.groupName,
        currentPage:model.currentPage,
        pageSize:model.pageSize,
        columns:['id'],
        orderBy:[false]
      };
      this.service.queryOverdueGroup(data)
        .pipe(
          filter( (res : Response) => {

            this.tableData.loading = false ;
            if(res.success === false){
              this.Cmsg.fetchFail(res.message) ;
            };
            return res.success === true;
          })
        )
        .subscribe(
          ( res : Response ) => {
            this.tableData.data = (< Array<Object> >res.data);
            if(res.page){
              this.totalSize = res.page["totalNumber"] || 0;
            }else{
              this.totalSize = 0;
            }
          }
        );
    }
    if(this.chType==3){
      let model=this.searchModel;
      let data ={
        firmType: model.firmType,
        status: model.status,
        firmName: model.firmName,
        currentPage:model.currentPage,
        pageSize:model.pageSize,
      };
      this.service.queryOverdueFirm(data)
        .pipe(
          filter( (res : Response) => {

            this.tableData.loading = false ;
            if(res.success === false){
              this.Cmsg.fetchFail(res.message) ;
            }
            return res.success === true;
          })
        )
        .subscribe(
          ( res : Response ) => {
            this.tableData.data = (< Array<Object> >res.data);
            if(res.page){
              this.totalSize = res.page["totalNumber"] || 0;
            }else{
              this.totalSize = 0;
            }
          }
        );
    }
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    }
    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    }
    this.getList() ;
  };
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  };
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  personnelOk(){
    let valid = this.personnelForm.valid;
    if (!valid) {
      this.personnelLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }
    if((this.groupType != '催收管理岗') && (this.personnelForm.value.weight == null)) {
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }
    let postData = this.personnelForm.value;
    postData["username"]+="";
    // postData["password"]=md5(postData["password"]);
    if(postData["id"]){
      this.updatePersonnel(postData);
    }else{
      this.addPersonnel(postData);
    }
  }
  updatePersonnel(data){
    this.personnelLoading=true;
    this.service.updateOverdueStaff(data)
      .pipe(
        filter( (res : Response) => {
          this.personnelLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isPersonnel = false;
          this.getList();
        }
      );
  }
  addPersonnel(data){
    if (!this.personnelForm.value['password']) {
      this.personnelLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }
    this.personnelLoading=true;

    this.service.addOverdueStaff(data)
      .pipe(
        filter( (res : Response) => {
          this.personnelLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isPersonnel = false;
          this.getList();
        }
      );
  }
  personnelCancel(){
    this.personnelForm.reset();
    this.isPersonnel=false;
  }

  groupOk(){
    let valid = this.groupForm.valid;
    if (!valid) {
      this.groupLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }
    let postData = this.groupForm.value;
    let data={};
    if(this.groupForm.value['groupType']==1){
      if (!this.groupForm.value['releaseCase']) {
        this.groupLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      }
      if (!this.groupForm.value['weight']) {
        this.groupLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      }
      data={
        "id" : postData['id'] ,
        "groupType" : postData['groupType'] ,
        "groupName" : postData['groupName'] ,
        "groupDescription" : postData['groupDescription'] ,
        "firmId" : postData['firmId'] ,
        "stageId" : postData['stageId'] ,
        "loanProductTypeList" : postData['loanProductTypeList'].join("_"),
        "weight" : postData['weight'] ,
        "status" : postData['status'] ,
        "releaseCase" : postData['releaseCase'] ,
      }
    }
    if(this.groupForm.value['groupType']==2){
      data={
        "id" : postData['id'] ,
        "groupType" : postData['groupType'] ,
        "groupName" : postData['groupName'] ,
        "groupDescription" : postData['groupDescription'] ,
        "firmId" : postData['firmId'] ,
        "stageId" : postData['stageId'] ,
        "loanProductTypeList" : postData['loanProductTypeList'].join("_"),
        "weight" : null ,
        "status" : postData['status'] ,
        "releaseCase" : null ,
      }
    }
    if(postData["id"]){
      this.updateGroup(data);
    }else{
      this.addGroup(data);
    }
    this.getAllOverdueGroup();
  }
  updateGroup(data){
    this.groupLoading=true;
    this.service.updateOverdueGroup(data)
      .pipe(
        filter( (res : Response) => {
          this.groupLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isGroup = false;
          this.getList();
        }
      );
  }
  addGroup(data){
    this.groupLoading=true;
    this.service.addOverdueGroup(data)
      .pipe(
        filter( (res : Response) => {
          this.groupLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isGroup = false;
          this.getList();
        }
      );
  }
  groupCancel(){
    this.groupForm.reset();
    this.isGroup=false;
  }

  companyOk(){
    let valid = this.companyForm.valid;
    if (!valid) {
      this.companyLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }

    let postData = this.companyForm.value;
    if(postData["id"]){
      this.updateCompany(postData);
    }else{
      this.addCompany(postData);
    }
    this.getAllOverdueFirm();
  }
  updateCompany(data){
    this.companyLoading=true;
    this.service.updateOverdueFirm(data)
      .pipe(
        filter( (res : Response) => {
          this.companyLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isCompany = false;
          this.getList();
        }
      );
  }
  addCompany(data){
    this.companyLoading=true;
    this.service.addOverdueFirm(data)
      .pipe(
        filter( (res : Response) => {
          this.companyLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isCompany = false;
          this.getList();
        }
      );
  }
  companyCancel(){
    this.companyForm.reset();
    this.isCompany=false;
  }
  personnel(){
    this.personnelForm.reset();
    this.groupType='';
    this.isPersonnel=true;
    this.personnelTitle = this.languagePack["data"]["personnelAdd"];
  }
  group(){
    this.groupForm.reset();
    this.isGroup=true;
    this.groupTitle = this.languagePack["data"]["groupAdd"];
  }
  company(){
    this.companyForm.reset();
    this.isCompany=true;
    this.companyTitle = this.languagePack["data"]["companyAdd"];
  }
  groupSelect(data){
    // let groupId=this.personnelForm.value.groupId;
    if(data){
      let allOverdueGroup=this.allOverdueGroup;
      const map = __this.languagePack['data']['personnelType'] ;
      let name = allOverdueGroup.filter( item => {
        return item['id'] == data ;
      });
      if(name){
        let type = map.filter( item => {
          return item.value == name[0]['groupType'] ;
        });
        this.groupType= type[0] && type ? type[0].desc : '';
      }
    }else{
      this.groupType="";
    }

  }
  personnelStatus($event){
    console.log($event);
    if($event==2){
      this.personnelDisabled=true;
      this.personnelForm.patchValue({
        releaseCase: 2
      })
    }else{
      this.personnelDisabled=false;
    }
  }
  groupStatus($event){
    if(this.groupForm.get('groupType').value==1){
      if($event==2){
        this.groupDisabled=true;
        this.groupForm.patchValue({
          releaseCase: 2
        })
      }else{
        this.groupDisabled=false;
      }
    }
  }
  companyStatus($event){
    console.log($event);
    if($event==2){
      this.companyDisabled=true;
      this.companyForm.patchValue({
        releaseCase: 2
      })
    }else{
      this.companyDisabled=false;
    }
  }
}
