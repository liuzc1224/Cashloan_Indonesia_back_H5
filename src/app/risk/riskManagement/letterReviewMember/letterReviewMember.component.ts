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
import {RiskReviewService} from '../../../service/risk';
import { NzTreeNode,NzTreeNodeOptions } from 'ng-zorro-antd';
let __this;

@Component({
  selector: '',
  templateUrl: './letterReviewMember.component.html',
  styleUrls: ['./letterReviewMember.component.less']
})
export class LetterReviewMemberComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: RiskReviewService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  tableData: TableData;
  chType:number=1;
  managementType : Array<string>;
  isPersonnel : Boolean=false;
  isGroup : Boolean=false;
  isCompany : Boolean=false;
  personnelForm: FormGroup;
  groupForm: FormGroup;
  companyForm: FormGroup;
  personnelLoading:Boolean=false;
  passwordValue:Boolean=false;
  groupLoading:Boolean=false;
  companyLoading:Boolean=false;
  allOverdueFirm;
  allOverdueFirmEdit;
  allOverdueGroup : Array<Object>;
  NzTreeNode : NzTreeNode[];
  NzTreeNodes : NzTreeNode[];
  allStage;
  allStageEdit;
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
      "phonenumber" : [null , [Validators.required] ] ,
      "groupId" : [null , [Validators.required] ] ,
      "username" : [null , [Validators.required] ] ,
      "password" : [null] ,
      "recallPhone" : [null] ,
      "recallPhonePassword" : [null] ,
      "status" : [null , [Validators.required] ] ,
      "releaseCase" : [null],
      "authority" : [null , [Validators.required] ],
    });
    //小组
    this.groupForm= this.fb.group({
      "id" : [null] ,
      "productTypeList" : [[] , [Validators.required] ] ,
      "groupName" : [null , [Validators.required] ] ,
      "groupDescription" : [null] ,
      "firmId" : [null , [Validators.required] ] ,
      "stageId" : [null , [Validators.required] ] ,
      "status" : [null , [Validators.required] ] ,
      "releaseCase" : [null]
    });
    //公司
    this.companyForm= this.fb.group({
      "id" : [null] ,
      "firmName" : [null , [Validators.required] ] ,
      "firmIntroduction" : [null] ,
      "firmType" : [null , [Validators.required] ] ,
      "status" : [null , [Validators.required] ]
    });
    // this.getAllOverdueFirm();
    // this.getAllOverdueGroup();
    // this.getStage();
    // this.getAllGroup();
  };
  getAllOverdueFirm(){
    this.service.getAllCreditReviewFirm()
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
            return item['status']==1;
          });
          this.allOverdueFirmEdit = (< Array<Object> >res.data).filter(item=>{
            return item['status']==1;
          });
          let obj=[{
            firmName:this.languagePack['common']['all'],
            id:""
          }];
          this.allOverdueFirm=obj.concat(this.allOverdueFirm);
        }
      );
  };
  getAllGroup(){
    let $this=this;
    this.service.getAllCreditReviewGroup()
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
            if(!arr.includes(item['firmId'])){
              arr.push(item['firmId']);
            }
          });
          console.log(arr);
          let node = new Array<NzTreeNode>();
          for (let v of arr) {
            let children = new Array<NzTreeNodeOptions>();
            let a=this.allOverdueGroup.filter(item=>{
              return item['firmId']==v;
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
            let name=this.allOverdueFirm.filter(aa=>{
              return aa['id']==v
            });
            let firmName=name && name[0] && name[0]['firmName'] ? name[0]['firmName'] : 0;
            node.push(new NzTreeNode({
              title: firmName,
              key: null,
              disabled:true,
              children:children
            }));
          }
          $this.NzTreeNodes=node;
        }
      );
  };
  getAllCreditReviewGroup(){
    let $this=this;
    this.service.getAllCreditReviewGroup()
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
          this.allOverdueGroup=(< Array<Object> >res.data).filter(v=>{
            return v['status']==1
          });
          let arr=[];
          this.allOverdueGroup.map(item=>{
            if(!arr.includes(item['firmId'])){
              arr.push(item['firmId']);
            }
          });
          console.log(arr);
          let node = new Array<NzTreeNode>();
          for (let v of arr) {
            let children = new Array<NzTreeNodeOptions>();
            let a=this.allOverdueGroup.filter(item=>{
              return item['firmId']==v;
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
            let name=this.allOverdueFirm.filter(aa=>{
              return aa['id']==v
            });
            let firmName=name && name[0] && name[0]['firmName'] ? name[0]['firmName'] : 0;
            node.push(new NzTreeNode({
              title: firmName,
              key: null,
              disabled:true,
              children:children
            }));
          }
          $this.NzTreeNode=node;
        }
      );
  };


  getStage(){
    let data={
      type:1
    };
    this.service.getReview(data)
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
            return item['status'] == 1 ;
          });
          this.allStageEdit = (< Array<Object> >res.data).filter(item=>{
            return item['status'] == 1 ;
          });
          let obj=[{
            flowName:this.languagePack['common']['all'],
            id:""
          }];
          this.allStage=obj.concat(this.allStage);
        }
      );
  }
  changeStatus(data){
    this.chType=data;
    // this.getStage();
    // this.getAllGroup();
    this.initialTable();
  }
  getLanguage() {
    this.translateSer.stream(['letterReviewMember', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['letterReviewMember'],
            personnel:data['letterReviewMember']["personnel"],
            group:data['letterReviewMember']["group"],
            company:data['letterReviewMember']["company"],
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
    this.searchModel = new SearchModel();
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
          reflect: 'phonenumber',
          type: 'text',
        },
        {
          name: __this.languagePack['personnel']['group'],
          reflect: 'groupId',
          type: 'text',
          filter : ( item ) => {
            let groupId = item['groupId'] ;
            const map = __this.allOverdueGroup ;
            let name = map.filter( item => {
              return item.id == groupId ;
            });
            return (name.length>0 && name[0].groupName ) ? name[0].groupName : "" ;
          }
        },
        {
          name: __this.languagePack['personnel']['stage'],
          reflect: 'stageId',
          type: 'text',
          filter : ( item ) => {
            let stageId = item['stageId'] ;
            const map = __this.allStage ;
            if(map){
              let name = map.filter( item => {
                return item.id == stageId ;
              });
              return (name.length>0 && name[0].flowName ) ? name[0].flowName : "" ;
            }

          }
        },
        {
          name: __this.languagePack['personnel']['company'],
          reflect: 'firmName',
          type: 'text',
        },
        {
          name: __this.languagePack['personnel']['companyType'],
          reflect: 'firmType',
          type: 'text',
          filter : ( item ) => {
            let firmType = item['firmType'] ;
            const map = __this.languagePack['data']['companyType'] ;
            let name = map.filter( item => {
              return item.value == firmType ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        },
        {
          name: __this.languagePack['personnel']['permission'],
          reflect: 'authority',
          type: 'text',
          filter : ( item ) => {
            if (item['authority'] != null) {
              let authority = item['authority'].split('_');
              const map = __this.languagePack['data']['permissions'];
              let str = "";
              authority.forEach(v => {
                let name = map.filter(item => {
                  return item.value == v;
                });
                str = (name.length > 0 && name[0].desc) ? str + ',' + name[0].desc : ""
              });

              return str.substring(1);
            }
          }
        },
        {
          name: __this.languagePack['personnel']['status'],
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
              "phonenumber" : item.phonenumber ,
              "groupId" : item.groupId ,
              "authority" : item.authority ? item.authority.split('_') : null ,
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
          reflect: 'firmId',
          type: 'text',
          filter : ( item ) => {
            let firmId = item['firmId'] ;
            const map = __this.allOverdueFirm ;
            let name = map.filter( item => {
              return item.id == firmId ;
            });
            return (name.length>0 && name[0].firmName ) ? name[0].firmName : "" ;
          }
        },
        {
          name: __this.languagePack['group']['stage'],
          reflect: 'stageId',
          type: 'text',
          filter : ( item ) => {
            let stageId = item['stageId'] ;
            const map = __this.allStage ;
            if(map){
              let name = map.filter( item => {
                return item.id == stageId ;
              });
              return (name.length>0 && name[0].flowName ) ? name[0].flowName : "" ;
            }

          }
        },
        {
          name: __this.languagePack['group']['productTypes'],
          reflect: 'productType',
          type: 'text',
          filter : ( item ) => {
            if(item['productType']!=null){
              let productType = item['productType'].split('_') ;
              const map = __this.languagePack['data']['productTypes'] ;
              let str="";
              productType.forEach(v=>{
                let name = map.filter( item => {
                  return item.value == v ;
                });
                str=(name.length>0 && name[0].desc ) ? str+','+name[0].desc : ""
              });

              return str.substring(1) ;
            }

          }
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
            this.groupForm.patchValue({
              "id" : item.id ,
              "productTypeList" : item.productType.split('_') ,
              "groupName" : item.groupName ,
              "groupDescription" : item.groupDescription ,
              "firmId" : item.firmId ,
              "stageId" : item.stageId ,
              "status" : item.status ,
              "releaseCase" : item.releaseCase
            });
            console.log(this.groupForm.value)
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
          name: __this.languagePack['company']['companyType'],
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
            const map = __this.languagePack['data']['status'] ;
            let name = map.filter( item => {
              return item.value == status ;
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
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  totalSize: number = 0;

  getList(){
    this.tableData.loading = true ;
    if(this.chType==1){
      this.getStage();
      this.getAllOverdueFirm();
      this.getAllCreditReviewGroup();
      this.getAllGroup();
      let model=this.searchModel;
      let data ={
        groupId: model.groupId,
        firmType: model.firmType,
        firmId: model.firmId,
        stageId: model.stageId,
        status: model.status,
        staffName: model.staffName,
        phonenumber: model.phonenumber,
        currentPage:model.currentPage,
        pageSize:model.pageSize,
      };
      this.service.queryCreditReviewStaff(data)
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
      this.getStage();
      this.getAllOverdueFirm();
      this.getAllGroup();
      let model=this.searchModel;
      let data ={
        firmId: model.firmId,
        status: model.status,
        stageId: model.stageId,
        groupType: model.groupType,
        id: model.id,
        groupName :model.groupName,
        currentPage:model.currentPage,
        pageSize:model.pageSize,
      };
      this.service.queryCreditReviewGroup(data)
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
      this.getStage();
      let model=this.searchModel;
      let data ={
        firmType: model.firmType,
        status: model.status,
        firmName: model.firmName,
        currentPage:model.currentPage,
        pageSize:model.pageSize,
      };
      this.service.queryCreditReviewFirm(data)
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
  personnelOk(){
    let valid = this.personnelForm.valid;
    let postData = this.personnelForm.value;
    if (!valid) {
      this.personnelLoading = false;
      for (const i in this.personnelForm.controls) {
        this.personnelForm.controls[i].markAsDirty();
        this.personnelForm.controls[i].updateValueAndValidity();
      }
      if(!postData['id'] && !postData['password']){
        this.passwordValue=true;
      }else{
        this.passwordValue=false;
      }
      return;
    }

    postData["username"]+="";
    postData["authority"]=postData['authority'].join('_');
    console.log(postData)
    if(postData["id"]){
      this.updatePersonnel(postData);
    }else{
      this.addPersonnel(postData);
    }
  }
  updatePersonnel(data){
    this.personnelLoading=true;
    this.service.updateCreditReviewStaff(data)
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

    this.service.addCreditReviewStaff(data)
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
      for (const i in this.groupForm.controls) {
        this.groupForm.controls[i].markAsDirty();
        this.groupForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    let postData = this.groupForm.value;
    let data={
      "id" : postData['id'] ,
      "productTypeList" : postData['productTypeList'] ,
      "groupName" : postData['groupName'] ,
      "groupDescription" : postData['groupDescription'] ,
      "firmId" : postData['firmId'] ,
      "stageId" : postData['stageId'] ,
      "status" : postData['status'] ,
      "releaseCase" : postData['releaseCase']
    };
    if(postData["id"]){
      this.updateGroup(data);
    }else{
      this.addGroup(data);
    }
    this.getAllGroup();
  }
  updateGroup(data){
    this.groupLoading=true;
    this.service.updateCreditReviewGroup(data)
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
    this.service.addCreditReviewGroup(data)
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
      for (const i in this.companyForm.controls) {
        this.companyForm.controls[i].markAsDirty();
        this.companyForm.controls[i].updateValueAndValidity();
      }
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
    this.service.updateCreditReviewFirm(data)
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
    this.service.addCreditReviewFirm(data)
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
  }
  group(){
    this.groupForm.reset();
    this.isGroup=true;
  }
  company(){
    this.companyForm.reset();
    this.isCompany=true;
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
    if($event==2) {
      this.groupDisabled = true;
      this.groupForm.patchValue({
        releaseCase: 2
      })
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
  log(data){

  }
}
