import { TRouter } from "@/router/types";
import { defineStore } from "pinia";
import { _getCatalogues,_getUserPermissions } from "@/api/system/menuApi";
interface PermissionState {
  menus: Array<TRouter>;
  tagPaths: Array<string>;
  permissions: Array<string>;
  isInitMenu: boolean;
}
export const usePermissionStore = defineStore("permission", {
  state: (): PermissionState => {
    return {
      menus: [],
      tagPaths:[],
      permissions:[],
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
