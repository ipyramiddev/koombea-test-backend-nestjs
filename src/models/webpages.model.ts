/* eslint-disable prettier/prettier */

export class WebPage {
  id: number;
  title: string;
  url: string;
  userId: number;
  status: number;
  links?: Link[];
  linkCnt?: number;
}

export class Link {
  id: number;
  url: string;
  name: string;
  pageId: number;
}
