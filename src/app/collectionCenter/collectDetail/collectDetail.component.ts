import {Component, OnInit} from '@angular/core';
import { environment } from "../../../environments/environment";
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../share/table/table.model';
import {CommonMsgService, MsgService} from '../../service/msg/index';
import {Router, ActivatedRoute} from '@angular/router';
import {SessionStorageService} from '../../service/storage/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model/index';
import { collectionWorkbenchService } from "../../service/collectionWorkbench";
import {dataFormat, reviewOrderStatustransform, unixTime} from '../../format';
import {OrderService, repaymentCodeService, UserService} from "../../service/order";
import {RiskListService} from "../../service/risk";
declare var STI: any;
declare var $: any;
let __this;
@Component({
  selector: '',
  templateUrl: './collectDetail.component.html',
  styleUrls: ['./collectDetail.component.less']
})
export class CollectDetailComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private msg: MsgService,
    private Cmsg: CommonMsgService,
    private router: Router,
    private usrSer: UserService,
    private RiskListService: RiskListService,
    private orderSer: OrderService,
    private repaymentCodeService : repaymentCodeService ,
    private routerInfo: ActivatedRoute,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: collectionWorkbenchService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();

  languagePack: Object;
  logForm: FormGroup;
  extendForm: FormGroup;
  phoneForm: FormGroup;
  letterReviewData:Object;
  tableData: TableData;
  offer: Array<String>;
  receive: Array<String>;
  loanOrderInfoData: any;
  letterRecordData: TableData;
  chType:number=1;
  phoneType:Number = 1;
  phoneMdlType:number=1;

  addModel: Boolean = false;
  extendModel: Boolean = false;
  isOkLoading:Boolean=false;
  isOkLoadingCode:Boolean=false;
  phoneModel:Boolean=false;

  phoneArray: Array<Object> = [{
    phone:""
  }]; // 输入框电话
  choosePhoneArray: Array<String> = []; // 已选择电话
  extendInfo: any = {}; // 展期详情
  orderDetail: any = {} ; // 借款订单详情
  account: any = {} ; // 取款账户
  userInfo: any = {} ; // 个人信息
  contact: Array<any> ; // 紧急联系人
  msgLogList: Array<any> ; // 短信记录
  friendInfo:Array<any>=[]; // 紧急联系人
  phoneList:Array<any>=[]; // 通讯录
  phoneListData:Array<any>=[]; // 通讯录
  allChecked:Boolean = false;
  indeterminate :Boolean = false;
  userId: number;
  orderId: number;
  phoneCall: string;
  orderInfoData:object;// 借款订单信息
  userInfoData:object;//用户信息 (已绑定用户信息 + 个人信息-用户录入)
  deviceInfoData:object;//当前设备信息
  userWorkInfoData:object;//工作信息-用户录入
  userContactData:Array<object>;
  ktpCheckInfoData:object;//KTP验证
  livingCheckInfoData:object;//活体校验
  riskIdentificationData:object;//风险识别-星合星探
  creditDeviceInfoData:object;//多设备号
  para : any;
  // 左侧导航菜单
  navLeft;
  education = ['DIPLOMA_I', 'DIPLOMA_II', 'DIPLOMA_III', 'SLTA', 'S1', 'SLTP', 'S2', 'SD', 'S3'];
  tobefore :string;
  toafter :string;
  isVisible:Boolean=false;
  validForm : FormGroup;
  ngOnInit() {
    __this=this;
    document.getElementsByClassName("routerWrap")[0].scrollTop = 0;
    this.logForm = this.fb.group({
      logType: [null, [Validators.required] ],
      remark: [ null, [ Validators.required ] ],
      remind: [ null],
      remindTime: [ null],
      remindContent: [ null],
    });
    this.validForm = this.fb.group({
      "orderNo": [null , [Validators.required] ],
      "orderId": [null , [Validators.required] ],
      "leftAmount": [null , [Validators.required] ],
      "dealMoney": [null , [Validators.required] ]
    });
    this.routerInfo.queryParams.subscribe(para => {
      console.log(para);
      this.para = para;
    });
    this.userId=this.para.userId;
    this.extendForm = this.fb.group({ money: [ null, [ Validators.required ] ], });
    this.phoneForm = this.fb.group({ phoneNumber: [ null], msg: [ null ], });
    this.getLanguage();
  };

  getLanguage() {
    this.translateSer.stream(['common','collectDetail','authModule','letterReviewOrder','orderDetail','financeModule.repaymentCode'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['collectDetail'],
            table:data['financeModule.repaymentCode']['table'],
            data : data['financeModule.repaymentCode'],
            contactPerson:data['authModule.contactPerson'],
            letterReviewOrder:data['letterReviewOrder'],
          };
          this.tobefore=data['orderDetail']['tobefore'];
          this.toafter=data['orderDetail']['toafter'];
          this.navLeft=[
            { content: this.languagePack['list']['loanOrderInfo'], id: 'qqq' },
            { content: this.languagePack['list']['auditOrder'], id: 'sss' },
            { content: this.languagePack['list']['friendInfo'], id: 'aaa' },
            { content: this.languagePack['list']['contactBook'], id: 'ggg' },
            { content: this.languagePack['letterReviewOrder']['letterRecord'], id: 'letterRecord' }
          ];
          this.getRecallDetail();
          this.getCollectionList();
        }
      );
  };
  getRecallDetail() {
    let orderId = this.para.orderId;
    this.orderId=orderId;
    this.getOrderInfo();
    this.getUserInfo();
    this.getUserWorkInfo();
    this.getDeviceInfo();
    this.getUserContact();
    this.getKtpCheckInfo();
    this.getLivingCheckInfo();
    this.riskIdentification();
    this.getCreditDeviceInfo();

    this.initOrderTableData(orderId);
    this.initAccountInfoData(orderId);
    this.initLoanInfoData(orderId);
    this.initRepaymentInfoData(orderId);
    this.initStreamInfoData(orderId);
    this.initLetterRecordData(this.para['creditOrderId'])
    // this.getPhoneList(this.para['userId']);
  }
  getPhoneList(userId){
    // this.service.getAddressBook(userId)
    //   .pipe(
    //     filter( (res : Response) => {
    //       if(res.success === false){
    //         this.Cmsg.fetchFail(res.message) ;
    //       }
    //       return res.success === true;
    //     })
    //   )
    //   .subscribe(
    //     ( res : Response ) => {
    //       this.phoneList=<Array<object>>res.data;
    //     }
    //   );
  }
  // 左侧导航跳转
  goAnchor(data:string) {
    let num=document.getElementById(data).offsetTop-document.getElementById("qqq").offsetTop;
    document.getElementById('sectionInfo').scrollTop = num;
  }
  // 底部表格切换
  changeStatus(data){
    this.chType=data;
    this.searchModel.currentPage = 1;
    switch ( data ) {
      case 1:
        this.getCollectionList();
        break;
      case 2:
        this.getCallList();
        break;
      case 3:
        this.getMsgList();
        break;
      case 4:
        this.getRotateList();
        break;
      case 5:
        this.getRepaymentCode();
        break;
      default:
        break
    }
  }
  search(){
    this.searchModel.currentPage = 1 ;
    this.getRepaymentCode() ;
  }
  reset(){
    this.searchModel = new SearchModel() ;
    this.getRepaymentCode();
  };

  getRepaymentCode(){
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
              const map = this.languagePack['table']['createTypes'];
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
            return item['creator']===null ? this.languagePack['data']['system'] : item['creator']
          }
        },{
          name : Table['tradeStatus'] ,
          reflect : "status" ,
          type : "text",
          filter : (item)=>{
            const tradeStatus = item['status'];
            if(tradeStatus!==null){
              const map = this.languagePack['table']['tradeStatuss'];
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
              this.repaymentCodeService.getLink(item.id)
                .subscribe(
                  (res: Response) => {
                    if(res.success !== true){
                      this.Cmsg.fetchFail(res.message);
                      return;
                    }
                    var Url2=( <string> res.data );
                    // console.log(Url2)
                    var oInput = document.createElement('input');
                    oInput.value = Url2;
                    document.body.appendChild(oInput);
                    oInput.select(); // 选择对象
                    document.execCommand("Copy"); // 执行浏览器复制命令
                    oInput.className = 'oInput';
                    oInput.style.display='none';
                    this.Cmsg.operateTrue(__this.languagePack['data']['realyCopy']);
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
              this.repaymentCodeService.getList({"orderId":this.orderId,"id":item.id})
                .subscribe(
                  (res: Response) => {
                    this.tableData.data.filter((value,key)=>{
                      if(value['id']==res.data[0].id){
                        this.tableData.data.splice(key,1,res.data[0]);
                        this.Cmsg.operateTrue(__this.languagePack['data']['realyRefresh']);
                      }
                    });

                  }
                );
            }
          }
        ]
      }
    };
    this.searchModel.orderId=this.orderId;
    let data = this.searchModel ;
    this.repaymentCodeService.getList(data)
      .pipe(
        filter( ( res : Response) => {
          if(res.success !== true){
            this.Cmsg.fetchFail(res.message) ;
          };

          this.tableData.loading = false ;

          if(res.data && res.data['length'] === 0){
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
            this.totalSize = 0;
          }
          let data_arr = res.data ;
          this.tableData.data = ( <Array< Object > >data_arr );

        }
      )
  }
  addCode(){
    this.isVisible=true;
    this.validForm.reset();
    this.repaymentCodeService.needAddRepaymentCode(this.orderId+"")
      .pipe(
        filter( ( res : Response) => {
          if(res.success !== true){
            this.Cmsg.fetchFail(res.message) ;
          };

          this.tableData.loading = false ;

          if(res.data && res.data['length'] === 0){
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
  handleCancelCode(){
    this.isVisible = false;
    this.validForm.reset();
  };
  handleOkCode(){
    this.isOkLoadingCode = true;
    // console.log(this.validForm.value);
    let postData = this.validForm.value;
    if(this.validForm.value.dealMoney===null||this.validForm.value.dealMoney===""){
      this.Cmsg.operateFail(__this.languagePack['data']['moreThanTenThousand']) ;
      this.isOkLoadingCode = false ;
    }else{
      this.validForm.patchValue({
        dealMoney:(this.validForm.value.dealMoney).toString()
      });
      this.addChannelCode(postData);
    }
  }
  addChannelCode(data){
    this.isOkLoadingCode=true;
    if(data.dealMoney>=10000){
      this.repaymentCodeService.addRepaymentCode(data)
        .pipe(
          filter( (res : Response) => {
            this.isOkLoading = false ;
            if(res.success === false){
              this.Cmsg.fetchFail(res.message) ;
            }
            return res.success === true;
          })
        )
        .subscribe(
          ( res : Response ) => {
            this.isVisible = false;
            this.getRepaymentCode();
          }
        );
    }else{
      this.Cmsg.operateFail(__this.languagePack['data']['moreThanTenThousand']) ;
      this.isOkLoadingCode = false ;
    }
  }
  // 返回审核列表
  refresh(){
    this.router.navigate(["/collectionCenter/"+this.para.from], {
      queryParams: {
        from: "collectionManagebench"
      }
    });
  }
  // 复制剪切板
  copyClipboard ( type: Number ) {
    const input = document.createElement('input');
    document.body.appendChild(input);
    if ( type == 1 ) {
      input.setAttribute('value', this.userInfoData['phoneNumber']);
    } else {
      input.setAttribute('value', '22222222222');
    }
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      this.msg.success(this.languagePack['list']['copySuccess']);
    } else {
      this.msg.error(this.languagePack['list']['copyError']);
    }
    document.body.removeChild(input);
  }
  copyCode(){
    this.validForm.reset();
    this.repaymentCodeService.needAddRepaymentCode(this.orderId+"")
      .pipe(
        filter( ( res : Response) => {
          if(res.success !== true){
            this.Cmsg.fetchFail(res.message) ;
          };

          this.tableData.loading = false ;

          if(res.data && res.data['length'] === 0){
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
            dealMoney:res.data['leftAmount']
          });
          let data=this.validForm.value;
          this.repaymentCodeService.addRepaymentCode(data)
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
                if(res.success !== true){
                  this.Cmsg.fetchFail(res.message);
                  return;
                }
                var Url2=( <string> res.data );
                // console.log(Url2)
                var oInput = document.createElement('input');
                oInput.value = Url2;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.style.display='none';
                this.Cmsg.operateTrue(__this.languagePack['data']['realyCopy']);
              }
            );
        }
      )
  }

  totalSize: number = 0;
  // 获取催收日志
  getCollectionList(){
    this.tableData = {
      tableTitle: [
        {
          name: this.languagePack['list']['id'],
          reflect: "id",
          type: "text"
        },
        {
          name: this.languagePack['list']['createTime'],
          reflect: "createTime",
          filter: (item) => {
            return dataFormat(item.createTime)
          },
          type: "text"
        },
        {
          name: this.languagePack['list']['collectionLogType'],
          reflect: "logType",
          filter: item =>{
            let type = ''
            switch ( item['logType'] ) {
              case 1:
                type = this.languagePack['list']['dialNoAnswer']
                break
              case 2:
                type = this.languagePack['list']['delayedRepayment']
                break
              case 3:
                type = this.languagePack['list']['refusalRepayment']
                break
              case 4:
                type = this.languagePack['list']['emptyNumber']
                break
              case 5:
                type = this.languagePack['list']['downtime']
                break
              case 6:
                type = this.languagePack['list']['extension']
                break
              default:
                break
            }
            return type
          },
          type: "text",
        },
        {
          name: this.languagePack['list']['collectionLog'],
          reflect: "remark",
          type: "text"
        },
        {
          name: this.languagePack['list']['reminderTime'],
          reflect: "remindTime",
          filter: (item) => {
            return dataFormat(item.remindTime)
          },
          type: "text"
        },
        {
          name: this.languagePack['list']['reminderContent'],
          reflect: "remindContent",
          type: "text"
        },
        {
          name: this.languagePack['list']['recruiter'],
          reflect: "operationName",
          type: "text"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.getRecallLogList(data, this.para.orderId)
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
  withdrawalInfoData: any = [];
  loanData: any = [];
  repaymentData: any = [];
  streamData: any = [];
  //订单详情
  initOrderTableData(orderId : number | string) {
    this.orderSer.orderDetail(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            this.loanOrderInfoData = res.data;
            console.log(this.loanOrderInfoData,'loanOrderInfoData');
          } else {
            this.Cmsg.fetchFail(res.message);
          }
        }
      )
  }

  //取款账户信息
  initAccountInfoData(orderId : number | string){
    this.orderSer.bankcardByOrderId(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            this.withdrawalInfoData = res.data;
            console.log(this.withdrawalInfoData,'withdrawalInfoData');

            // data[0]['accountType'] = accountTypetransform(data[0]['accountType']);

          } else {
            this.Cmsg.fetchFail(res.message);
          }
        }
      )
  }

  //放款详情 & 放款流水
  initLoanInfoData(orderId : number | string){
    this.orderSer.loan(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            this.loanData = res.data;
            console.log(this.loanData,'loanData');
            // data[0]['accountType'] = accountTypetransform(data[0]['accountType']);
          } else {
            this.Cmsg.fetchFail(res.message);
          }
        }
      )
  }

  //还款详情
  initRepaymentInfoData(orderId : number | string){
    this.orderSer.repayment(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            this.repaymentData = res.data;
            console.log(this.repaymentData,'repaymentData');
            // data[0]['accountType'] = accountTypetransform(data[0]['accountType']);
          } else {
            this.Cmsg.fetchFail(res.message);
          }
        }
      )
  }

  //还款流水
  initStreamInfoData(orderId : number | string){
    this.orderSer.getStream(orderId)
      .subscribe(
        (res : Response) => {
          if (res.success) {
            if (!res.data) {
              return false;
            }
            console.log(res.data)
            this.streamData = res.data;
            console.log(this.streamData,'streamData');
          } else {
            this.Cmsg.fetchFail(res.message);
          }
        }
      )
  }
  dateToString(data){
    if(data){
      return unixTime(new Date(data));
    }else {
      return;
    }
  }

  toRepaymentCode(orderid){
    // console.log(orderid)
    this.sgo.set("routerInfo" , {
      parentName :this.tobefore,
      menuName :this.toafter
    }) ;
    this.router.navigate(['/order/repaymentCode'], {
      queryParams: {
        orderid:orderid
      }
    });
  }
  // 催收通话记录
  getCallList(){
    this.tableData = {
      tableTitle: [
        {
          name: this.languagePack['list']['callList']['id'],
          reflect: "id",
          type: "text"
        },
        {
          name: this.languagePack['list']['callList']['callingSeat'],
          reflect: "creditOrderNo",
          type: "text"
        },
        {
          name: this.languagePack['list']['callList']['callNumber'],
          reflect: "userPhone",
          type: "text"
        },
        {
          name: this.languagePack['list']['callList']['callStartTime'],
          reflect: "createTime",
          filter: (item) => {
            return dataFormat(item.createTime)
          },
          type: "text"
        },
        {
          name: this.languagePack['list']['callList']['callEndTime'],
          reflect: "endTime",
          type: "text"
        },
        {
          name: this.languagePack['list']['callList']['callDuration'],
          reflect: "feeTime",
          type: "text"
        },
        {
          name: this.languagePack['list']['callList']['recordingFiles'],
          reflect: "recodingurl",
          type: "audio"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.getWebCallList(data, this.para.orderId)
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
  // 催收短信记录
  getMsgList(){
    this.tableData = {
      tableTitle: [
        {
          name: this.languagePack['list']['msgList']['id'],
          reflect: "id",
          type: "text"
        },
        {
          name: this.languagePack['list']['msgList']['sender'],
          reflect: "operatorName",
          type: "text"
        },
        {
          name: this.languagePack['list']['msgList']['send'],
          reflect: "targetPhoneNumber",
          type: "text"
        },
        {
          name: this.languagePack['list']['msgList']['content'],
          reflect: "content",
          type: "text"
        },
        {
          name: this.languagePack['list']['msgList']['sendTime'],
          reflect: "createTime",
          filter: (item) => {
            return dataFormat(item.createTime)
          },
          type: "text"
        },
        {
          name: this.languagePack['list']['msgList']['sendResult'],
          reflect: "sendResult",
          type: "text"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.getMsgLogList(data, this.para.orderId)
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
  // 案件流转记录
  getRotateList(){
    this.tableData = {
      tableTitle: [
        {
          name: this.languagePack['list']['createTime'],
          reflect: "createTime",
          filter: (item) => {
            return dataFormat(item.createTime)
          },
          type: "text"
        },
        {
          name: this.languagePack['list']['stage'],
          reflect: "stageId",
          type: "text"
        },
        {
          name: this.languagePack['list']['days'],
          reflect: "overdueDay",
          type: "text"
        },
        {
          name: this.languagePack['list']['allot'],
          reflect: "staffName",
          type: "text"
        },
        {
          name: this.languagePack['list']['operator'],
          reflect: "operatorName",
          type: "text"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.getFlowHistoryt(data, this.para.orderId)
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

  // 催收日志模态框 4 Functions
  addModelFn () {
    this.addModel = true;
  }
  handleOk () {
    this.isOkLoading = true;
    let valid = this.logForm.valid;
    let postData = this.logForm.value;
    if (!valid) {
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }
    if (postData.agree) {
      if( !postData.datePickerTime || !postData.content ) {
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      }
    }
    postData['remindTime']=unixTime(postData['remindTime'],"y-m-d h:i:s");
    this.addChannel(postData);
  }
  handleCancel(){
    this.addModel = false;
    this.logForm.reset();
  }
  addChannel (data) {
    this.isOkLoading=true;
    let postData = {
      logType: data.logType,
      remark: data.remark,
      remind: data.remind? 1 : 0,
      remindTime: data.remindTime,
      remindContent: data.remindContent,
      orderId: this.para.orderId
    }
    this.service.postRecallLog(postData)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.addModel = false;
          this.logForm.reset();
          this.getCollectionList();
        }
      );
  }

  // 展期模态框 4 Functions
  addextendFn () {
    this.extendModel = true;
    this.service.getExhibition(this.para.orderId)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          if(res.data){
            this.extendInfo = res.data;
          }
        }
      );
  }
  extendOk () {
    this.isOkLoading = true;
    let valid = this.extendForm.valid;
    let postData = this.extendForm.value;
    if (!valid) {
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }

    this.addextend(postData);
  }
  extendCancel(){
    this.extendModel = false;
    this.extendForm.reset();
  }
  addextend (postData) {
    this.isOkLoading=true;
    let data = {
      exhibitionPeriodMoney: postData.money,
      orderId: this.para.orderId
    }
    this.service.exhibition(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.extendModel = false;
          this.extendForm.reset();
          this.getCollectionList();
        }
      );
  }

  // 电话短信模态框 4 Functions
  phoneFn (type: number) {
    this.phoneModel = true;
    this.phoneListData = [];
    this.friendInfo = [];
    this.userContactData.forEach(( item, index ) => {
      item['checked'] = false;
      this.friendInfo.push(item)
    });
    this.phoneList.forEach(( item, index ) => {
      item['checked'] = false;
      this.phoneListData.push(item)
    });
    this.phoneMdlType = 1;
    this.phoneType = type;
  }
  phoneOk () {
    this.isOkLoading = true;
    if (this.phoneType == 1) {
      // 打电话
      if( this.phoneCall.length == 0 ) {
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      };
      this.callModal(this.phoneCall);
    } else {
      // 发短信
      let phoneNumber = [];
      let msg = this.phoneForm.value.msg;
      this.phoneArray.forEach((item, index) => {
        item['phone'] == '' ? '' : phoneNumber.push(this.phoneArray[0]['phone'])
      });
      // phoneNumber = phoneNumber.concat(this.choosePhoneArray)
      if( phoneNumber.length == 0 || msg == '' || msg == null ) {
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      }
      this.addphone(phoneNumber,msg)
    }
    this.phoneModel = false;
    this.choosePhoneArray = [];
  }
  phoneCancel(){
    this.phoneModel = false;
    this.phoneForm.reset();
  }
  addphone (phoneNumber, msg) {
    this.isOkLoading=true;
    let data = {
      msgContent: msg,
      orderId: this.para.orderId,
      operatorId: this.para.staffID,
      operatorName: this.para.staffName,
      phoneNumbers: phoneNumber
    };
    this.service.sendMsg(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess() ;
          this.phoneModel = false;
          this.phoneForm.reset();
          this.getCollectionList();
        }
      );
  }
  // 电话模态框切换
  changePhoneStatus (data: number) {
    this.phoneMdlType=data;
  }
  // 电话添加删除
  addphoneNum () {
    this.phoneArray.push({phone: ''})
  }
  deletephoneNum (item) {
    let index = this.phoneArray.indexOf(item)
    this.phoneArray.splice(index, 1)
  }
  // 多选联系人
  checkAll (event: Event, type: number) {
    let list = [];
    if ( type == 1 ) {
      list = this.friendInfo
    } else if ( type == 2 ) {
      list = this.phoneList
    } else if ( type == 3 ) {
      // list = this.loanDetail
    }
    if ( event ) {
      list.forEach( ( item, index ) => {
        if ( !item['checked'] ) {
          item['checked'] = true
          this.checkEmergent(item)
        }
      })
    } else {
      list.forEach( ( item, index ) => {
        if ( item['checked'] ) {
          item['checked'] = false
          this.checkEmergent(item)
        }
      })
    }
  }
  // 单选联系人
  checkEmergent ( item ) {
    if(this.phoneType==1){
      if(this.phoneMdlType==1){
        if ( item.checked ) {
          this.friendInfo.forEach(( v, index ) => {
            if(v['contactPhone']!=item['contactPhone']){
              v['checked'] = false;
            }else{
              v['checked'] = true;
            }
          });
          this.phoneListData.forEach(( v, index ) => {
            v['checked'] = false;
          });
          this.phoneCall=item['contactPhone'];
        } else {
          this.phoneCall=null;
        }
      }else{
        if ( item.checked ) {
          this.phoneListData.forEach(( v, index ) => {
            if(v['contactPhone']!=item['contactPhone']){
              v['checked'] = false;
            }else{
              v['checked'] = true;
            }
          });
          console.log()
          this.friendInfo.forEach(( v, index ) => {
            v['checked'] = false;
          });
          this.phoneCall=item['contactPhone'];
        } else {
          this.phoneCall=null;
        }
      }
    }else{
      if ( item.checked ) {
        if(this.phoneArray.length==1 && !this.phoneArray[0]['phone']){
          this.phoneArray[0]['phone']=item.contactPhone
        }else{
          this.phoneArray.push({
            phone:item.contactPhone
          })
        }
      } else {
        let index = this.phoneArray.indexOf(item.contactPhone);
        this.phoneArray.splice(index, 1)
      }
    }

  }
  // 拨打电话
  callModal (phone) {
    this.isOkLoading = false;
    let account = 'EasyKlick';
    let password = 'b99846c549c57aa213fa8fe0033afdea';// 后台密码MD5
    let channelKey = 'f323ea1ffd5b4cf68a4e7d4f959955a7';// 后台channelKey
    // let voipAccount = '827404001';
    // let voipPassword = '29884818';// VOIP密码
    let voipAccount = this.para.recallPhone;
    let voipPassword = this.para.recallPhonePassword;// VOIP密码
    let msisdn = phone;// 手机号，请使用0开头格式
    console.log(phone);
    let extendId = this.para.orderId;// 自定义的唯一扩展ID-需要绑定此通会话的id，此字段由客户提供，用于将通话记录关联进客户的通话记录中
    //需要回调响应的Url，需要进行URL编码，格式为：http://xxxxx/xxx?extendId={extendId}&startTime={startTime}&endTime={endTime}&feeTime={feeTime}&endDirection={endDirection}&endReason={endReason}&recodingUrl={recodingUrl}
    // let postUrl = encodeURI('https://newback.kilatkre.top/urgentRecall/webcall/callback?extendId={extendId}&startTime={startTime}&endTime={endTime}&feeTime={feeTime}&endDirection={endDirection}&endReason={endReason}&recodingUrl={recodingUrl}' );
    let postUrl = encodeURI('https://back.mymascash.com/urgentRecall/webcall/callback?extendId={extendId}&startTime={startTime}&endTime={endTime}&feeTime={feeTime}&endDirection={endDirection}&endReason={endReason}&recodingUrl={recodingUrl}' );
    console.log(STI);
    console.log(postUrl);
    STI.call('btn-msisdn', 'div-iframe', account, password, channelKey, voipAccount, voipPassword, msisdn, extendId, postUrl);
    $('#btn-msisdn').click();
  }
  getOrderInfo(){
    let data={
      creditOrderId : this.para['creditOrderId']
    };
    this.usrSer.getOrderInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.orderInfoData = (<Array<Object>>res.data);
          }
        });
  }
  getUserInfo(){
    let data={
      orderId : this.para['creditOrderId']
    };
    this.usrSer.getUserInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.userInfoData = (<Array<Object>>res.data);
            setTimeout(() => {
              $("[data-magnify=gallery]").magnify();
            }, 20);
          }
        });
  }
  getUserWorkInfo(){
    let data={
      orderId : this.para['creditOrderId']
    };
    this.usrSer.getUserWorkInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.userWorkInfoData = (<Array<Object>>res.data);
            setTimeout(() => {
              $("[data-magnify=gallery]").magnify();
            }, 20);
          }
        });
  }
  getDeviceInfo(){
    let data={
      creditOrderId : this.para['creditOrderId']
    };
    this.usrSer.getDeviceInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.deviceInfoData = (<Array<Object>>res.data);
          }
        });
  }
  getUserContact(){
    //联系人-用户录入
    let data={
      orderId : this.para['creditOrderId']
    };
    this.usrSer.getUserContact(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.userContactData = (<Array<Object>>res.data).filter(v=>{
              return v['contactGrade']>0;
            });
            this.phoneList = (<Array<Object>>res.data).sort(function compareFunction(a,b){
              return a['contactName'].localeCompare(b['contactName']);
            });
          }
        });
  }
  //信审记录
  initLetterRecordData(data) {
    this.letterRecordData = {
      tableTitle: [
        {
          name: __this.languagePack['letterReviewOrder']['orderStage'],
          reflect: "creditOrderOperate",
          type: "text"
        }, {
          name: __this.languagePack['common']['operate']['name'],
          reflect: "operateResult",
          type: "text"
        }, {
          name: __this.languagePack['letterReviewOrder']['reviewRejectionStageReason'],
          reflect: "auditRejectDsec",
          type: "text",
          width:"200px",
          // filter:(item)=>{
          //   if(item['auditRejectDsec'].length>0){
          //     let str=JSON.parse(JSON.stringify(data)).join(',');
          //     return str;
          //   }
          // }
        }, {
          name: __this.languagePack['letterReviewOrder']['remarks'],
          reflect: "remark",
          type: "text",
          width:"200px",
        }, {
          name: __this.languagePack['letterReviewOrder']['operator'],
          reflect: "operateEmployee",
          type: "text",
        }, {
          name: __this.languagePack['letterReviewOrder']['operatingTime'],
          reflect: "operateTime",
          type: "text",
          filter:(item)=>{
            return unixTime(item['operateTime']);
          }
        }
      ],
      loading: false,
      showIndex: true,
    };
    this.letterReview(data);
  };
  letterReview(data){
    this.letterRecordData.loading=true;
    let params={
      creditOrderId:data
    };
    this.RiskListService.getLetterRecord(params)
      .pipe(
        filter( (res : Response) => {
          this.letterRecordData.loading=false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.letterReviewData=res.data ;
          this.letterRecordData.data=this.letterReviewData['creditOrderOperateRecordVOS'];
        }
      );
  }
  setContactState(item,state){
    let data={
      id : item['id'],
      phoneNumStatus : state
    };
    this.usrSer.updateUserContactStatusput(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
            this.getUserContact();
        });
  }
  setFriendInfo(item,state){
    let data={
      id : item['id'],
      phoneNumStatus : state
    };
    this.usrSer.updateUserContactStatusput(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          let param={
            orderId : this.para['creditOrderId']
          };
          this.usrSer.getUserContact(param)
            .pipe(
              filter((res: Response) => {
                if (res.success !== true) {
                  this.Cmsg.operateFail(res.message);
                }
                return res.success === true;
              })
            )
            .subscribe(
              (res: Response) => {
                if(res.data){
                  this.userContactData = (<Array<Object>>res.data).filter(v=>{
                    return v['contactGrade']>0;
                  });
                  this.phoneList = (<Array<Object>>res.data);
                  this.friendInfo = [];
                  this.userContactData.forEach(( item, index ) => {
                    item['checked'] = false;
                    this.friendInfo.push(item)
                  });
                }
              });
        });
  }
  setPhoneListData(item,state){
    let data={
      id : item['id'],
      phoneNumStatus : state
    };
    this.usrSer.updateUserContactStatusput(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          let param={
            orderId : this.para['creditOrderId']
          };
          this.usrSer.getUserContact(param)
            .pipe(
              filter((res: Response) => {
                if (res.success !== true) {
                  this.Cmsg.operateFail(res.message);
                }
                return res.success === true;
              })
            )
            .subscribe(
              (res: Response) => {
                if(res.data){
                  this.userContactData = (<Array<Object>>res.data).filter(v=>{
                    return v['contactGrade']>0;
                  });
                  this.phoneList = (<Array<Object>>res.data);
                  this.phoneListData = [];
                  this.phoneList.forEach(( item, index ) => {
                    item['checked'] = false;
                    this.phoneListData.push(item)
                  });
                }
              });
        });
  }
  getKtpCheckInfo(){
    let data={
      userId : this.userId,
      creditOrderId : this.para['creditOrderId']
    };
    this.usrSer.getKtpCheckInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.ktpCheckInfoData = (<Array<Object>>res.data);
            setTimeout(() => {
              $("[data-magnify=gallery]").magnify();
            }, 20);
          }
        });
  }
  getLivingCheckInfo(){
    let data={
      userId : this.userId,
      creditOrderId : this.para['creditOrderId']
    };
    this.usrSer.getLivingCheckInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.livingCheckInfoData = (<Array<Object>>res.data);
            setTimeout(() => {
              $("[data-magnify=gallery]").magnify();
            }, 20);
          }
        });
  }
  riskIdentification(){
    let data={
      creditOrderId : this.para['creditOrderId']
    };
    this.usrSer.riskIdentification(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.riskIdentificationData = (<Array<Object>>res.data);
          }
        });
  }
  getCreditDeviceInfo(){
    let data={
      userId : this.userId
    };
    this.usrSer.getCreditDeviceInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.creditDeviceInfoData = (<Array<Object>>res.data);
          }
        });
  }
  toUpper(data){
    return data!=null ? data.toUpperCase() : "";
  }
}
