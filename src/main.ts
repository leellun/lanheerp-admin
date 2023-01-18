import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import 'virtual:svg-icons-register';
import '@/style/global.less';
import { useSettingStore } from "@/store/setting";
import storage from "@/utils/Storage";
import { SITE_SETTINGS } from "@/store/mutation-types";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");

const setting = storage.get(SITE_SETTINGS);
useSettingStore().setSetting(setting);
