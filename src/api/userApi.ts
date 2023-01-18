import request from "@/utils/request";
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
  nickName: string;
  gender: number;
  phone: string;
  email: string;
  avatar: string;
  accountType: number;
  enabled: number;
  failLockTime: string;
  pwdResetTime: string;
  lastLoginTime: string;
  deptName: string;
  roleName: string;
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
  return request<any, Page<UserItem>>({
    url: "/user/user/list",
    method: "post",
    data,
  });
};
