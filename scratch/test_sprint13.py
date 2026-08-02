import sys
import os
import asyncio
import uuid

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "pentest_backend"))

from app.database.init_db import init_db
from app.services.scan_orchestrator import ScanOrchestrator
from app.database.session import AsyncSessionLocal
from app.models.scan import Scan

async def main():
    print("--- SPRINT 13: TESTING DANIX SCAN ORCHESTRATOR ---")
    await init_db()
    
    scan_id = f"test-scan-{uuid.uuid4().hex[:8]}"
    async with AsyncSessionLocal() as db:
        test_scan = Scan(
            id=scan_id,
            name="Sprint 13 Validation Scan",
            target="127.0.0.1",
            target_type="ip",
            profile="quick",
            status="queued"
        )
        db.add(test_scan)
        await db.commit()

    orchestrator = ScanOrchestrator(scan_id=scan_id)
    print("\n1. Running Orchestrated Scan Stream...")
    async for event in orchestrator.run_orchestrated_scan_stream(target="127.0.0.1", profile="quick"):
        print(f"EVENT STREAM: {event.strip()}")

    # Check generated report file
    reports_dir = os.path.join(os.path.dirname(__file__), "..", "pentest_backend", "app", "reports")
    report_file = os.path.join(reports_dir, f"report_{scan_id}.html")
    if os.path.exists(report_file):
        print(f"\nSUCCESS: HTML Report successfully generated at {report_file} ({os.path.getsize(report_file)} bytes)")
    else:
        print(f"\nFAIL: HTML Report missing at {report_file}")

if __name__ == "__main__":
    asyncio.run(main())
