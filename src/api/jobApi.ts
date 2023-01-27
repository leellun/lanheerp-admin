import { httpRequest } from "@/utils/request";
import type { Page } from "@/api/types";
export interface Job {
  id: string;
  name: string;
  enabled: number;
  jobSort: number;
}
export const _getAllJobs = () => {
  return httpRequest<any, Array<Job>>({
    url: "/user/job/all",
    method: "get",
  });
};
