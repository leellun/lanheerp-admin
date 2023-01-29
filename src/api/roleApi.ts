import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page } from "@/api/types";
export interface Role {
  id: string;
  name: string;
  code: string;
  level: number;
  enabled: number;
  description: string;
}
export interface RoleSearch {
  pageNo: number;
  pageSize: number;
  name: string;
  enabled: number;
}
export const _getAllRoles = () => {
  return httpRequest<any, Array<Role>>({
    url: "/user/role/all",
    method: "get",
  });
};
export const _getRolesPage = (data: RoleSearch) => {
  return httpRequest<any, Page<Role>>({
    url: "/user/role/list",
    method: "post",
    data,
  });
};
export const _getRole = (id: string) => {
  return httpRequest<any, Role>({
    url: `/user/role/${id}`,
    method: "get",
  });
};
export const _addRole = (data: Role) => {
  return httpRequest<any, any>({
    url: `/user/role`,
    method: "post",
    data,
  });
};
export const _updateRole = (data: Role) => {
  return httpRequest<any, any>({
    url: `/user/role`,
    method: "put",
    data,
  });
};
export const _deleteRole = (data: string[]) => {
  return httpRequest<any, Role>({
    url: `/user/role`,
    method: "delete",
    data,
  });
};
export const _enableRole = (id: string, enable: number) => {
  return httpRequestWithMsg<any, any>({
    url: `/user/role/enable/${id}`,
    method: "put",
    params: { enable },
  });
};

export const _getMenuPermission = (roleId: string) => {
  return httpRequest<any, Array<string>>({
    url: `/user/role/permission/${roleId}`,
    method: "get"
  });
};

export const _addMenuPermission = (roleId: string, data: string[]) => {
  return httpRequestWithMsg<any, any>({
    url: `/user/role/permission/${roleId}`,
    method: "post",
    data,
  });
};
