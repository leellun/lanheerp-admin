import request,{ httpRequest,httpRequestWithMsg } from "@/utils/request";
import type { Page } from "@/api/types";

export interface AuthResult {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  code: number;
  msg: string;
}
export interface UserSearch {
  pageNo: number;
  pageSize: number;
  blurry: string;
  gmtCreate: Array<string>;
  enabled: number;
  deptIds: Array<string>;
}
export interface UserItem {
  id: string;
  gmtCreate: string;
  gmtModified: string;
  username: string;
  realName: string;
  nickName: string;
  gender: number;
  phone: string;
  email: string;
  avatar: string;
  enabled: number;
  failLockTime: string;
  pwdResetTime: string;
  lastLoginTime: string;
  deptName: string;
  roleName: string;
  canDeleted?: number;
}
export interface UserRequest {
  id: String;
  username: string;
  realName: string;
  nickName: string;
  deptId: String;
  deptName: String;
  gender: number;
  phone: string;
  email: string;
  avatar?: string;
  enabled?: number;
  jobId: string;
  roleIds: string[];
}
export const _auth_login = (username: string, password: string) => {
  return request<any, AuthResult>({
    url: "/uaa/oauth/token",
    method: "post",
    params: {
      client_id: "c1",
      client_secret: "secret",
      grant_type: "password",
      username,
      password,
    },
  });
};

export const _getUsersPage = (data: UserSearch) => {
  return httpRequest<any, Page<UserItem>>({
    url: "/system/user/list",
    method: "post",
    data,
  });
};
export const _addUser = (data: UserRequest) => {
  return httpRequest<any, any>({
    url: "/system/user",
    method: "post",
    data,
  });
};
export const _updateUser = (data: UserRequest) => {
  return httpRequest<any, any>({
    url: "/system/user",
    method: "put",
    data,
  });
};
export const _enableUser = (id: string, enable: number) => {
  return httpRequestWithMsg<any, any>({
    url: `/system/user/enable/${id}`,
    method: "put",
    params: { enable },
  });
};
export const _getUser = (id: string) => {
  return httpRequest<any, UserRequest>({
    url: `/system/user/${id}`,
    method: "get",
  });
};
export const _deleteUser = (data: string[]) => {
  return httpRequest<any, any>({
    url: `/system/user`,
    method: "delete",
    data
  });
};
export const _resetPass = (id: string) => {
  return httpRequestWithMsg<any, any>({
    url: `/system/user/resetPass/${id}`,
    method: "put"
  });
};
