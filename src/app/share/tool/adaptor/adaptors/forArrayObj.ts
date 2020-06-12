import { reflector } from "./reflector";
export const forArrayObj = function(
  rawArrayObj: Array<Object>,
  map: Object,
  reverse: boolean = false
) {
  if (rawArrayObj) {
    let _arr = [];
    rawArrayObj.forEach(arrItem => {
      _arr.push(reflector(arrItem, map, reverse));
    });

    return {
      raw: rawArrayObj,
      data: _arr
    };
  } else {
    return {
      raw: rawArrayObj,
      data: rawArrayObj
    };
  }
};
