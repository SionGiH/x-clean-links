# x-clean-links

Tampermonkey userscript that cleans copied X/Twitter links: drops the `?a=…&s=20` tracking parameters and suffixes like `/photo/1`.

```text
before:  https://x.com/user/status/1234567890?a=…&s=20
after:   https://x.com/user/status/1234567890
```

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or Violentmonkey).
2. Open `x-clean-links.user.js` in this repo, click **Raw**, and accept the install prompt.

The script hooks both the "Copy link" menu item and regular copying (Ctrl+C). Keep `@grant none` — otherwise it runs sandboxed and cannot patch the page's Clipboard API.

## License

MIT
