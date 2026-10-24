import https from "node:https";
import { lookup } from "node:dns/promises";
import ipaddr from "ipaddr.js";
import { canonicalize } from "./core.mjs";
export function publicAddress(address) {
  try {
    return ipaddr.parse(address).range() === "unicast";
  } catch {
    return false;
  }
}
export function allowedUrl(raw, policy) {
  const u = new URL(canonicalize(raw));
  if (!policy.allowedHosts.includes(u.hostname))
    throw new Error("host-not-allowed");
  return u;
}
// Resolve all addresses and pin one checked address to the socket. TLS still validates the hostname.
export async function fetchPublic(
  raw,
  policy,
  { resolve = lookup, request = https.request } = {},
) {
  let u = allowedUrl(raw, policy);
  for (let redirects = 0; redirects <= policy.maxRedirects; redirects++) {
    let dnsTimer;
    const addresses = await Promise.race([
      resolve(u.hostname, { all: true }),
      new Promise((_, reject) => {
        dnsTimer = setTimeout(
          () => reject(new Error("dns-timeout")),
          policy.timeoutMs,
        );
      }),
    ]).finally(() => clearTimeout(dnsTimer));
    if (!addresses.length || addresses.some((a) => !publicAddress(a.address)))
      throw new Error("unsafe-dns");
    const pin = addresses[0];
    const response = await new Promise((done, fail) => {
      const req = request(
        u,
        {
          method: "GET",
          agent: false,
          headers: {
            Accept: "text/html,application/json",
            "Accept-Encoding": "identity",
            "User-Agent": "yukamiya-portfolio-curator/2",
          },
          lookup: (_host, opts, cb) =>
            opts?.all ? cb(null, [pin]) : cb(null, pin.address, pin.family),
        },
        (res) => {
          const chunks = [];
          let size = 0;
          res.on("data", (chunk) => {
            size += chunk.length;
            if (size > policy.maxBytes) {
              res.destroy(new Error("response-too-large"));
              return;
            }
            chunks.push(chunk);
          });
          res.on("error", fail);
          res.on("end", () =>
            done({
              status: res.statusCode,
              headers: res.headers,
              body: Buffer.concat(chunks).toString("utf8"),
            }),
          );
        },
      );
      const timer = setTimeout(
        () => req.destroy(new Error("fetch-timeout")),
        policy.timeoutMs,
      );
      req.on("close", () => clearTimeout(timer));
      req.on("error", fail);
      req.end();
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      if (!response.headers.location)
        throw new Error("redirect-without-location");
      u = allowedUrl(new URL(response.headers.location, u).href, policy);
      continue;
    }
    if (response.status !== 200) throw new Error(`http-${response.status}`);
    if (
      !/^(text\/html|application\/json)(;|$)/i.test(
        response.headers["content-type"] ?? "",
      )
    )
      throw new Error("unsupported-content-type");
    return { ...response, url: u.href };
  }
  throw new Error("too-many-redirects");
}
