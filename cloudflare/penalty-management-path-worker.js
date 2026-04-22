const PUBLIC_BASE_PATH = "/penalty-management";
const UPSTREAM_ORIGIN = "https://penaltymanagement.pages.dev";

function rewritePath(pathname) {
  if (pathname === PUBLIC_BASE_PATH || pathname === `${PUBLIC_BASE_PATH}/`) {
    return "/";
  }

  if (pathname.startsWith(`${PUBLIC_BASE_PATH}/`)) {
    return pathname.slice(PUBLIC_BASE_PATH.length) || "/";
  }

  return pathname;
}

function rewriteLocation(location) {
  if (!location) return location;

  if (location.startsWith("/")) {
    return `${PUBLIC_BASE_PATH}${location === "/" ? "" : location}`;
  }

  if (location.startsWith(UPSTREAM_ORIGIN)) {
    const upstreamUrl = new URL(location);
    return `${PUBLIC_BASE_PATH}${upstreamUrl.pathname === "/" ? "" : upstreamUrl.pathname}${upstreamUrl.search}${upstreamUrl.hash}`;
  }

  return location;
}

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    const upstreamUrl = new URL(UPSTREAM_ORIGIN);

    upstreamUrl.pathname = rewritePath(incomingUrl.pathname);
    upstreamUrl.search = incomingUrl.search;

    const response = await fetch(new Request(upstreamUrl.toString(), request), {
      redirect: "manual",
    });

    const headers = new Headers(response.headers);
    const rewrittenLocation = rewriteLocation(headers.get("location"));
    if (rewrittenLocation) headers.set("location", rewrittenLocation);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
