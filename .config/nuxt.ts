// https://nuxt.com/docs/api/configuration/nuxt-config
import {APP_INFO} from "../shared/utils/site";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            meta: [
                {name: "robots", content: "index, follow"},
                {property: "og:ttl", content: "604800"},
                {property: "og:site_name", content: APP_INFO.name}
            ],
        }
    },
    modules: [
      '@nuxt/eslint',
      '@nuxt/ui',
      '@vueuse/nuxt',
      "nuxt-auth-utils",
      '@nuxtjs/i18n',
      "@nuxt/fonts",
      "@nuxt/icon",
      '@nuxt/image',
      '@vueuse/motion/nuxt',
    ],
    runtimeConfig: {
        secure: {
            salt: ""
        }
    },
    css: ['~/assets/css/main.css'],
    icon: {
        mode: "svg",
        clientBundle: {
            scan: true,
            sizeLimitKb: 2048
        },
        customCollections: [
            {
                prefix: 'local',
                dir: './assets/icons',
            },
        ],
    },
    i18n: {
        defaultLocale: 'en',
        langDir: 'locales/',
        locales: [
            {
                code: 'en',
                iso: 'en-US',
                flag: 'flag:us-4x3',
                dir: 'ltr',
                name: 'English',
                file: 'en.js',
            },
            {
                code: 'ar',
                iso: 'ar-SA',
                flag: 'flag:sa-4x3',
                dir: 'rtl',
                name: 'Arabic',
                file: 'ar.js',
            },
        ],
    },
})