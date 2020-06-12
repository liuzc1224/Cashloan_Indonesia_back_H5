import { DateDeal } from "./date.basic.class";
let baseDate = new DateDeal();

export const dataFormat = (timeStamp: string, format: string = "d-m-y h:i:s"): string => {
  return baseDate.format(timeStamp, format) || "no";
};

export const dataFormatRegular = (timeStamp: any, format: string = "y-m-d h:i:s"): string => {
  return baseDate.format(timeStamp, format);
};

export const unixTime = (timeStamp: any, format: string = "y-m-d h:i:s"): string => {
  if (timeStamp) {
    return baseDate.format(timeStamp, format) || "no";
  } else {
    return "";
  }
};

export const DateObjToString = function(date: Date) {
  if (date instanceof Date) {
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1) + "-" + fixZero(date.getDate());
  } else {
    return date;
  }
};

const fixZero = function(number: number) {
  return number >= 10 ? number : "0" + number;
};
