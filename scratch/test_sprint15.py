import sys
import os
import asyncio
import uuid

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "pentest_backend"))

from app.database.init_db import init_db
from app.services.scan_orchestrator import ScanOrchestrator
from app.services.ai_analyst import AISecurityAnalyst
from app.database.session import AsyncSessionLocal
from app.models.scan import Scan
from app.models.finding import Finding
from fastapi.testclient import TestClient
from app.main import app

async def main():
    print("--- SPRINT 15: TESTING DANIX AI SECURITY ANALYST ---")
    await init_db()
    
    scan_id = f"test-scan-sprint15-{uuid.uuid4().hex[:6]}"
    async with AsyncSessionLocal() as db:
        test_scan = Scan(
            id=scan_id,
            name="Sprint 15 Validation Scan",
            target="example.com",
            target_type="domain",
            profile="normal",
            status="queued"
        )
        db.add(test_scan)
        
        test_finding = Finding(
            id=f"test-finding-{uuid.uuid4().hex[:6]}",
            severity="high",
            title="Test SQL Injection Finding",
            category="web",
            evidence="Parameter id vulnerable to SQL injection",
            confidence=95,
            asset="example.com",
            status="open",
            cve="CVE-2023-1234",
            cwe="CWE-89",
            cvss=8.5,
            scan_id=scan_id
        )
        db.add(test_finding)
        await db.commit()
        finding_id = test_finding.id

    print("\n1. Testing AISecurityAnalyst Service Standalone...")
    analyst = AISecurityAnalyst()
    async with AsyncSessionLocal() as db:
        f_obj = await db.get(Finding, finding_id)
        ai_analysis = await analyst.run_and_save_analysis(f_obj)
        print(f"[OK] AI Analysis persisted for finding {finding_id}:")
        print(f"   - Executive Summary: {ai_analysis.summary}")
        print(f"   - Business Impact: {ai_analysis.business_impact}")
        print(f"   - Attack Scenario: {ai_analysis.attack_scenario}")

    print("\n2. Testing GET /api/v1/analysis/{finding_id} FastAPI Endpoint...")
    client = TestClient(app)
    res = client.get(f"/api/v1/analysis/{finding_id}")
    if res.status_code == 200:
        data = res.json()
        print(f"[OK] GET /api/v1/analysis/{finding_id} -> 200 OK")
        print(f"   Keys returned: {list(data.keys())}")
    else:
        print(f"[FAIL] GET /api/v1/analysis/{finding_id} -> {res.status_code} ({res.text})")

    print("\n3. Testing End-to-End Orchestrator Stream with AI Security Analysis...")
    orchestrator = ScanOrchestrator(scan_id=scan_id)
    async for event in orchestrator.run_orchestrated_scan_stream(target="example.com", profile="normal"):
        print(f"STREAM: {event.strip()}")

    # Check generated report file
    reports_dir = os.path.join(os.path.dirname(__file__), "..", "pentest_backend", "app", "reports")
    report_file = os.path.join(reports_dir, f"report_{scan_id}.html")
    if os.path.exists(report_file):
        print(f"\nSUCCESS: HTML Report with AI Security Analysis generated at {report_file} ({os.path.getsize(report_file)} bytes)")
    else:
        print(f"\nFAIL: HTML Report missing at {report_file}")

if __name__ == "__main__":
    asyncio.run(main())
