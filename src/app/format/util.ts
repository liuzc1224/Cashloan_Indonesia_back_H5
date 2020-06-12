import { SessionStorageService } from '../service/storage';

let sgo = new SessionStorageService;
//性别
export const sextransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['enums']['sex'];

  let val = EduLangEnum.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};
//订单状态
export const orderStatustransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['orderList']['allList']['status'] ;

  let val = EduLangEnum.find( item => {
    return item.value == value ;
  });

  return (val && val.name) || "未知状态" ;
};
//信审订单状态
export const reviewOrderStatustransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['common']['reviewOrderStatus'];

  let val = EduLangEnum.find( item => {
    return item.value == value ;
  });

  return (val && val.name) || "未知状态" ;
};
//催收订单状态
export const collectOrderStatustransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['common']['collectOrderStatus'];

  let val = EduLangEnum.find( item => {
    return item.value == value ;
  });

  return (val && val.name) || "未知状态" ;
};
//教育状况
export const edutransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['enums']['degree'];

  let val = EduLangEnum.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};
//婚姻状况
export const marraytransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['enums']['marray'];

  let val = EduLangEnum.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};
//现居住时长
export const placefromtransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['enums']['well'];

  let val = EduLangEnum.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};
//社会身份
export const socialRolefromtransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['enums']['socialRole'];

  let val = EduLangEnum.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};
//收入来源
export const incSoufromtransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['enums']['incomeSource'];

  let val = EduLangEnum.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};
//发薪方式
export const payTtpefromtransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['enums']['incomeType'];

  let val = EduLangEnum.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};
//关系
export const relationfromtransform = (value: any): any => {

  let EduLangEnum = sgo.get("lang")['enums']['relation'];

  let val = EduLangEnum.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};
//空
export const nulltransform = (value: any): any => {

  if (value)
    return value
  else
    return "no";
};

//账户类型
export const accountTypetransform = (value: any): any => {

  let val = accountTyp.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};

const accountTyp = [{
  "name": "现金",
  "value": "1"
},{
  "name": "储蓄卡账户",
  "value": "2"
}]

//洲
const stateArr = [{
  "name": "Acre",
  "value": "1"
},
  {
    "name": "Alagoas",
    "value": "2"
  },
  {
    "name": "Amapá",
    "value": "3"
  },
  {
    "name": "Amazonas",
    "value": "4"
  },
  {
    "name": "Bahia",
    "value": "5"
  },
  {
    "name": "Ceará",
    "value": "6"
  },
  {
    "name": "Distrito Federal",
    "value": "7"
  },
  {
    "name": "Espírito Santo",
    "value": "8"
  },
  {
    "name": "Goiás",
    "value": "9"
  },
  {
    "name": "Maranhão",
    "value": "10"
  },
  {
    "name": "Mato Grosso",
    "value": "11"
  },
  {
    "name": "Mato Grosso do Sul",
    "value": "12"
  },
  {
    "name": "Minas Gerais",
    "value": "13"
  },
  {
    "name": "Pará",
    "value": "14"
  },
  {
    "name": "Paraíba",
    "value": "15"
  },
  {
    "name": "Paraná",
    "value": "16"
  },
  {
    "name": "Pernambuco",
    "value": "17"
  },
  {
    "name": "Piauí",
    "value": "18"
  },
  {
    "name": "Rio de Janeiro",
    "value": "19"
  },
  {
    "name": "Rio Grande do Norte",
    "value": "20"
  },
  {
    "name": "Rio Grande do Sul",
    "value": "21"
  },
  {
    "name": "Rondônia",
    "value": "22"
  },
  {
    "name": "Roraima",
    "value": "23"
  },
  {
    "name": "Santa Catarina",
    "value": "24"
  },
  {
    "name": "São Paulo",
    "value": "25"
  },
  {
    "name": "Sergipe",
    "value": "26"
  },
  {
    "name": "Tocantins",
    "value": "27"
  }
]

export const placetransform = (value: any): any => {

  let val = stateArr.find(item => {
    return item.value == value;
  });

  return (val && val.name) || "no";
};
