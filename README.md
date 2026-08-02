# Danix — AI-Powered Autonomous Vulnerability Assessment & Penetration Testing Platform

**Danix** is an advanced, AI-powered autonomous vulnerability assessment and penetration testing platform. It leverages large language models and an AgentOS multi-agent workflow to autonomously plan, scan, analyze, correlate risks, and report on security vulnerabilities across web and network assets.

## Architecture

The project is split into two main repositories/directories:

1. **Frontend (`Danix`)**: A modern, high-performance Next.js application built with React, Tailwind CSS, Recharts, and Framer Motion. It provides a sleek, real-time dashboard for managing projects, assets, findings, and executing agentic workflows.
2. **Backend (`Danix_backend`)**: A robust Python server utilizing an AgentOS architecture (AgentManager, AgentRegistry, PluginRegistry). It orchestrates 16 autonomous AI agents and 9 security plugins with a deterministic Risk Engine, Evidence Management System, Reporting Engine, and Knowledge & RAG Engine.

## Core Features

- **AgentOS Workflow Engine**: Coordinates a team of specialized AI agents:
  - `Supervisor`: Oversees workflow lifecycle and agent state transitions.
  - `Planner Agent v2.0`: Returns structured assessment goals and target strategies.
  - `Task Scheduler`: Schedules and throttles plugin execution tasks.
  - `Recon Agent`: Gathers WHOIS, DNS, and subdomain intelligence on targets.
  - `Network Analyst`: Scans and analyzes network infrastructure (e.g. Nmap).
  - `Web Analyst`: Investigates web applications for security headers and SSL issues.
  - `Content Discovery Agent`: Discovers hidden web endpoints, sensitive files, and APIs.
  - `API Security Agent`: Analyzes REST and GraphQL endpoints for authorization flaws.
  - `Vulnerability Agent`: Performs CVE lookups and maps software component flaws.
  - `Correlation Agent`: Normalizes, deduplicates, and aggregates observations into Findings.
  - `Risk Agent`: Evaluates CVSS v3.1 scores, business impact, likelihood, and priority.
  - `Evidence Agent`: Collects and hashes tamper-proof SHA-256 evidence.
  - `Report Agent`: Generates Executive, Technical, and Compliance reports.
  - `AI Analyst Agent`: Consumes platform intelligence via local LLM / Ollama.
  - `Knowledge Agent`: Provides hybrid vector/keyword RAG retrieval across OWASP, MITRE, CWE, and NIST SP 800-53.
  - `Memory Agent`: Manages short-term and long-term state persistence.
- **Real-Time Execution Visualization**: The frontend streams agent thought processes, logs, and phase transitions in real-time.
- **AI Assistant Chat**: Integrated streaming AI chat to converse with Danix intelligence about assets, vulnerabilities, and remediation strategies.
- **Dynamic Dashboards**: Interactive charts and analytics showing risk trends, severity distribution, and scan history.
- **Asset & Assessment Management**: Track domains, cloud infrastructure, and IPs mapped to specific pentest engagements.
- **Knowledge Base**: Centralized RAG intelligence on OWASP Top 10 2021, MITRE ATT&CK, CWE, NIST SP 800-53, and security best practices.

## Getting Started

### Unified Startup (Recommended)

Start both Frontend and Backend concurrently from the repository root:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the entire platform:
   ```bash
   npm run dev
   ```
   - **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000](http://localhost:8000) (Docs: [http://localhost:8000/docs](http://localhost:8000/docs))

### Individual Component Commands

- **Frontend Only**: `npm run frontend` (or `cd frontend && npm run dev`)
- **Backend Only**: `npm run backend` (or `cd pentest_backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload`)

### Manual Setup & Prerequisites

#### Backend Setup
1. Navigate to backend directory: `cd pentest_backend`
2. Create and activate a virtual environment:
   - Linux/macOS: `python3 -m venv .venv && source .venv/bin/activate`
   - Windows: `python -m venv .venv && .venv\Scripts\activate`
3. Install Python dependencies: `pip install -r requirements.txt`

#### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`

## Technologies Used

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Python 3, FastAPI / AgentOS, Pydantic, ChromaDB / Hybrid RAG, Ollama / Local Embeddings.
- **Communication**: REST API, Server-Sent Events (SSE) for streaming.
