// vite.config.ts
import { defineConfig } from "file:///G:/java/project/project/lanheerp-web/node_modules/vite/dist/node/index.js";
import vue from "file:///G:/java/project/project/lanheerp-web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///G:/java/project/project/lanheerp-web/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import VueSetupExtend from "file:///G:/java/project/project/lanheerp-web/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import AutoImport from "file:///G:/java/project/project/lanheerp-web/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///G:/java/project/project/lanheerp-web/node_modules/unplugin-vue-components/dist/vite.mjs";
import { createSvgIconsPlugin } from "file:///G:/java/project/project/lanheerp-web/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import viteCompression from "file:///G:/java/project/project/lanheerp-web/node_modules/vite-plugin-compression/dist/index.mjs";
import { terser } from "file:///G:/java/project/project/lanheerp-web/node_modules/rollup-plugin-terser/rollup-plugin-terser.mjs";
import { visualizer } from "file:///G:/java/project/project/lanheerp-web/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
  NutuiResolve,
  AntdResolve
} from "file:///G:/java/project/project/lanheerp-web/node_modules/vite-plugin-style-import/dist/index.mjs";
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  NaiveUiResolver
} from "file:///G:/java/project/project/lanheerp-web/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "G:\\java\\project\\project\\lanheerp-web";
var vite_config_default = defineConfig({
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 8081,
    proxy: {
      "/api": {
        target: "http://localhost:88",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    VueSetupExtend(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz"
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        AntDesignVueResolver(),
        NaiveUiResolver()
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        AntDesignVueResolver(),
        NaiveUiResolver()
      ]
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    terser({
      numWorkers: 1
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    }),
    createStyleImportPlugin({
      resolves: [
        AndDesignVueResolve(),
        VantResolve(),
        ElementPlusResolve(),
        NutuiResolve(),
        AntdResolve()
      ],
      libs: [
        {
          libraryName: "ant-design-vue",
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`;
          }
        }
      ]
    })
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__vite_injected_original_dirname, "src")
      },
      { find: /^~/, replacement: "" }
    ]
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxqYXZhXFxcXHByb2plY3RcXFxccHJvamVjdFxcXFxsYW5oZWVycC13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXGphdmFcXFxccHJvamVjdFxcXFxwcm9qZWN0XFxcXGxhbmhlZXJwLXdlYlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRzovamF2YS9wcm9qZWN0L3Byb2plY3QvbGFuaGVlcnAtd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiO1xuaW1wb3J0IFZ1ZVNldHVwRXh0ZW5kIGZyb20gXCJ2aXRlLXBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kXCI7XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tIFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb25cIjtcbmltcG9ydCB7IHRlcnNlciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXRlcnNlclwiO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcbmltcG9ydCB7XG4gIGNyZWF0ZVN0eWxlSW1wb3J0UGx1Z2luLFxuICBBbmREZXNpZ25WdWVSZXNvbHZlLFxuICBWYW50UmVzb2x2ZSxcbiAgRWxlbWVudFBsdXNSZXNvbHZlLFxuICBOdXR1aVJlc29sdmUsXG4gIEFudGRSZXNvbHZlLFxufSBmcm9tIFwidml0ZS1wbHVnaW4tc3R5bGUtaW1wb3J0XCI7XG5cbmltcG9ydCB7XG4gIEFudERlc2lnblZ1ZVJlc29sdmVyLFxuICBFbGVtZW50UGx1c1Jlc29sdmVyLFxuICBOYWl2ZVVpUmVzb2x2ZXIsXG59IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6IFwiLi9cIixcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgcG9ydDogODA4MSxcbiAgICBwcm94eToge1xuICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODhcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcIiksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVKc3goKSxcbiAgICBWdWVTZXR1cEV4dGVuZCgpLFxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICAvL1x1NzUxRlx1NjIxMFx1NTM4Qlx1N0YyOVx1NTMwNWd6XG4gICAgICB2ZXJib3NlOiB0cnVlLFxuICAgICAgZGlzYWJsZTogZmFsc2UsXG4gICAgICB0aHJlc2hvbGQ6IDEwMjQwLFxuICAgICAgYWxnb3JpdGhtOiBcImd6aXBcIixcbiAgICAgIGV4dDogXCIuZ3pcIixcbiAgICB9KSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKCksXG4gICAgICAgIEFudERlc2lnblZ1ZVJlc29sdmVyKCksXG4gICAgICAgIE5haXZlVWlSZXNvbHZlcigpLFxuICAgICAgXSxcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKCksXG4gICAgICAgIEFudERlc2lnblZ1ZVJlc29sdmVyKCksXG4gICAgICAgIE5haXZlVWlSZXNvbHZlcigpLFxuICAgICAgXSxcbiAgICB9KSxcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAvLyBcdTYzMDdcdTVCOUFcdTk3MDBcdTg5ODFcdTdGMTNcdTVCNThcdTc2ODRcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcbiAgICAgIGljb25EaXJzOiBbcmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInNyYy9hc3NldHMvaWNvbnNcIildLFxuICAgICAgLy8gXHU2MzA3XHU1QjlBc3ltYm9sSWRcdTY4M0NcdTVGMEZcbiAgICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCIsXG4gICAgfSksXG4gICAgLy9cdTUzOEJcdTdGMjlcbiAgICB0ZXJzZXIoe1xuICAgICAgbnVtV29ya2VyczogMSxcbiAgICB9KSxcbiAgICAvL1x1NjI1M1x1NTMwNVx1NTIwNlx1Njc5MFxuICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICB9KSxcbiAgICAvL1x1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NXZ1ZVx1NzY4NHN0eWxlXG4gICAgY3JlYXRlU3R5bGVJbXBvcnRQbHVnaW4oe1xuICAgICAgcmVzb2x2ZXM6IFtcbiAgICAgICAgQW5kRGVzaWduVnVlUmVzb2x2ZSgpLFxuICAgICAgICBWYW50UmVzb2x2ZSgpLFxuICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmUoKSxcbiAgICAgICAgTnV0dWlSZXNvbHZlKCksXG4gICAgICAgIEFudGRSZXNvbHZlKCksXG4gICAgICBdLFxuICAgICAgbGliczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGlicmFyeU5hbWU6IFwiYW50LWRlc2lnbi12dWVcIixcbiAgICAgICAgICBlc01vZHVsZTogdHJ1ZSxcbiAgICAgICAgICByZXNvbHZlU3R5bGU6IChuYW1lKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYGFudC1kZXNpZ24tdnVlL2VzLyR7bmFtZX0vc3R5bGUvaW5kZXhgO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJAXCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIiksXG4gICAgICB9LFxuICAgICAgeyBmaW5kOiAvXn4vLCByZXBsYWNlbWVudDogXCJcIiB9LFxuICAgIF0sXG4gIH0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIGxlc3M6IHtcbiAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1MsU0FBUyxvQkFBb0I7QUFDclUsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLG9CQUFvQjtBQUMzQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLHFCQUFxQjtBQUM1QixTQUFTLGNBQWM7QUFDdkIsU0FBUyxrQkFBa0I7QUFDM0I7QUFBQSxFQUNFO0FBQUEsRUFDQTtB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
