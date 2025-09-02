// https://nuxt.com/docs/api/configuration/nuxt-config
import { SITE } from "../shared/utils/site";

export default defineNuxtConfig({
    app: {
         head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
             meta: [
                { name: "robots", content: "index, follow" },
                { property: "og:ttl", content: "604800" },
                { name: "darkreader-lock", content: "darkreader" },
                { property: "og:site_name", content: SITE.name }
            ],
        }
    },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
      '@nuxt/eslint',
      '@nuxt/ui',
      '@vueuse/nuxt',
      "nuxt-auth-utils"
  ],
    runtimeConfig: {
        secure: {
            salt: ""
        }
    },
})