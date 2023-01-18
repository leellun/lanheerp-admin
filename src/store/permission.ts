import { TRouter } from "@/router/types";
import { defineStore } from "pinia";
interface PermissionState {
  menus: Array<TRouter>;
  tagPaths: Array<string>;
  isInitMenu: boolean;
}
export const usePermissionStore = defineStore("permission", {
  state: (): PermissionState => {
    return {
      menus: [],
      tagPaths:[],
      isInitMenu: false,
    };
  },
  getters: {
    getMenus: (state) => {
      return state.menus;
    },
  },
  actions: {
    setMenus(menus: Array<TRouter>) {
      this.menus = menus;
      this.isInitMenu = true;
    },
    async addVisitedRoute(route: any) {
      // console.log(route);
    },
  },
});
