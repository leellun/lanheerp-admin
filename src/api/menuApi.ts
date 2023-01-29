import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page } from "./types";

export interface Menu {
  id: string;
  gmtCreate: string;
  pid: string;
  parentName: string;
  subCount: number;
  type: number;
  title: string;
  name: string;
  component: string;
  menuSort: number;
  icon: string;
  path: string;
  target: number;
  keepAlive: number;
  enabled: number;
  hidden: number;
  permission: string;
  children:Array<Menu>
}
export interface MenuSearch {
  pageNo: number;
  pageSize: number;
}
export const _getPageMenus = (params: MenuSearch) => {
  return httpRequest<any, Page<Menu>>({
    url: `/user/menu`,
    method: "get",
    params,
  });
};
export const _getMenu = (id: string) => {
  return httpRequest<any, Menu>({
    url: `/user/menu/${id}`,
    method: "get"
  });
};
export const _getSubMenus = (pid: string) => {
    return httpRequest<any, Array<Menu>>({
      url: `/user/menu/sub/${pid}`,
      method: "get",
    });
  };
export const _addMenu = (data: Menu) => {
    return httpRequestWithMsg<any, any>({
      url: `/user/menu`,
      method: "post",
      data,
    });
};
export const _updateMenu = (data: Menu) => {
    return httpRequestWithMsg<any, any>({
      url: `/user/menu`,
      method: "put",
      data,
    });
  };
  export const _updateMenuSort = (id: string, menuSort: number) => {
    return httpRequest<any, any>({
      url: `/user/menu/sort/${id}`,
      method: "put",
      params: { menuSort },
    });
  };
  export const _deleteMenu = (data: string[]) => {
    return httpRequestWithMsg<any, any>({
      url: `/user/menu`,
      method: "delete",
      data,
    });
  };
  export const _enableMenu = (id: string, enable: number) => {
    return httpRequestWithMsg<any, any>({
      url: `/user/menu/enable/${id}`,
      method: "put",
      params: { enable },
    });
  };