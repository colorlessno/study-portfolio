import http.client
import json
import sys
import threading
import unittest
import urllib.error
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
import simple_web_api as api


class SimpleWebApiTest(unittest.TestCase):
    def setUp(self):
        self.original_call = api.call_lmstudio
        self.original_cors = api.CORS_ORIGIN
        self.original_get_ask = api.ALLOW_GET_ASK
        api.call_lmstudio = lambda prompt: f"mock answer: {prompt}"
        api.CORS_ORIGIN = ""
        api.ALLOW_GET_ASK = False

        self.server = api.create_server("127.0.0.1", 0)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.host, self.port = self.server.server_address

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=2)
        api.call_lmstudio = self.original_call
        api.CORS_ORIGIN = self.original_cors
        api.ALLOW_GET_ASK = self.original_get_ask

    def request(self, method, path, body=None, headers=None):
        connection = http.client.HTTPConnection(self.host, self.port, timeout=2)
        connection.request(method, path, body=body, headers=headers or {})
        response = connection.getresponse()
        raw_body = response.read().decode("utf-8")
        response_headers = dict(response.getheaders())
        connection.close()
        return response.status, response_headers, json.loads(raw_body) if raw_body else None

    def test_health_is_available_without_upstream(self):
        status, headers, body = self.request("GET", "/health")

        self.assertEqual(status, 200)
        self.assertEqual(body, {"status": "ok"})
        self.assertEqual(headers["Cache-Control"], "no-store")
        self.assertEqual(headers["X-Content-Type-Options"], "nosniff")
        self.assertNotIn("Access-Control-Allow-Origin", headers)

    def test_fixed_response_is_deterministic(self):
        status, _, body = self.request("GET", "/fixed")

        self.assertEqual(status, 200)
        self.assertEqual(body, {"message": "fixed response"})

    def test_post_ask_uses_mock_upstream(self):
        payload = json.dumps({"prompt": "hello"})

        status, _, body = self.request(
            "POST", "/ask", payload, {"Content-Type": "application/json"}
        )

        self.assertEqual(status, 200)
        self.assertEqual(body, {"answer": "mock answer: hello"})

    def test_missing_prompt_is_bad_request(self):
        status, _, body = self.request(
            "POST", "/ask", "{}", {"Content-Type": "application/json"}
        )

        self.assertEqual(status, 400)
        self.assertEqual(body, {"error": "prompt_required"})

    def test_invalid_json_is_bad_request(self):
        status, _, body = self.request(
            "POST", "/ask", "{bad", {"Content-Type": "application/json"}
        )

        self.assertEqual(status, 400)
        self.assertEqual(body, {"error": "invalid_json"})

    def test_wrong_content_type_is_rejected(self):
        status, _, body = self.request("POST", "/ask", "{}", {"Content-Type": "text/plain"})

        self.assertEqual(status, 415)
        self.assertEqual(body, {"error": "content_type_must_be_application_json"})

    def test_oversized_request_is_rejected_before_body_read(self):
        connection = http.client.HTTPConnection(self.host, self.port, timeout=2)
        connection.putrequest("POST", "/ask")
        connection.putheader("Content-Type", "application/json")
        connection.putheader("Content-Length", str(api.MAX_REQUEST_BYTES + 1))
        connection.endheaders()
        response = connection.getresponse()
        body = json.loads(response.read().decode("utf-8"))
        connection.close()

        self.assertEqual(response.status, 413)
        self.assertEqual(body, {"error": "request_too_large"})

    def test_get_ask_is_disabled_by_default(self):
        status, _, body = self.request("GET", "/ask?prompt=secret")

        self.assertEqual(status, 405)
        self.assertEqual(body, {"error": "get_ask_disabled", "use": "POST /ask"})

    def test_request_log_path_removes_query(self):
        self.assertEqual(api.request_log_path("/ask?prompt=secret"), "/ask")

    def test_upstream_error_does_not_leak_internal_detail(self):
        def fail(_prompt):
            raise urllib.error.URLError("private upstream detail")

        api.call_lmstudio = fail
        status, _, body = self.request(
            "POST",
            "/ask",
            json.dumps({"prompt": "hello"}),
            {"Content-Type": "application/json"},
        )

        self.assertEqual(status, 502)
        self.assertEqual(body, {"error": "upstream_unavailable"})

    def test_upstream_timeout_returns_stable_error(self):
        def time_out(_prompt):
            raise TimeoutError("private timeout detail")

        api.call_lmstudio = time_out
        status, _, body = self.request(
            "POST",
            "/ask",
            json.dumps({"prompt": "hello"}),
            {"Content-Type": "application/json"},
        )

        self.assertEqual(status, 502)
        self.assertEqual(body, {"error": "upstream_unavailable"})

    def test_configured_cors_origin_is_exact(self):
        api.CORS_ORIGIN = "https://example.test"

        status, headers, _ = self.request("GET", "/health")

        self.assertEqual(status, 200)
        self.assertEqual(headers["Access-Control-Allow-Origin"], "https://example.test")

    def test_remote_upstream_requires_explicit_opt_in(self):
        original_url = api.LMSTUDIO_BASE_URL
        original_allow = api.ALLOW_REMOTE_UPSTREAM
        try:
            api.LMSTUDIO_BASE_URL = "https://example.test"
            api.ALLOW_REMOTE_UPSTREAM = False

            with self.assertRaisesRegex(ValueError, "refuses non-loopback"):
                api.validate_configuration()
        finally:
            api.LMSTUDIO_BASE_URL = original_url
            api.ALLOW_REMOTE_UPSTREAM = original_allow


if __name__ == "__main__":
    unittest.main()
