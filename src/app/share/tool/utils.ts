import { dataFormat } from "../../format";
export const ObjToArray = (obj: Object) => {
  const keys = [];
  const vals = [];

  for (let key in obj) {
    keys.push(key);
    vals.push(obj[key]);
  }
  return {
    keys: keys,
    vals: vals
  };
};

export const DateToStamp = (dateString: string) => {
  if (dateString) {
    const date = new Date(dateString);
    return date.getTime();
  } else {
    return "";
  }
};

export const GetNow = (isTimeStamp: boolean) => {
  if (isTimeStamp) {
    const date = new Date();
    return date.getTime();
  } else {
    const date = new Date().getTime() + "";
    return dataFormat(date);
  }
};

export const getParams = (url: string) => {
  let _url = url || window.location.href;
  let index = _url.indexOf("?");
  let params = {};
  let reg = /\?/g;
  if (_url.match(reg)) {
    let question_mark_count = _url.match(reg).length; //url中的问号数量
    if (question_mark_count > 1) {
      index = _url.lastIndexOf("?");
    }
  }
  if (index !== -1) {
    let paramsStr = _url.slice(index + 1); // 获取到问号以后的字符串
    let paramsArr = paramsStr.split("&");
    // 把url上的所有参数塞到json对象中,以键值对的方式保存
    for (let i = 0, length = paramsArr.length, param; i < length; i++) {
      param = paramsArr[i].split("=");
      params[param[0]] = param[1];
    }
  }
  return params;
};
