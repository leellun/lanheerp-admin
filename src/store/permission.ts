import { TRouter } from "@/router/types";
import { defineStore } from "pinia";
import { _getCatalogues,_getUserPermissions } from "@/api/system/menuApi";
interface PermissionState {
  menus: Array<TRouter>;
  tagPaths: Array<string>;
  permissions: Array<string>;
  isRouterMenuCheck: boolean;
}
export const usePermissionStore = defineStore("permission", {
  state: (): PermissionState => {
    return {
      menus: [],
      tagPaths:[],
      permissions:[],
      isRouterMenuCheck: false,
    };
  },
  getters: {
    getMenus: (state) => {
      return state.menus;
    },
  },
  actions: {
    isHasRouterMenu(){
      let check = this.isRouterMenuCheck
      this.isRouterMenuCheck = true
      return check;
    },
    setMenus(menus: Array<TRouter>) {
      this.menus = menus;
    },
    async getCatalogues() {
      try {
        let res = await _getCatalogues();
        return res.data;
      } catch (e) {
        return [];
      }
    },
    async getUserPermissions() {
      try {
        let res = await _getUserPermissions();
        this.permissions= res.data;
      } catch (e) {
      }
    },
  },
});
