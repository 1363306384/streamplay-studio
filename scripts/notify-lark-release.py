#!/usr/bin/env python3
"""Notify a Lark group after a Streamplay Studio GitHub Release is published."""
import base64
import hashlib
import hmac
import json
import os
import sys
import time
import urllib.error
import urllib.request

webhook = os.environ.get("LARK_WEBHOOK_URL", "").strip()
if not webhook:
    print("LARK_WEBHOOK_URL is not configured; skipping Lark notification.")
    sys.exit(0)

tag = os.environ["STUDIO_TAG"]
platforms = os.environ["STUDIO_PLATFORMS"]
repository = os.environ["GITHUB_REPOSITORY"]
release_url = f"https://github.com/{repository}/releases/tag/{tag}"
message = f"Streamplay Studio {tag} 已发布\n平台：{platforms}\n下载与更新说明：{release_url}"
payload = {"msg_type": "text", "content": {"text": message}}

secret = os.environ.get("LARK_SIGNING_SECRET", "").strip()
if secret:
    timestamp = str(int(time.time()))
    digest = hmac.new(f"{timestamp}\n{secret}".encode(), digestmod=hashlib.sha256).digest()
    payload.update(timestamp=timestamp, sign=base64.b64encode(digest).decode())

request = urllib.request.Request(
    webhook,
    data=json.dumps(payload, ensure_ascii=False).encode(),
    headers={"Content-Type": "application/json"},
    method="POST",
)
try:
    with urllib.request.urlopen(request, timeout=15) as response:
        result = json.load(response)
except (urllib.error.URLError, ValueError) as error:
    raise SystemExit(f"Lark notification failed: {error}") from error

if result.get("code", result.get("StatusCode", 0)) != 0:
    raise SystemExit(f"Lark notification failed: {result.get('msg', result.get('StatusMessage', 'unknown error'))}")
print(f"Lark notified about {tag} ({platforms}).")
