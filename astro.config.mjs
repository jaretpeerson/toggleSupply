import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
  site: "https://toggle.supply",
  trailingSlash: "always",

  build: {
    inlineStylesheets: "always",
  },

  devToolbar: {
    enabled: false,
  },

  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },

  integrations: [sitemap({ filter: (page) => !page.includes("/404") })],
})
