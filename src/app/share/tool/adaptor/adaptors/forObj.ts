import { reflector } from "./reflector";
export const forObj = function(
  rawObj: Object,
  map: Object,
  reverse: boolean = false
) {
  if (rawObj) {
    let _obj = reflector(rawObj, map, reverse);
    return {
      raw: rawObj,
      data: _obj
    };
  } else {
    return {
      raw: rawObj,
      data: rawObj
    };
  }
};
