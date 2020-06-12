import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms' ;
import { Adaptor } from '../../share/tool';
import { TableData } from '../../share/table/table.model';
import { dataFormat } from '../../format';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { SearchModel }from './searchModel';
import { ActivatedRoute } from '@angular/router';
import { repaymentCodeService } from '../../service/order';
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../service/storage';
import { Router } from '@angular/router';
import { DateObjToString } from '../../format';
import { Observable, Observer } from 'rxjs';

let __this;
@Component({
    selector : "repaymentCode" ,
    templateUrl : './repaymentCode.component.html' ,
    styleUrls : ['./repaymentCode.component.less']
})
export class RepaymentCodeComponent implements OnInit{
    constructor(
        private translateSer: TranslateService ,
        private msg : CommonMsgService ,
        private orderSer : repaymentCodeService ,
        private sgo : SessionStorageService ,
        private routerInfo: ActivatedRoute,
        private fb: FormBuilder,
        private router : Router
    ) {};

    isVisible:Boolean=false;
    isOkLoading:Boolean=false;
    validForm : FormGroup;
    orderId : any;

    ngOnInit(){
      __this=this;
      this.validForm = this.fb.group({
        "orderNo": [null , [Validators.required] ],
        "orderId": [null , [Validators.required] ],
        "leftAmount": [null , [Validators.required] ],
        "dealMoney": [null , [Validators.required] ]
      });
      this.getLanguage() ;
    };

    searchModel : SearchModel = new SearchModel() ;

    // statusEnum : Array< { name :string , value : number} > ;
    // orderStatusEnum : Array< { name :string , value : number} > ;
    // productType : Object;
    languagePack : Object ;

    getLanguage(){
        this.translateSer.stream(["financeModule.repaymentCode" , 'common'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common : data['common'] ,
                        data : data['financeModule.repaymentCode'],
                        table:data['financeModule.repaymentCode']['table']
                    };

                    // this.statusEnum = data['financeModule.repaymentCode']['status'];
                    // this.orderStatusEnum = data['financeModule.repaymentCode']['orderStatusEnum']
                    // this.productType = data['financeModule.repaymentCode']['productType']
                    this.initialTable() ;
                }
            )
    };

    tableData : TableData ;
    initialTable(){

        const Table = this.languagePack['table'] ;
        this.tableData = {
            loading : false ,
            showIndex : true,
            tableTitle : [
                {
                    name : Table['createTime'] ,
                    reflect : "createTime" ,
                    type : "text" ,
                },{
                  name : Table['transactionNumber'] ,
                  reflect : "merchantOrderId" ,
                  type : "text" ,
                },{
                  name : Table['loanOrderNo'] ,
                  reflect : "orderNo" ,
                  type : "text" ,
                },{
                  name : Table['periodsNo'] ,
                  reflect : "currentPeriod" ,
                  type : "text" ,
                  filter : (item) =>{
                    return item['type']==1 ? "" : (item['currentPeriod']+"/"+item['totalPeriod'])
                  }
                },{
                  name : Table['payWay'] ,
                  reflect : "paymentMethod" ,
                  type : "text" ,
                },{
                  name : Table['repaymentCode'] ,
                  reflect : "vaNumber" ,
                  type : "text" ,
                },{
                  name : Table['termValidity'] ,
                  reflect : "effectTimeStr" ,
                  type : "text" ,
                },{
                  name : Table['transactionAmount'] ,
                  reflect : "amount" ,
                  type : "text" ,
                },{
                  name : Table['transactionTime'] ,
                  reflect : "dealTimeStr" ,
                  type : "text" ,
                },{
                  name : Table['phoneNumber'] ,
                  reflect : "tel" ,
                  type : "text" ,
                },{
                  name : Table['createType'] ,
                  reflect : "type" ,
                  type : "text",
                  filter : (item)=>{
                    const createType = item['type'];
                    if(createType!==null){
                      const map = __this.languagePack['table']['createTypes'];
                      let name = map.filter(item => {
                          return item.value == createType;
                      });
                      return (name && name[0].desc) ? name[0].desc : "";
                    }
                  }
                },{
                  name : Table['createPeople'] ,
                  reflect : "creator" ,
                  type : "text" ,
                  filter : (item)=>{
                    return item['creator']==null ? __this.languagePack.data.system : item['creator']
                  }
                },{
                  name : Table['tradeStatus'] ,
                  reflect : "status" ,
                  type : "text",
                  filter : (item)=>{
                    const tradeStatus = item['status'];
                    if(tradeStatus!==null){
                      const map = __this.languagePack['table']['tradeStatuss'];
                      let name = map.filter(item => {
                          return item.value == tradeStatus;
                      });
                      return (name && name[0].desc) ? name[0].desc : "";
                    }
                  }
                }
            ] ,
            btnGroup: {
              title: __this.languagePack['table']['operate'],
              data: [
                {
                textColor: '#0000ff',
                name: __this.languagePack['table']['operates']['copy'],
                bindFn: (item) => {
                  this.orderSer.getLink(item.id)
                  .subscribe(
                    (res: Response) => {
                      if(res.success !== true){
                        this.msg.fetchFail(res.message);
                        return;
                      };
                      var Url2=( <string> res.data );
                      // console.log(Url2)
                      var oInput = document.createElement('input');
                      oInput.value = Url2;
                      document.body.appendChild(oInput);
                      oInput.select(); // 选择对象
                      document.execCommand("Copy"); // 执行浏览器复制命令
                      oInput.className = 'oInput';
                      oInput.style.display='none';
                      this.msg.operateTrue(__this.languagePack['data']['realyCopy']);
                    }
                  );
                },
                showContion: {
                  name: 'creator',
                  only: 'only',
                  value: []
                },
              },{
                textColor: '#0000ff',
                name: __this.languagePack['table']['operates']['refreshStatus'],
                bindFn: (item) => {
                  this.orderSer.getList({"orderId":this.orderId,"id":item.id})
                  .subscribe(
                    (res: Response) => {
                        this.tableData.data.filter((value,key)=>{
                          if(value['id']==res.data[0].id){
                            this.tableData.data.splice(key,1,res.data[0]);
                            this.msg.operateTrue(__this.languagePack['data']['realyRefresh']);
                          }
                        });
      
                    }
                  );
              }
            }
          ]
        }
      }
        this.getList() ;
    };
    search(){
      this.searchModel.currentPage = 1 ;
      this.getList() ;
    };
    totalSize : number ;
    getList(){
      this.routerInfo.queryParams
      .subscribe(
        (para) => {
          this.orderId=para['orderid'];
          this.searchModel.orderId=para['orderid'];
          let data = this.searchModel ;
          this.orderSer.getList(data)
          .pipe(
              filter( ( res : Response) => {
                  if(res.success !== true){
                      this.msg.fetchFail(res.message) ;
                  };
  
                  this.tableData.loading = false ;
  
                  if(res.data && res.data['length'] == 0){
                      this.tableData.data = [] ;
                      this.totalSize = 0 ;
                  };
  
                  return res.success === true ;
              })
          )
          .subscribe(
              ( res : Response ) => {
                  if(res.page){
                    this.totalSize = res.page["totalNumber"] || 0;
                  }else{
                    this.totalSize =0;
                  }
                  let data_arr = res.data ;
                  this.tableData.data = ( <Array< Object > >data_arr );

              }
          )
        }
      );
    };


    handleCancel(){
      this.isVisible = false;
      this.validForm.reset();
    };
    handleOk() {
      this.isOkLoading = true;
      // console.log(this.validForm.value);
      let postData = this.validForm.value;
      if(this.validForm.value.dealMoney==null||this.validForm.value.dealMoney==""){
        this.msg.operateFail(__this.languagePack['data']['moreThanTenThousand']) ;
        this.isOkLoading = false ;
      }else{
        this.validForm.patchValue({
          dealMoney:(this.validForm.value.dealMoney).toString()
        })
        this.addChannel(postData);
      }
    }
    addChannel(data){
      this.isOkLoading=true;
      if(data.dealMoney>=10000){
      this.orderSer.addRepaymentCode(data)
        .pipe(
          filter( (res : Response) => {
            this.isOkLoading = false ;
            if(res.success === false){
              this.msg.fetchFail(res.message) ;
            }
            return res.success === true;
          })
        )
        .subscribe(
          ( res : Response ) => {
            this.isVisible = false;
            this.getList();
          }
        );
      }else{
        this.msg.operateFail(__this.languagePack['data']['moreThanTenThousand']) ;
        this.isOkLoading = false ;
      }
    }
    add(){
      this.isVisible=true;
      this.validForm.reset();
      this.orderSer.needAddRepaymentCode(this.orderId)
      .pipe(
          filter( ( res : Response) => {
              if(res.success !== true){
                  this.msg.fetchFail(res.message) ;
              };

              this.tableData.loading = false ;

              if(res.data && res.data['length'] == 0){
                  this.tableData.data = [] ;
                  this.totalSize = 0 ;
              };

              return res.success === true ;
          })
      )
      .subscribe(
          ( res : Response ) => {

              // let data_arr = res.data ;
              // console.log(res.data)
              this.validForm.patchValue({
                orderNo:res.data['orderNo'],
                orderId:res.data['orderId'],
                leftAmount:res.data['leftAmount'],
                dealMoney:res.data['dealMoney']
              })

          }
      )
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
        this.searchModel = new SearchModel() ;
        this.getList()
    };
}
