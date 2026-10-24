import type { APIRoute } from "astro";
export const GET: APIRoute = () =>
  new Response(
    import.meta.env.PUBLIC_RELEASE === "production"
      ? "User-agent: *\nAllow: /\nSitemap: https://yukamiya.me/sitemap-index.xml\n"
      : "User-agent: *\nDisallow: /\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
