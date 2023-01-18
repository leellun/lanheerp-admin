import { TRouter } from "./types";
import { Router, RouteRecordRaw } from "vue-router";
import { BasicLayout, RouteView,BlankLayout } from "@/layouts";

import { getRoutePages } from "@/utils/batchImportFiles";
import { usePermissionStore } from "@/store/permission";
import { cloneDeep } from "lodash";
import { AnyFn } from "@vueuse/core";

const layouts: { [x: string]: Function } = {
  BasicLayout,
  RouteView,
  BlankLayout,
  ...getRoutePages(),
};
// 根级菜单
export const rootRouter: TRouter = {
  name: "index",
  path: "/",
  component: BasicLayout,
  redirect: "目前逻辑是重定向到第一个菜单",
  meta: {
    title: "",
  },
  children: [],
};

//获取第一个菜单
export const getLeafMenuForFShowPath = (menu: TRouter) => {
  var router: TRouter = getLeafMenuForFShow(menu);
  return router?.path;
};
//获取第一个叶子菜单
export function getLeafMenuForFShow(menu: TRouter) {
  let menuArray = new Array<TRouter>();
  menuArray.push(menu);
  while (menuArray.length > 0) {
    let tempMenuArray = new Array<TRouter>();
    for (let item of menuArray) {
      if (item.children != undefined && item.children.length > 0) {
        tempMenuArray.push(...item.children);
      } else {
        if (
          item.meta == undefined ||
          item.meta.hidden == undefined ||
          !item.meta.hidden
        ) {
          return item;
        }
      }
    }
    menuArray = tempMenuArray;
  }
  return menu;
}
export function loadMenus(router: Router) {
  generateAsyncRoutes(router, rootRouter.children);
}
//构建路由
export const generateAsyncRoutes = (router: Router, menus?: Array<any>) => {
  if (!menus) {
    return;
  }
  resetMenuPath("", menus);
  const permissionStore = usePermissionStore();
  permissionStore.setMenus(cloneDeep(menus));

  rootRouter.children = menus;

  // const newMenus:Array<TRouter> = new Array<TRouter>()
  // refreshMenuData2(rootRouter,newMenus)
  // rootRouter.children = newMenus

  refreshMenuData(rootRouter);
  rootRouter.redirect = getLeafMenuForFShowPath(rootRouter);
  router.removeRoute(rootRouter.name);
  router.addRoute(rootRouter as unknown as RouteRecordRaw);
};

//刷新菜单数据
const resetMenuPath = (parentPath: string, menus: Array<TRouter>) => {
  menus.forEach((item) => {
    if (item.path == undefined) {
      item.path = item.name;
    }
    if (!item.path.startsWith("/")) {
      item.path = parentPath + "/" + item.path;
    }
    if (item.children != undefined && item.children.length > 0) {
      resetMenuPath(item.path, item.children);
    }
  });
};
//刷新菜单数据
const refreshMenuData = (menu: TRouter) => {
  if (menu.children != undefined && menu.children.length > 0) {
    menu.children.forEach((item) => {
      if (
        item.component != undefined &&
        item.component != "" &&
        typeof item.component == "string"
      ) {
        item.component = layouts[item.component];
      }
      refreshMenuData(item);
    });
  } else {
    delete menu.children;
  }
};
//刷新菜单数据
const refreshMenuData2 = (menu: TRouter,menus:Array<TRouter>) => {
  if (menu.children != undefined && menu.children.length > 0) {
    menu.children.forEach((item) => {
      if (
        item.component != undefined &&
        item.component != "" &&
        typeof item.component == "string"
      ) {
        item.component = layouts[item.component];
      }
      refreshMenuData2(item,menus);
    });
  } else {
    delete menu.children;
    menus.push(menu)
  }
};