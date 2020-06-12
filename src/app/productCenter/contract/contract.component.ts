import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TableData } from "../../share/table/table.model";
import {CommonMsgService, MsgService} from '../../service/msg';
import { Router } from "@angular/router";
import { SessionStorageService } from "../../service/storage";
import { ContractService } from "../../service/productCenter/contract.service";
import {SearchModel} from '../product/searchModel';
import { unixTime } from "../../format";
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model';

let __this;

@Component({
  selector: "",
  templateUrl: "./contract.component.html",
  styleUrls: ["./contract.component.less"]
})
export class ContractComponent implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service :ContractService
  ) {}
  configData: any= {
    uiColor: '#F8F8F8',   // 编辑框背景色
    language: 'zh-cn',  // 显示语言
    toolbarCanCollapse: true,  // 是否可收缩功能栏
    toolbar: [ ['Maximize'],['Undo','Redo','-','Cut',' Copy','Paste', 'PasteText', 'PasteFromWord','-','Link','Unlink','Anchor','-','Image','Table','HorizontalRule','Smiley','SpecialChar','-','Source'], ['Bold','Italic','Underline','Strike','-','Subscript','Superscript','-','NumberedList','BulletedList','-','Outdent','Indent','Blockquote'], ['Styles','Format','Font','FontSize'] ]  // 工具部分
  };
  languagePack: Object;
  tableData: TableData;
  isDelete:Boolean=false;
  isDeleteLoading:Boolean=false;
  searchModel : SearchModel = new SearchModel() ;
  totalSize : number = 0 ;
  inputData:Array< String >;
  AllProtocol:Array<Object>;
  inputValue='id';
  stateData:Array< String >;
  validForm : FormGroup;
  isVisible:Boolean=false;
  isOkLoading:Boolean=false;
  ngOnInit() {
    __this = this;
    this.validForm = this.fb.group({
      "id":null,
      "contractName" : [null , [Validators.required] ] ,
      "contractProtocolId" : [null , [Validators.required] ] ,
      "agreementURL":[null] ,
      "contractProtocolContent":[null , [Validators.required] ] ,
      "status" : [1] ,
    });
    this.getLanguage();
    this.getAllProtocol();
  }

  getLanguage() {
    this.translateSer.stream(["productCenter.contract", "common"]).subscribe(data => {
      this.languagePack = {
        common: data['common'],
        data:data['productCenter.contract'],
        list: data['productCenter.contract']['list']
      };
      this.inputData=this.languagePack['data']['input'];
      this.stateData=this.languagePack['data']['state'];
      this.initialTable();
    });
  }

  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: false,
      tableTitle: [
        {
          name: __this.languagePack["list"]["id"],
          reflect: "id",
          type: "text"
        },
        {
          name: __this.languagePack["list"]["name"],
          reflect: "contractName",
          type: "text"
        },
        {
          name: __this.languagePack["list"]["creationTime"],
          reflect: "createTime",
          type: "text",
          filter:(item)=>{
            return item['createTime'] ? unixTime(item['createTime']) : "";
          }
        },
        {
          name: __this.languagePack["list"]["updateTime"],
          reflect: "modifyTime",
          type: "text",
          filter:(item)=>{
            return item['modifyTime'] ? unixTime(item['modifyTime']) : "";
          }
        },
        {
          name: __this.languagePack["list"]["type"],
          reflect: "contractProtocolId",
          type: "text",
          filter:(item) =>{
            let name;
            let contractProtocolId=item['contractProtocolId'];
            if(item['contractProtocolId']){
              let type=this.AllProtocol.filter(v => {
                return v['id']===item['contractProtocolId']
              });
              name=(type && type[0]['protocolType']) ? type[0]['protocolType'] : "";
            }
            return (name) ? name : "";
          }
        },
        {
          name: __this.languagePack["list"]["state"],
          reflect: "status",
          type: "text",
          filter:(item) =>{
            let name;
            let status=item['status'];
            if(item['status']){
              let type=this.stateData.filter(v => {
                return v['value']===item['status']
              });
              name=(type && type[0]['desc']) ? type[0]['desc'] : "";
            }
            return (name) ? name : "";
          }
        }
      ],
      btnGroup: {
        title: __this.languagePack["common"]["operate"]["name"],
        data: [
          {
            textColor: "#0000ff",
            name: __this.languagePack["common"]["operate"]["edit"],
            bindFn: item => {
              this.isVisible=true;
              this.validForm.patchValue({
                id: item.id,
                "contractName" : item.contractName ,
                "contractProtocolId" : item.contractProtocolId ,
                "contractProtocolContent":item.contractProtocolContent ,
                "status" : item.status ,
              });
            }
          },
          {
            textColor: "#0000ff",
            name: __this.languagePack['common']['operate']['delete'],
            bindFn: (item) => {
              this.isDelete=true;
              this.sgo.set('contractId', {
                id: item.id,
              });
            }
          }
        ]
      },
    };
    this.getList();
  }
  getAllProtocol(){
    this.service.getAllContractProtocolList()
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true && res.data &&
            (<Array<Object>>res.data).length >= 0;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.AllProtocol = (< Array<Object> >res.data)
          .filter(item=>{
            return item['status']===1;
          });
          console.log(this.AllProtocol)
        }
      );
  }
  getList(){
    this.tableData.loading = true ;
    let data = this.searchModel ;
    this.service.getContract(data)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          if(  !( < Array< Object > >res.data )){
            this.tableData.data = [] ;
            this.totalSize = 0 ;
          }
          return res.success === true && res.data &&
            (<Array<Object>>res.data).length >= 0;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          this.totalSize = res.page.totalNumber ;
        }
      );
  };
  add(){
    this.validForm.reset();
    this.isVisible=true;
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
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList();
  }
  handleOk(){
    let valid = this.validForm.valid ;
    if(!valid){
      this.msg.error(this.languagePack['data']['tips']['empty']);
      return ;
    }
    let postData=this.validForm.value;
    if(postData['id']){
      this.updateContract(postData);
    }else{
      this.addContract(postData);
    }

  }
  updateContract(postData){
    let data={
      id:postData['id'],
      contractName:postData['contractName'],
      contractProtocolContent:postData['contractProtocolContent'],
      contractProtocolId:postData['contractProtocolId'],
      status:postData['status']
    };
    console.log(data);
    this.service.updateContract(data)
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
          this.Cmsg.operateSuccess();
          this.isVisible=false;
          this.getList();
        }
      );
  }
  addContract(postData){
    let data={
      contractName:postData['contractName'],
      contractProtocolContent:postData['contractProtocolContent'],
      contractProtocolId:postData['contractProtocolId']
    };
    this.service.addContract(data)
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
          this.Cmsg.operateSuccess();
          this.isVisible=false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.isVisible=false;
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("contractId").id
    };
    this.service.deleteContract(data)
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
  keyupId(){
    let val=this.searchModel.id;
    this.searchModel.id=val.replace(/[^0-9]/g,'');
    console.log(this.searchModel.id);
  }
  setType($event){
    console.log($event)
    if($event){
      console.log(this.AllProtocol)
      let url=this.AllProtocol.filter(item=>{
        return item['id']===$event
      });
      this.validForm.patchValue({
        agreementURL:url && url[0]['protocolUrl'] ? url[0]['protocolUrl'] :""
      })
    }else{
      this.validForm.patchValue({
        agreementURL:""
      })
    }
  }
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  }
}
