import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page } from "@/api/types";
export interface Job {
  id: string;
  name: string;
  enabled: number;
  jobSort: number;
  gmtCreate: string;
}
export interface JobSearch {
  pageNo: number;
  pageSize: number;
  name: string;
  enabled: number;
}
export const _getAllJobs = () => {
  return httpRequest<any, Array<Job>>({
    url: "/user/job/all",
    method: "get",
  });
};
export const _getPageJobs = (data: JobSearch) => {
  return httpRequest<any, Page<Job>>({
    url: "/user/job/list",
    method: "post",
    data,
  });
};
export const _getJob = (id: string) => {
  return httpRequest<any, Job>({
    url: `/user/job/${id}`,
    method: "get",
  });
};
export const _addJob = (data: Job) => {
  return httpRequestWithMsg<any, any>({
    url: `/user/job`,
    method: "post",
    data,
  });
};
export const _updateJob = (data: Job) => {
  return httpRequestWithMsg<any, any>({
    url: `/user/job`,
    method: "put",
    data,
  });
};
export const _deleteJob = (data: string[]) => {
  return httpRequestWithMsg<any, any>({
    url: `/user/job`,
    method: "delete",
    data,
  });
};
export const _enableJob = (id: string, enable: number) => {
  return httpRequestWithMsg<any, any>({
    url: `/user/job/enable/${id}`,
    method: "put",
    params: { enable },
  });
};
