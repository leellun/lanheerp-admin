import request from "@/utils/request";
export interface Dept {
  id: string;
  name: string;
  pid: string;
  deptSort: number;
  enabled: number;
  gmtCreate: string;
  gmtModified: string;
  isLeaf: boolean;
  subCount: number;
  children: Array<Dept>
}
export const _getSubDepts = (pid: string) => {
  return request<any, Array<Dept>>({
    url: `/user/dept/sub/${pid}`,
    method: "get",
  });
};
export const _searchDepts = (name: string) => {
  return request<any, Array<Dept>>({
    url: `/user/dept/search`,
    method: "get",
    params:{
      name
    }
  });
};
