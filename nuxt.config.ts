export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    "@nuxtjs/tailwindcss",
  ],
  axios: {
    baseURL: 'http://127.0.0.1:5000', // FlaskサーバーのURL
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL
    }
  },

  css: ['~/assets/css/index.scss'],
  build: {
    transpile: ['three'],
  },
  head: {
    script: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js",
        type: "text/javascript",
      },
    ],
  },
})
