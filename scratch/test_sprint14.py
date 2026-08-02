import sys
import os
import asyncio
import uuid

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "pentest_backend"))

from app.database.init_db import init_db
from app.services.scan_orchestrator import ScanOrchestrator
from app.services.web_scanner import WebScanner
from app.database.session import AsyncSessionLocal
from app.models.scan import Scan

async def main():
    print("--- SPRINT 14: TESTING DANIX REAL WEB SECURITY SCANNER ---")
    await init_db()
    
    scan_id = f"test-scan-sprint14-{uuid.uuid4().hex[:6]}"
    async with AsyncSessionLocal() as db:
        test_scan = Scan(
            id=scan_id,
            name="Sprint 14 Web Scan Validation",
            target="example.com",
            target_type="domain",
            profile="normal",
            status="queued"
        )
        db.add(test_scan)
        await db.commit()

    print("\n1. Testing Standalone WebScanner execution...")
    ws = WebScanner()
    raw_findings = await ws.scan_target_web("example.com", scan_id)
    print(f"[OK] WebScanner returned {len(raw_findings)} web findings.")
    for f in raw_findings[:3]:
        print(f"   - [{f['severity'].upper()}] {f['title']} (CWE: {f['cwe']})")

    print("\n2. Testing End-to-End ScanOrchestrator Stream...")
    orchestrator = ScanOrchestrator(scan_id=scan_id)
    async for event in orchestrator.run_orchestrated_scan_stream(target="example.com", profile="normal"):
        print(f"STREAM: {event.strip()}")

    # Check generated report file
    reports_dir = os.path.join(os.path.dirname(__file__), "..", "pentest_backend", "app", "reports")
    report_file = os.path.join(reports_dir, f"report_{scan_id}.html")
    if os.path.exists(report_file):
        print(f"\nSUCCESS: HTML Report generated at {report_file} ({os.path.getsize(report_file)} bytes)")
    else:
        print(f"\nFAIL: HTML Report missing at {report_file}")

if __name__ == "__main__":
    asyncio.run(main())
