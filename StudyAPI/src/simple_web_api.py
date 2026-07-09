from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import parse_qs, urlparse


# 実行時の設定は、このファイルを編集せずに環境変数で上書きできます。
HOST = os.environ.get("WEB_API_HOST", "127.0.0.1")
PORT = int(os.environ.get("WEB_API_PORT", "9898"))
LMSTUDIO_BASE_URL = os.environ.get("LMSTUDIO_BASE_URL", "http://127.0.0.1:5858")
LMSTUDIO_MODEL = os.environ.get("LMSTUDIO_MODEL", "local-model")


def call_lmstudio(prompt: str) -> str:
    # LM Studio の OpenAI 互換 Chat Completions API に問い合わせます。
    payload = {
        "model": LMSTUDIO_MODEL,
        "messages": [
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
        "stream": False,
    }
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        f"{LMSTUDIO_BASE_URL.rstrip('/')}/v1/chat/completions",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=120) as response:
        response_body = response.read().decode("utf-8")

    result = json.loads(response_body)
    try:
        # API レスポンスを単純にするため、生成された本文だけを返します。
        return result["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        raise ValueError(f"Unexpected LM Studio response: {result}") from exc


class ApiHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self) -> None:
        # ブラウザからの JSON POST では、事前確認として OPTIONS が送られることがあります。
        self.send_response(204)
        self._send_cors_headers()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)

        # サーバーが起動しているかを確認するためのエンドポイントです。
        if parsed.path == "/health":
            self._send_json({"status": "ok"})
            return

        # 固定の JSON を返すサンプル用エンドポイントです。
        if parsed.path == "/fixed":
            self._send_json({"message": "fixed response"})
            return

        # クエリ文字列でプロンプトを受け取る形式です: GET /ask?prompt=...
        if parsed.path == "/ask":
            query = parse_qs(parsed.query)
            prompt = query.get("prompt", [""])[0].strip()
            if not prompt:
                self._send_json({"error": "prompt is required"}, status=400)
                return

            try:
                answer = call_lmstudio(prompt)
                self._send_json({"prompt": prompt, "answer": answer})
            except urllib.error.URLError as exc:
                self._send_json(
                    {"error": "lmstudio_connection_failed", "detail": str(exc)},
                    status=502,
                )
            except (json.JSONDecodeError, ValueError) as exc:
                self._send_json({"error": "bad_response", "detail": str(exc)}, status=502)
            return

        self._send_json(
            {
                "error": "not_found",
                "routes": [
                    "GET /health",
                    "GET /fixed",
                    "POST /ask",
                    "GET /ask?prompt=...",
                ],
            },
            status=404,
        )

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/ask":
            self._send_json({"error": "not_found"}, status=404)
            return

        try:
            # JSON ボディでプロンプトを受け取る形式です: {"prompt": "..."}
            body = self._read_json()
            prompt = str(body.get("prompt", "")).strip()
            if not prompt:
                self._send_json({"error": "prompt is required"}, status=400)
                return

            answer = call_lmstudio(prompt)
            self._send_json({"prompt": prompt, "answer": answer})
        except urllib.error.URLError as exc:
            self._send_json(
                {"error": "lmstudio_connection_failed", "detail": str(exc)},
                status=502,
            )
        except (json.JSONDecodeError, ValueError) as exc:
            self._send_json({"error": "bad_response", "detail": str(exc)}, status=502)

    def _read_json(self) -> dict[str, Any]:
        # BaseHTTPRequestHandler は JSON ボディを自動解析しないため、ここで読み取ります。
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            return {}
        raw_body = self.rfile.read(content_length).decode("utf-8")
        return json.loads(raw_body)

    def _send_json(self, payload: dict[str, Any], status: int = 200) -> None:
        # ensure_ascii=False により、日本語などをエスケープせず読みやすい形で返します。
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_cors_headers(self) -> None:
        # Hoppscotch などブラウザ経由のクライアントから読めるようにします。
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def log_message(self, format: str, *args: Any) -> None:
        print(f"{self.address_string()} - {format % args}")


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), ApiHandler)
    print(f"Serving on http://{HOST}:{PORT}")
    print(f"LM Studio endpoint: {LMSTUDIO_BASE_URL.rstrip('/')}/v1/chat/completions")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
