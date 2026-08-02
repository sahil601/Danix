import sys
import os
import asyncio

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "pentest_backend"))

from app.database.init_db import init_db
from fastapi.testclient import TestClient
from app.main import app

# Initialize DB tables
asyncio.run(init_db())

client = TestClient(app)

endpoints_to_test = [
    # Health & Telemetry
    ("GET", "/api/v1/health"),
    ("GET", "/api/v1/health/system/telemetry"),
    ("GET", "/api/v1/system/telemetry"),
    ("GET", "/api/v1/agents/status"),
    ("GET", "/api/v1/settings/system/status"),

    # Scans CRUD
    ("GET", "/api/v1/scans"),
    ("GET", "/api/v1/scan"),
    
    # Reports
    ("GET", "/api/v1/reports"),
    
    # Findings
    ("GET", "/api/v1/findings"),
    
    # Dashboard
    ("GET", "/api/v1/dashboard/overview"),
    ("GET", "/api/v1/dashboard/charts"),
    ("GET", "/api/v1/dashboard/activity-feed"),
    ("GET", "/api/v1/dashboard/recommendations"),
    
    # Projects
    ("GET", "/api/v1/projects"),
    
    # Assets
    ("GET", "/api/v1/assets"),
    
    # AI Chat
    ("GET", "/api/v1/ai/conversations"),
    ("GET", "/api/v1/chat/conversations"),
    
    # History
    ("GET", "/api/v1/history"),
    
    # Notifications
    ("GET", "/api/v1/notifications"),
    
    # Knowledge Base
    ("GET", "/api/v1/knowledge-base/categories"),
    ("GET", "/api/v1/knowledge-base/articles"),
    
    # Attack Surface
    ("GET", "/api/v1/attack-surface/graph"),
    
    # Settings
    ("GET", "/api/v1/settings/llm"),
]

print("--- TESTING DANIX BACKEND FASTAPI ROUTE ALIASES ---")
all_passed = True
for method, url in endpoints_to_test:
    response = client.request(method, url)
    status = response.status_code
    if status in (200, 201, 204):
        print(f"[OK] {method} {url} -> {status}")
    else:
        print(f"[FAIL] {method} {url} -> {status} ({response.text})")
        all_passed = False

if all_passed:
    print("\nSUCCESS: All endpoints return HTTP 200! No 404 Not Found errors remain.")
else:
    print("\nFAILURE: Some routes failed.")
