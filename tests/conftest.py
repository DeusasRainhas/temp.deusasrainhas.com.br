import functools
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest

RAIZ = Path(__file__).resolve().parents[1]


class _Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def ler(path) -> str:
    """Lê um arquivo relativo à raiz do repo como texto UTF-8."""
    return (RAIZ / path).read_text(encoding="utf-8")


@pytest.fixture(scope="session")
def raiz_url():
    handler = functools.partial(_Handler, directory=str(RAIZ))
    servidor = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=servidor.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{servidor.server_address[1]}/"
    servidor.shutdown()
    servidor.server_close()
