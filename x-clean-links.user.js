// ==UserScript==
// @name         X/Twitter Clean Links
// @namespace    x-clean-links
// @version      1.0.0
// @description  Strips ?a=…&s=20 tracking parameters from copied X/Twitter links
// @license      MIT
// @match        https://x.com/*
// @match        https://*.x.com/*
// @match        https://twitter.com/*
// @match        https://*.twitter.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
  const isX = h => /(^|\.)(x|twitter)\.com$/i.test(h);

  function clean(u) {
    let url;
    try { url = new URL(u, location.href); } catch { return u; }
    if (!isX(url.hostname)) return u;
    // Post links -> /user/status/id (no query, no /photo/1 suffix)
    const m = url.pathname.match(/^\/[A-Za-z0-9_]{1,15}\/status\/\d+/);
    if (m) return url.origin + m[0];
    for (const p of ['a', 's']) url.searchParams.delete(p);
    return url.href;
  }

  const cleanText = t => t.replace(
    /\bhttps?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/[^\s"'<>]+/gi,
    m => clean(m)
  );

  // Regular copying (Ctrl+C / context menu)
  document.addEventListener('copy', e => {
    const sel = document.getSelection?.()?.toString?.() ?? '';
    const fixed = cleanText(sel);
    if (fixed && fixed !== sel && e.clipboardData) {
      e.clipboardData.setData('text/plain', fixed);
      e.preventDefault();
    }
  }, true);

  // X's "Copy link" button goes through the Clipboard API
  const patch = () => {
    const p = window.Clipboard && window.Clipboard.prototype;
    if (!p || !p.writeText) return false;
    if (p.writeText.__cleanX) return true;
    const orig = p.writeText;
    p.writeText = function (t) { return orig.call(this, cleanText(String(t))); };
    p.writeText.__cleanX = true;
    return true;
  };
  if (!patch()) {
    let n = 0;
    const t = setInterval(() => { if (patch() || ++n > 50) clearInterval(t); }, 100);
  }
})();
