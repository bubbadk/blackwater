#!/usr/bin/env python3
"""
blackwater.dybbol.com — THE BLACK RELIQUARY (static game site).
Serveres af en simpel stdlib HTTP-server som managed service under
ProjektCockpit. Ingen afhængigheder ud over Python 3.
"""
from __future__ import annotations

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import unquote, urlsplit


PORT = int(os.environ.get("PORT", "8751"))
HOST = os.environ.get("HOST", "0.0.0.0")
ROOT = os.path.dirname(os.path.abspath(__file__))


class BlackwaterHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".webmanifest": "application/manifest+json",
        ".md": "text/plain; charset=utf-8",
    }

    def _blocked(self) -> bool:
        request_path = unquote(urlsplit(self.path).path)
        parts = [part for part in request_path.split("/") if part]
        blocked_files = {"README.md", "start-managed.py"}
        if any(part.startswith(".") for part in parts):
            return True
        if any(part in blocked_files for part in parts):
            return True
        return False

    def send_head(self):
        if self._blocked():
            self.send_error(404, "File not found")
            return None
        return super().send_head()

    def end_headers(self) -> None:
        if self.path.endswith(".html") or self.path.endswith("/"):
            self.send_header("Cache-Control", "no-cache")
        else:
            self.send_header("Cache-Control", "public, max-age=3600")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        super().end_headers()

    def log_message(self, format: str, *args) -> None:  # noqa: A002
        sys.stderr.write("[blackwater] " + (format % args) + "\n")


def main() -> int:
    os.chdir(ROOT)
    server = HTTPServer((HOST, PORT), BlackwaterHandler)
    sys.stderr.write(f"[blackwater] lytter på {HOST}:{PORT} (root={ROOT})\n")
    sys.stderr.flush()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        sys.stderr.write("[blackwater] stop\n")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
