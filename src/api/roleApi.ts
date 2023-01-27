import { httpRequest } from "@/utils/request";
import type { Page } from "@/api/types";
export interface Role {
  id: string;
  name: string;
  code: string;
  level: number;
  description: string;
}
export interface RoleSearch{

}
export const _getAllRoles = () => {
  return httpRequest<any, Array<Role>>({
    url: "/user/role/all",
    method: "get",
  });
};
export const _getRolesPage = (data: RoleSearch) => {
  return httpRequest<any, Page<Role>>({
    url: "/user/role",
    method: "get",
    data
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
export const _deleteRole = (id: string) => {
  return httpRequest<any, Role>({
    url: `/user/role/${id}`,
    method: "delete",
  });
};
