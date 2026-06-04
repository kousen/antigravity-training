import socket
import threading
import time

import pytest
from werkzeug.serving import make_server

from app import create_app


HOST = "127.0.0.1"
PORT = 5050


def _server_is_ready():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.2)
        return sock.connect_ex((HOST, PORT)) == 0


@pytest.fixture(scope="session", autouse=True)
def flask_server():
    """Start the Flask app for browser-based e2e tests."""
    if _server_is_ready():
        yield
        return

    app = create_app()
    app.config["TESTING"] = True
    server = make_server(HOST, PORT, app)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    deadline = time.time() + 10
    while time.time() < deadline:
        if _server_is_ready():
            break
        time.sleep(0.2)
    else:
        server.shutdown()
        raise RuntimeError("Flask server did not start on 127.0.0.1:5050")

    try:
        yield
    finally:
        server.shutdown()
        thread.join(timeout=5)
