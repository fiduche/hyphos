// Cloudflare Worker entry for hyphos.io.
//
// Static pages come from ./dist through the ASSETS binding. The golf
// tournament (entry form, screens, course board, QR scan redirects and their
// APIs) is served by the hyphos-consulting-website worker, which owns the D1
// database. It is reached here through a service binding, a direct
// worker-to-worker call with no public hop, so hyphos.io is the only address
// people see while the tournament code and data stay in one place.
const TOURNAMENT = /^\/(?:golf|course|c|go|api\/golf|api\/course)(?:\/|$)/i;

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (env.GOLF && TOURNAMENT.test(pathname)) return env.GOLF.fetch(request);

    const response = await env.ASSETS.fetch(request);
    // Tournament pages load their scripts and styles from /_astro/, and those
    // hashed files only exist in the tournament worker's build.
    if (response.status === 404 && env.GOLF && pathname.startsWith('/_astro/')) {
      return env.GOLF.fetch(request);
    }
    return response;
  },
};
