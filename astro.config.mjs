import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
  site: "https://toggle.supply",

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

  integrations: [sitemap()],
})
