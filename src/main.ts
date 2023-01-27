import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "virtual:svg-icons-register";
import "@/style/global.less";
import { useSettingStore } from "@/store/setting";
import storage from "@/utils/Storage";
import { SITE_SETTINGS } from "@/store/mutation-types";
import * as Icons from "@ant-design/icons-vue";

const app = createApp(App);
app.use(createPinia());
app.use(router);

// 开始使用全局图标
const icons: any = Icons;
for (const i in icons) {
  // 循环注册组件
  app.component(i, icons[i]);
}
app.mount("#app");

const setting = storage.get(SITE_SETTINGS);
useSettingStore().setSetting(setting);
