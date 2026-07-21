"""Dev server for the CityROCK concept site.

Same as `python -m http.server` but sends Cache-Control: no-store so the
browser always refetches edited files (plain http.server lets browsers
heuristically cache index.html/styles.css/main.js, which shows stale pages).
"""
import functools
import http.server
import os

PORT = 4173
ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    http.server.test(
        HandlerClass=functools.partial(NoCacheHandler, directory=ROOT),
        port=PORT,
    )
