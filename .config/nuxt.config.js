// filepath: /Users/aamin/Development/realestate/app/nuxt.config.js
// JavaScript version of the Nuxt config (TypeScript removed)
export default {
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-auth-utils', '@vueuse/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  }
}