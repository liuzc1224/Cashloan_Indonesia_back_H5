interface menuItem {
  name?: string;
  reflect?: string;
  type?:
    | "text"
    | "button"
    | "mark"
    | "select"
    | "selectArr"
    | "checkbox"
    | "line"
    | "img"
    | "date"
    | "switch"
    | "audio";
  fn?: Function;
  checkAll?: Function;
  filter?: Function | Object;
  color?: string;
  width?: string;
  markColor?: Object;
  textData?: string;
  textColor?: Object;
  sort?: boolean;
  innerHTML?: boolean;
  sortFn?: Function;
}

interface btnGroup {
  title?: string;
  data?: Array<btnItem>;
}

interface btnItem {
  textColor?: string;
  name?: string;
  ico?: string;
  bindFn?: Function;
  showContion?: Object;
}

export interface TableData {
  tableTitle?: Array<menuItem>;
  data?: Array<Object>;
  showIndex?: boolean;
  loading?: boolean;
  btnGroup?: btnGroup;
}
