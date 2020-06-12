export const reflector = function(
  rawObj: Object,
  map: Object,
  reverse: boolean = false
) {
  if (rawObj) {
    let _obj = {};

    Object.keys(rawObj).forEach(item => {
      let reflect = map[item];

      if (reflect) {
        if (reverse) {
          _obj[reflect] = _obj[item];
        } else {
          _obj[reflect] = rawObj[item];
        }
      } else {
        _obj[item] = rawObj[item];
      }
    });
    return _obj;
  } else {
    return rawObj;
  }
};
