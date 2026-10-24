import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { contactEnabled } from "./src/config/contact.mjs";

// Preview is deliberately the default. Production requires a reviewed cutover.
export default defineConfig({
  site: "https://yukamiya.me",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (url) =>
        !/\/(thanks|404|admin)(\/|\.)/.test(url) &&
        (contactEnabled || !/\/contact\//.test(url)),
    }),
  ],
  build: { format: "directory" },
});
