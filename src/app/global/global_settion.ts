import { environment } from "../../environments/environment";
const host = environment.host;

const system = {
  depart: {
    list: host + "/department/tree",
    opera: host + "/department"
  },
  login: host + "/employee/login",
  loginMenu: host + "/menu/tree",
  button: host + "/menu/button",
  menu: host + "/menu",
  role: host + "/role",
  staff: host + "/employee"
};

const usr = {
  list: host + "/user/list",
  login: {
    info: host + "/user/login/recently",
    all: host + "/user/login"
  },
  basicInfo: host + "/user/anthInfo",
  bankIcfo: host + "/account/bankcard"
};

const finance = {
  loanList: host + "/finance/payment/queryPayment",
  exportLoanData: host + "/finance/payment/queryPaymentExport",
  paymentReview: host + "/finance/payment/again",
  repayList: host + "/finance/repayment/queryRepaymentManage",
  loanTable: host + "/finance/payment/loan/list",
  repaymentList: host + "/finance/repayment/repaymentRecord",
  accountMonitoringList: host + "/accountDetection",
  repaymentNoticeList: host + "/repayProofs",
  getThisRepaymentNotice: host + "/repayProof",
  getUserHeaderImg: host + "/user/simpleInfo",
  updateRepaymentNotice: host + "/repayProof/update",
  updateAccountMonitoringList: host + "/accountDetection",
  downloandRepaymentList: host + "/finance/repayment/repaymentRecord/export",
  downloandRepayData: host + "/finance/repayment/queryRepaymentManageExport",
  downloandLoanTable: host + "/finance/payment/loan/list/export",
  downloadAccountMonitoring: host + "/accountDetection/export",
  getAbnormalLending: host + "/finance/payment/loan/list/abnormal",
  getAbnormalRepayment: host + "/finance/repayment/abnormalRepaymentRecord",
  downAbnormalRepayment: host + "/finance/repayment/abnormalRepaymentRecord/export",
  loan: {
    loan: host + "/finance/payment/confirmLoan"
  },
  repay: {
    repay: host + "/finance/repayment"
  }
};

const risk = {
  riskReview:{
    getriskReview: host +"/rule/configs",
    setriskReview: host +"/rule/config",
    getUserSocialIdentityCode: host + "/rule/userSocialIdentityCode",
    exportRiskReview:host +"/rule/configs/export"
  },
  riskReport:{
    performance : host + "/attendance/performance",
    exportPerformance : host + "/attendance/performance/export",
    record : host + "/attendance/record",
    exportRecord : host + "/creditAudit/workBench/attendance/export",
    creditAuditRecordDetail : host + "/creditAudit/statement/creditAuditRecordDetail",//信审记录明细
    creditAuditRecordDetailExport : host + "/creditAudit/statement/creditAuditRecordDetail/export",//导出 信审记录明细
    machineRejectStatistics : host + "/creditAudit/statement/machineRejectStatistics",//查询机审拒绝理由统计数据
    machineRejectStatisticsExport : host + "/creditAudit/statement/machineRejectStatistics/export",//导出机审拒绝理由统计数据
    manpowerRejectStatistics : host + "/creditAudit/statement/manpowerRejectStatistics",//查询人审拒绝理由统计数据
    manpowerRejectStatisticsExport : host + "/creditAudit/statement/manpowerRejectStatistics/export",//导出人审拒绝理由统计数据
    listAuditRejectDesc : host + "/creditAudit/manage/listAuditRejectDesc",//审核拒绝理由
  },
  blackList:{
    getBlackList :  host + "/blacklist",
    delete :  host + "/blacklist/delete",
    export :  host + "/blacklist/export",
    import :  host + "/blacklist/import",
    template :  host + "/blacklist/template",
    update :  host + "/blacklist/update",
  },
  letterReviewMember:{
    //信审公司
    addCreditReviewFirm : host + "/creditreview/addCreditReviewFirm",
    queryCreditReviewFirm : host + "/creditreview/queryCreditReviewFirm",
    getAllCreditReviewFirm : host + "/creditreview/getAllCreditReviewFirm",
    updateCreditReviewFirm : host + "/creditreview/updateCreditReviewFirm",
    //信审小组
    addCreditReviewGroup : host + "/creditreview/addCreditReviewGroup",
    queryCreditReviewGroup : host + "/creditreview/queryCreditReviewGroup",
    getAllCreditReviewGroup : host + "/creditreview/getAllCreditReviewGroup",
    updateCreditReviewGroup : host + "/creditreview/updateCreditReviewGroup",
    //信审成员
    addCreditReviewStaff : host + "/creditreview/addCreditReviewStaff",
    queryCreditReviewStaff : host + "/creditreview/queryCreditReviewStaff",
    getAllCreditReviewStaff : host + "/creditreview/getAllCreditReviewStaff",
    updateCreditReviewStaff : host + "/creditreview/updateCreditReviewStaff",
    //审核流程
    review : host + "/system/allreview",
  },
  businessConfig:{
    //审核流程配置
    allReview : host + "/system/allreview",
    review : host + "/system/review",
    //信审工作配置
    creditContent : host + "/creditconfig/creditContent",
    updateCreditContent : host + "/creditconfig/updateCreditContent",
    creditTime : host + "/creditconfig/creditTime",
    updateCreditTime : host + "/creditconfig/updateCreditTime",
    systemCheck : host + "/system/check",
    systemUpdate : host + "/system/update"
  },
  management:{
    getData : host + "/creditAudit/manage/get",//信审订单订单汇总页，查询所有订单，查询接口
    getCreditOrderAllocationStaffList : host + "/creditAudit/workBench/getCreditOrderAllocationStaffList",//信审订单可分配人员列表
    allocation : host + "/creditAudit/workBench/allocation",//分配
    getCreditOrderFlowHistory : host + "/creditAudit/workBench/getCreditOrderFlowHistory",//信审订单-流转记录
    detail : host + "/creditAudit/workBench/riskAudit/detail",//信审记录
    listAuditStage : host + "/creditAudit/workBench/listAuditStage",//信审管理台-查询审核阶段
    exportOverdueOrder : host + "/creditAudit/manage/exportCreditOrderList",//导出
    batchCloseOrRejectOrRollbackStage : host + "/risk/batchCloseOrRejectOrRollbackStage",//确定批量关闭/拒绝/回退阶段
  },
  riskWorkbench:{
    getGroupAuditList: host + "/creditAudit/workBench/getGroupAuditList",//信审管理台-组内已审核列表
    exportGetGroupAuditList: host + "/creditAudit/workBench/getGroupAuditList/export",
    attendance: host + "/creditAudit/workBench/attendance",//考勤
    orderLock: host + "/risk/order/lock",//锁定
    listAuditRejectDesc: host + "/creditAudit/manage/listAuditRejectDesc",//查询审核拒绝理由
  },
  riskList: host + "/risk/done",
  exportList: host + "/creditOrder/export",
  riskTotleList: host + "/audit/statistics/list",
  riskTotle: host + "/audit/statistics",
  riskShureList: host + "/risk/employee", //信审管理列表
  riskSignIn: host + "/risk/employee/signIn", //签到
  riskSignOut: host + "/risk/employee/signOut", //签退
  riskSignOutAudit: host + "/risk/employee/signOut/audit", //审批签退
  isSignIn: host + "/risk/employee/isSignIn",
  lockOrder: host + "/creditAudit/workBench/lockUnauditCreditOrder",//查看订单是否分配给其他人员
  getCurrentCreditAuditStaff: host + "/creditAudit/workBench/getCurrentCreditAuditStaff",//根据id查询信审人员信息
  record: host + "/creditOrder/record",
  riskRecordList: host + "/creditAudit/workBench",
  employees: host + "/creditAudit/workBench/allocation/signIn/employees",
  setEmployees: host + "/creditAudit/workBench/allocation",
  riskConfig: host + "/business/param/config",
  compare : host + "/business/param/config/setBusinessParam",//控制开关
  riskTotalList: host + "/creditAudit/statement",
  auditList:host + "/creditAudit/workBench",
  getCount:host + "/creditAudit/statement/statistics",
  querySiginStatus:host+ "/creditAudit/workBench/signIn/state",
  goSignin:host+ "/creditAudit/workBench/signIn",
  goSignOut:host+ "/creditAudit/workBench/signOut",
  attendanceList:host+ "/creditAudit/workBench/attendance",
  getThirdParty:host+ "/third/statement/statistics",
  getExportList:host+ "/third/statement/export",
  getStageList:host+ "/stage/statement",
  downloadStageList:host+ "/stage/statement/export",
  onLoadGetConversionTop:host+ "/creditAudit/statement/statistics",
  getConversionListBottom:host+ "/creditAudit/statement",
  downloadConversionListBottom:host+ "/creditAudit/statement/export"
};

const order = {
  user: {
    getCurrentStaffId : host + "/creditreview/getCurrentStaffId",//查询本登录人员的信审员工
    orderInfo : host + "/creditDetail/orderInfo",//借款订单信息
    userInfo : host + "/creditDetail/userInfo",// 已绑定用户信息

    loginInfo : host + "/user/login/recently",//最新登录信息
    deviceInfo : host + "/creditDetail/currDevice",//当前设备信息
    creditScore : host + "/creditDetail/queryCreditScore",//信用分
    telecomScore : host + "/creditDetail/queryTelecomScore",//电信分
    personalInfo: host + "/user/info",//个人信息
    userWorkInfo: host + "/creditDetail/userWorkInfo",//用户工作信息
    ktpCheckInfo: host + "/creditDetail/ktpCheckInfo",//KTP验证
    livingCheckInfo: host + "/creditDetail/livingCheckInfo",//活体校验
    xingheReport: host + "/creditDetail/xingheReport",//风险识别-星合星探
    creditDeviceInfo: host + "/creditDetail/listDevice",//多设备号
    userContact: host + "/creditDetail/userContact",//联系人-用户录入
    advanceInfo: host + "/creditDetail/advanceScore",// 评分查询-advance.ai
    listHistoryBorrowOrder: host + "/order/unionQuery",// 历史借款订单
    updateUserContactStatusput: host + "/creditDetail/updateUserContactStatus",// 联系人状态修改
    updateUserPhoneStatus: host + "/creditDetail/updateUserPhoneStatus",// 用户账户；公司电话状态修改
    faceBlacklistData: host + "/creditDetail/queryFaceBlacklist",// 人脸黑名单-星合星探
    listMsisdn: host + "/creditDetail/listMsisdn",// 拨号检测数据展示
    queryMsisdnStatus: host + "/creditDetail/queryMsisdnStatus",// 拨号检测
    listMsisdnManualRecord: host + "/creditDetail/listMsisdnManualRecord",// 手输入 拨号检测数据展示
    getUserGradeBySelfSupport: host + "/creditDetail/getUserGradeBySelfSupport",//自研模型调用
    sendMsg: host + "/creditDetail/sendMsg",//发送短信


    loanInfo: host + "/order/current/detail",//当前借款信息
    recordInfo: host + "/creditOrder/record",//审批记录
    applyOrder: host + "/creditAudit/workBench",//历史申请订单
    borrowInfo: host + "/order/history",//历史借还信息
    getTelecomType: host + "/thirdpartdata/getTelecomType",
    getIndosatData: host + "/thirdpartdata/getIndosatData",//查询Indosat运营商信息
    getTelkomselData: host + "/thirdpartdata/getTelkomselData",//查询telkomsel运营商信息
    getXLData: host + "/thirdpartdata/getXLData",//查询XL运营商信息

    accountInfo: host + "/account/debt",
    orderDetailInfo: host + "/user/order/detail/info",
    friendInfo: host + "/user/contact",
    addressBook: host + "/user/getAddressList",
    bankInfo: host + "/account/bankcard",
    bankcardByOrderId: host + "/account/bankcardByOrderId",
    orderHisList: host + "/order/history",
    recordDetail: host + "/creditOrder/detail",

    riskAudit: host + "/risk/audit",//审核
    creditStatus: host + "/user/info/creditStatus"//黑名单

  },
  loanRecord: {
    detail: host + "/order/detail",
    orderQuery: host + "/order/userCenter/orderQuery",
    letterQuery: host + "/creditOrder/get"
  },
  repaymentCode: {
    getRepaymentCode: host + "/finance/repayment/vaNumber",
    needAddRepaymentCode: host + "/finance/repayment/vaNumberInfo",
    addRepaymentCode: host + "/finance/repayment/vaNumberInfo",
    getLink: host + "/finance/repayment/vaNumberInfoCopy"
  },
  list: {
    all: host + "/order/unionQuery",
    downloadPageNameList: host + "/order/unionQuery/export",
    getPageNameList: host +"/channel/package",
    detail: host + "/order/detail",
    applyCash: host + "/order/applyCash/account",
    repayment: host + "/finance/repayment/repaymentPlanList",
    getStream: host + "/finance/repayment/manualRepaymentList",
    operation: host + "/order/operation/record",
    product: host + "/loanProduct/queryProductsByUserGrade",
    queryAuditRejectDesc: host + "/creditAudit/workBench/queryAuditRejectDesc"//拒绝理由
  },
  operate: {
    risk: {
      audit: host + "/creditOrder/commit",
      duration: host + "/user/behavior/pageDuration"
    },
    reback: host + "/creditOrder/recall"
  },
  record: {
    risk: host + "/risk/audit/record",
    payment: host + "/finance/payment/list",
    loan: host + "/finance/payment/loan/list",
    repayment: host + "/finance/repayment/list",
    repaymentRecord: host + "/finance/repayment/record",
    loanList: host + "/finance/payment/detail"
  }
};
const defaultIndex = {
  history: host + "/statistics/history",
  today: host + "/statistics/today",
  lastest: host + "/statistics/day/seven",
  refreshToday: host + "/statistics/today/refresh"
};
const coupon = {
  list: host + "/coupon/getCouponList",
  delete: host + "/coupon",
  addCoupon: host + "/coupon/addCoupon",
  getCoupon: host + "/coupon/getCoupon",
  push: host + "/coupon/pushMessage",
  pauseButton: host + "/coupon/updatePauseButton",
  update: host + "/coupon/updateCoupon"
};
const channel = {
  getList: host + "/channel",
  update: host + "/channel",
  addChannel: host + "/channel",
  getChannelList: host +"/statistics/channel/invitationCode",
  downloadChannelList: host +"/statistics/channel/invitationCode/export",
  getPageNameList: host +"/channel/package",
  getH5List: host +"/statistics/channel/h5",
  downloadH5PageNameList: host +"/statistics/channel/h5/export",
  getAFList: host +"/statistics/channel/af",
  getAFDailyList: host +"/statistics/channel/af/day",
  downloadAFList: host +"/statistics/channel/af/export",
  downloadAFDailyList: host +"/statistics/channel/af/day/export",
  channelBranch: {
    getChannelBranch: host + "/channel/branch",
    addChannelBranch: host + "/channel/branch",
    invitationCode: host + "/channel/branch/invitationCode",
    unUsedQuantity: host + "//channel/branch/invitationCode/unUsedQuantity",
    update: host + "/channel/branch",
    export: host + "/channel/branch/export",
    import: host + "/channel/branch/import",
    generate: host + "/channel/branch/invitationCode/generate"
  },
  channelH5: {
    getChannelH5: host + "/channel/h5s",
    addChannelH5: host + "/channel/h5",
    update: host + "/channel/h5",
    package: host + "/channel/package",
  }
};
const productCenter = {
  product: {
    getProduct: host + "/loanProduct/queryByParam",
    addProduct: host + "/loanProduct/add",
    updateProduct: host + "/loanProduct",
    deleteProduct: host + "/loanProduct/delete",
    settleRule: host + "/loanProduct/settlerule",
    loanProductPreview: host + "/loanProduct/preview",
    realtime: host + "/loanProduct/realtime/update",
  },
  userLevel: {
    getUserLevel: host + "/loanUserLevel/queryByParam",
    addUserLevel: host + "/loanUserLevel/add",
    updateUserLevel: host + "/loanUserLevel/update",
    deleteUserLevel: host + "/loanUserLevel/delete",
    realtimeUpdate: host + "/loanUserLevel/realtimeupdate",

    getLoanProduct: host + "/loanProduct/productUserType"
  },
  contract: {
    getContract: host + "/contract/queryContractList",
    getAllContractProtocolList: host + "/contract/getAllContractProtocolList",
    deleteContract: host + "/contract/deleteContract",
    updateContract: host + "/contract/editContract",
    addContract: host + "/contract/saveContract"
  },
  calendar:{
    getCalendar: host + "/work/calendar/get",
    changeWorkDay: host + "/work/calendar/state"
  },
  helpCenter:{
    getHelp: host + "/messageCenter/helpCenter/helps",
    getMaxOrderAddOne : host + "/messageCenter/helpCenter/maxOrder",
    addHelp: host + "/messageCenter/helpCenter/help",
    updateHelp: host + "/messageCenter/helpCenter/help",
    deleteHelp:host + "/messageCenter/helpCenter/help",
    moveUp: host +"/messageCenter/helpCenter/help/shiftUp",
    moveDown: host +"/messageCenter/helpCenter/help/shiftDown"
  },
  SMSTemplate:{
    getSMS: host + "/msg/query",
    updateSMS: host + "/msg/update"
  },
  pushTemplate:{
    getPushTemplate: host + "/appMsgPush/query",
    updatePushTemplate: host + "/appMsgPush/update"
  },
  contactInfo:{
    getContactInfo: host + "/contactInfo",
    updateContactInfo: host + "/contactInfo/update"
  },
  bankManagement:{
    getBank: host + "/bankManage",
    getMaxSortAddOne : host + "/bankManage/getMaxSort",
    addBank : host + "/bankManage/create",
    updateBank : host + "/bankManage/update",
    deleteBank : host + "/bankManage",
    moveUpInBank: host + "/bankManage/shiftUp",
    moveDownInBank: host + "/bankManage/shiftDown"
  },
  versionUpdate:{
    getVersion: host +"/version",
    deleteVersion: host +"/version",
    addVersion: host +"/version/create",
  }
};
const bank = {
  list: host + "/support/bank",
  add: host + "/support/bank/save",
  update: host + "/support/bank/update",
  delete: host + "/support/bank"
};
const reportCenter = {
  channelData: host + "/statistics/channel/invitationCode",
  channelExport: host + "/statistics/channel/invitationCode/export",
  channelH5Export: host + "/statistics/channel/h5/export",
  channelDataH5: host + "/statistics/channel/h5",
  financeCurrent: host + "/statics/finance/current",
  financeHistory: host + "/statics/finance/history",
  platformCurrent: host + "/statics/platform/current",
  platformHistory: host + "/statics/platform/history",
  convert: host + "/user/convert",
  platformConversionDataTopList: host + "/statements/platform/promotionconversion",
  platformConversionDataBottomList: host + "/statements/platform/promotionconversionDetail",
  downloandBottomList: host + "/statements/platform/promotionconversion/export",
  platformUsersBuriedTopList: host + "/statements/platform",
  platformUsersBuriedBottomList: host + "/statements/platform/list"
};
const collectionBusiness={
  getData: host + "/overdue/businessConfig/list",//搜索催收阶段
  addData: host + "/overdue/businessConfig",
  updateData: host + "/overdue/businessConfig"
};
const collectionManagement={
  caseManagement:{
    loanUser:host + "/loanUserLevel/queryByParam",
    queryOverdueOrder: host + "/overdueCaseManage/queryOverdueOrder",
    allocate: host + "/overdueCaseManage/allocate",
    setOverdueOrderKeep: host + "/overdueCaseManage/setOverdueOrderKeep",
    getAllOverdueStaff: host + "/overdueMembersManage/getAllOverdueStaff",
    exportOverdueOrder: host + "/overdueCaseManage/exportOverdueOrder"
  },
  memberManagement:{
    addOverdueFirm: host + "/overdueMembersManage/addOverdueFirm",
    queryOverdueFirm: host + "/overdueMembersManage/queryOverdueFirm",
    updateOverdueFirm: host + "/overdueMembersManage/updateOverdueFirm",

    addOverdueGroup: host + "/overdueMembersManage/addOverdueGroup",
    queryOverdueGroup: host + "/overdueMembersManage/queryOverdueGroup",
    updateOverdueGroup: host + "/overdueMembersManage/updateOverdueGroup",

    addOverdueStaff: host + "/overdueMembersManage/addOverdueStaff",
    queryOverdueStaff: host + "/overdueMembersManage/queryOverdueStaff",
    updateOverdueStaff: host + "/overdueMembersManage/updateOverdueStaff",

    getAllOverdueFirm: host + "/overdueMembersManage/getAllOverdueFirm",
    getAllOverdueGroup: host + "/overdueMembersManage/getAllOverdueGroup"
  },
  record:{
    queryOverdueCallRecord: host + "/overdueRecord/queryOverdueCallRecord",
    exportOverdueCallRecord:host + "/overdueRecord/queryOverdueCallRecord/export",
    queryOverdueMessageRecord: host + "/overdueRecord/queryOverdueMessageRecord",
    exportOverdueMessageRecord:host + "/overdueRecord/queryOverdueMessageRecord/export"
  },
  report:{
    exportGroupStatement: host + "/overdueStatement/exportGroupStatement",
    exportStatement: host + "/overdueStatement/exportStatement",
    getGroupStatement: host + "/overdueStatement/getGroupStatement",
    getStatement: host + "/overdueStatement/getStatement",
    loanUser:host + "/loanUserLevel/queryByParam",
    overdueReceivableStageStatement: host + "/overdueStatement/overdueReceivableStageStatement",
    exportOverdueReceivableStageStatement: host + "/overdueStatement/exportOverdueReceivableStageStatement",
    total: host + "/overdueStatement/getUrgentRecallGroupStatement/total",
    exportTotal: host + "/overdueStatement/getUrgentRecallGroupStatement/total/export",
    detail: host + "/overdueStatement/getUrgentRecallGroupStatement/detail",
    exportDetail: host + "/overdueStatement/getUrgentRecallGroupStatement/detail/export"
  },
  amountBreakdown:{
    urgentRecallAmountDetail: host + "/overdueRecord/urgentRecallAmountDetail",//催回金额明细
    exportDetail: host + "/overdueRecord/urgentRecallAmountDetail/export"//催回金额明细导出
  }
};
const collectWorkBench = {
  recallDetail: host + "/urgentRecall/urgentRecallDetail",
  addRecallLog: host + "/urgentRecall/addUrgentRecallLog",
  adminReport: host + "/urgentRecall/getAdminReport",
  overdueOrder: host + "/overdueCaseManage/queryOverdueOrderInWorkbench",
  exportOverdueOrder: host + "/overdueCaseManage/exportOverdueOrderInWorkbench",
  getRecallLog: host + "/urgentRecall/queryUrgentRecallLog",
  getWebCallList: host + "/urgentRecall/queryWebCallLog",
  sendMsg: host + "/urgentRecall/sendMsg",
  queryMsgLog: host + "/urgentRecall/queryMsgLog",
  queryFlowHistory: host + "/urgentRecall/queryFlowHistory",
  remindRecord: host + "/urgentRecall/queryRemindRecordByParam",
  updateRemind: host + "/urgentRecall/batchUpdateRemindRecordByParam",
  exhibition: host + "/urgentRecall/exhibitionPeriod",
  getExhibition: host + "/urgentRecall/exhibitionPeriodInfo",
  getCurrentEmployeeFirmID: host + "/overdueMembersManage/getCurrentEmployeeFirmID",
  getCurrentEmployeeStaffID : host + "/overdueMembersManage/getCurrentEmployeeStaffID"
};
const appMarketing={
  recommend:{
    getRecommend: host + "/homepage/recommends",
    addRecommend: host + "/homepage/recommend",
    updateRecommend: host + "/homepage/recommend",
    deleteRecommend: host + "/homepage/recommend",
  },
  adPush:{
    popUps:{
      getPopUps: host +"/advertising/popUpWindows",
      addPopUps: host +"/advertising/popUpWindow",
      updatePopUps: host +"/advertising/popUpWindow",
      deletePopUps: host +"/advertising/popUpWindow",
      setPushWay: host +"/advertising/popUpWindow/pushWay",
      getPushWay: host +"/advertising/popUpWindow/pushWay",
      moveUp: host +"/advertising/popUpWindow/moveUp",
      moveDown: host +"/advertising/popUpWindow/moveDown"
    },
    splashScreen:{
      getSplashScreen: host +"/advertising/splashScreens",
      addSplashScreen: host +"/advertising/splashScreen",
      updateSplashScreen: host +"/advertising/splashScreen",
      deleteSplashScreen: host +"/advertising/splashScreen",
      setPushWay: host +"/advertising/splashScreen/pushWay",
      getPushWay: host +"/advertising/splashScreen/pushWay",
      moveUp: host +"/advertising/splashScreen/moveUp",
      moveDown: host +"/advertising/splashScreen/moveDown"
    }
  }
};
const msgCenter={
  msgPush:{
    getMsgPush: host + "/msgPush/BusinessParamConfigQuery",
    addMsgPush: host + "/msgPush/add",
    updateMsgPush: host + "/msgPush/update",
    deleteMsgPush:host + "/msgPush/delete",
    getNotice: host + "/msgPush/noticeQuery",
    addNotice: host + "/msgPush/add",
    updateNotice: host + "/msgPush/update",
    deleteNotice:host + "/msgPush/delete",
  },
  helpCenter:{
    getHelp: host + "/messageCenter/helpCenter/helps",
    addHelp: host + "/messageCenter/helpCenter/help",
    updateHelp: host + "/messageCenter/helpCenter/help",
    deleteHelp:host + "/messageCenter/helpCenter/help",
    moveUp: host +"/messageCenter/helpCenter/help/shiftUp",
    moveDown: host +"/messageCenter/helpCenter/help/shiftDown"
  },
  feedBack:{
    getFeedBack:host + "/online/communication/experiences",
    getFeedBackInfo:host + "/online/communication/experience",
    updateFeedBackInfo:host + "/online/communication/experience/update"
  },
  repayment:{
    getRepayment:host + "/repayProofs",
    getRepaymentInfo:host + "/repayProof"
  }
};
export const GLOBAL = {
  API: {
    system: system,
    usr: usr,
    finance: finance,
    risk: risk,
    order: order,
    default: defaultIndex,
    bank: bank,
    channel: channel,
    coupon: coupon,
    reportCenter: reportCenter,
    productCenter: productCenter,
    collectionBusiness:collectionBusiness,
    collectionManagement:collectionManagement,
    collectWorkBench: collectWorkBench,
    appMarketing: appMarketing,
    msgCenter: msgCenter
  },
  rights: "@copyright 2018 xxx"
};

