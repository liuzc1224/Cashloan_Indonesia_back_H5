class Page {
  currentPage: number;
  dbIndex: number;
  dbNumber: number;
  pageSize: number;
  totalNumber: number;
  totalPage: number;
}
export class Response {
  code: number;
  success: boolean;
  data: Object | Array<any> | string;
  message: string;
  any?: any;
  page: Page;
}
