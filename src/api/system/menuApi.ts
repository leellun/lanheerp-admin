import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page } from "../types";

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
  children: Array<Menu>;
}
export interface MenuSearch {
  pageNo: number;
  pageSize: number;
}
export const _getPageMenus = (params: MenuSearch) => {
  return httpRequest<any, Page<Menu>>({
    url: `/system/menu`,
    method: "get",
    params,
  });
};
export const _getCatalogues = async () => {
  return httpRequest<any, Array<Menu>>({
    url: `/system/menu/catalogue`,
    method: "get",
  });
};
export const _getUserPermissions = async () => {
  return httpRequest<any, Array<string>>({
    url: `/system/menu/permission`,
    method: "get",
  });
};
export const _getMenu = (id: string) => {
  return httpRequest<any, Menu>({
    url: `/system/menu/${id}`,
    method: "get",
  });
};
export const _getSubMenus = (pid: string) => {
  return httpRequest<any, Array<Menu>>({
    url: `/system/menu/sub/${pid}`,
    method: "get",
  });
};
export const _addMenu = (data: Menu) => {
  return httpRequestWithMsg<any, any>({
    url: `/system/menu`,
    method: "post",
    data,
  });
};
export const _updateMenu = (data: Menu) => {
  return httpRequestWithMsg<any, any>({
    url: `/system/menu`,
    method: "put",
    data,
  });
};
export const _updateMenuSort = (id: string, menuSort: number) => {
  return httpRequest<any, any>({
    url: `/system/menu/sort/${id}`,
    method: "put",
    params: { menuSort },
  });
};
export const _deleteMenu = (data: string[]) => {
  return httpRequestWithMsg<any, any>({
    url: `/system/menu`,
    method: "delete",
    data,
  });
};
export const _enableMenu = (id: string, enable: number) => {
  return httpRequestWithMsg<any, any>({
    url: `/system/menu/enable/${id}`,
    method: "put",
    params: { enable },
  });
};
