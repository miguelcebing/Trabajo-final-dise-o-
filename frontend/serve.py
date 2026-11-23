"""RestSmart frontend dev server.

Serves the static frontend and proxies /api/* to the Spring Boot backend on
http://127.0.0.1:8080, so the browser sees one origin and CORS stays out of
the picture. The backend is never modified.

Usage:
    python frontend/serve.py

Environment:
    PORT      frontend port (default 5173)
    BACKEND   backend base URL (default http://127.0.0.1:8080)
"""

from __future__ import annotations

import json
import os
import posixpath
import sys
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

FRONTEND_DIR = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", "5173"))
BACKEND = os.environ.get("BACKEND", "http://127.0.0.1:8080").rstrip("/")
API_PREFIX = "/api"
HOP_BY_HOP = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
}


class RestSmartHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)

    # ---------- routing ----------

    def do_GET(self):
        if self.path.startswith(API_PREFIX):
            return self.proxy()
        return self.serve_static()

    def do_HEAD(self):
        if self.path.startswith(API_PREFIX):
            return self.proxy()
        return self.serve_static()

    def do_POST(self):
        if self.path.startswith(API_PREFIX):
            return self.proxy()
        self.send_error(405, "Método no permitido")

    def do_PUT(self):
        if self.path.startswith(API_PREFIX):
            return self.proxy()
        self.send_error(405, "Método no permitido")

    def do_DELETE(self):
        if self.path.startswith(API_PREFIX):
            return self.proxy()
        self.send_error(405, "Método no permitido")

    def do_OPTIONS(self):
        if self.path.startswith(API_PREFIX):
            self.send_response(204)
            self.send_header("Allow", "GET, POST, PUT, DELETE, OPTIONS")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        self.send_error(405, "Método no permitido")

    # ---------- static ----------

    def serve_static(self):
        path = posixpath.normpath(self.path.split("?", 1)[0])
        candidate = (FRONTEND_DIR / path.lstrip("/")).resolve()
        try:
            candidate.relative_to(FRONTEND_DIR)
        except ValueError:
            self.send_error(403, "Ruta fuera del frontend")
            return

        if path in ("/", "") or not candidate.exists():
            if not posixpath.splitext(path)[1]:
                self.path = "/index.html"
        handler = (
            SimpleHTTPRequestHandler.do_HEAD
            if self.command == "HEAD"
            else SimpleHTTPRequestHandler.do_GET
        )
        return handler(self)

    def end_headers(self):
        if not self.path.startswith(API_PREFIX):
            self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    # ---------- proxy ----------

    def proxy(self):
        target = f"{BACKEND}{self.path}"

        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else None

        request = urllib.request.Request(target, data=body, method=self.command)
        for header in ("Content-Type", "Accept", "Accept-Language", "Cookie"):
            value = self.headers.get(header)
            if value:
                request.add_header(header, value)

        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                data = response.read()
                self.send_response(response.status)
                self.copy_headers(response.headers)
                self.send_header("Content-Length", str(len(data)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(data)
        except urllib.error.HTTPError as error:
            data = error.read()
            self.send_response(error.code)
            self.copy_headers(error.headers)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(data)
        except Exception as error:  # connection refused, DNS, timeout
            payload = json.dumps(
                {
                    "error": "API_OFFLINE",
                    "message": (
                        f"No se pudo contactar el backend en {BACKEND}. "
                        "Inicia Spring Boot con: cd restsmart; .\\mvnw.cmd spring-boot:run"
                    ),
                }
            ).encode("utf-8")
            self.send_response(502)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(payload)
            self.log_message("proxy error: %s", error)

    def copy_headers(self, headers):
        for key, value in headers.items():
            if key.lower() in HOP_BY_HOP or key.lower() == "content-length":
                continue
            self.send_header(key, value)

    def log_message(self, fmt, *args):
        sys.stderr.write("[restsmart] %s - %s\n" % (self.address_string(), fmt % args))


def main():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), RestSmartHandler)
    print(f"RestSmart frontend  ->  http://127.0.0.1:{PORT}")
    print(f"API proxy          ->  {BACKEND}")
    print("Ctrl+C para detener.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nDetenido.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
