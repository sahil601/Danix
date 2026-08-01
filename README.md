# Agentic Penetration Testing Platform

SentinelAI X is an advanced, AI-powered penetration testing platform. It leverages large language models and a LangGraph-based agentic workflow to autonomously plan, scan, analyze, and report on security vulnerabilities across web and network assets.

## Architecture

The project is split into two main repositories/directories:

1. **Frontend (`Ai-agentic-/sentinel-ai-x (1)`)**: A modern, high-performance Next.js 15 application built with React, Tailwind CSS, Recharts, and Framer Motion. It provides a sleek, real-time dashboard for managing projects, assets, findings, and executing agentic workflows.
2. **Backend (`pentest_backend`)**: A robust FastAPI Python server utilizing a Clean Architecture pattern (Controllers, Services, Repositories). It uses SQLAlchemy (SQLite) for data persistence and LangGraph to orchestrate autonomous AI agents.

## Core Features

- **Agentic Workflow Engine**: Uses LangGraph to coordinate a team of specialized AI agents:
  - `Planner Agent`: Strategizes the penetration test.
  - `Recon Agent`: Gathers initial intelligence on targets.
  - `Network Analyst`: Scans and analyzes network infrastructure (e.g., Nmap simulation).
  - `Web Analyst`: Investigates web applications for vulnerabilities (e.g., XSS, SQLi).
  - `Reasoning Engine`: Correlates findings to reduce false positives.
  - `Report Writer`: Automatically compiles evidence into a beautifully formatted HTML report.
- **Real-Time Execution Visualization**: The frontend connects to the backend via Server-Sent Events (SSE) to visually stream the AI agents' thought processes, logs, and phase transitions in real-time.
- **AI Assistant Chat**: Integrated streaming AI chat to converse with an assistant about your assets, vulnerabilities, and remediation strategies.
- **Dynamic Dashboards**: Interactive charts and analytics showing risk trends, severity distribution, and scan history.
- **Asset & Project Management**: Track domains, cloud infrastructure, and IPs mapped to specific pentest engagements.
- **Knowledge Base**: Centralized intelligence on OWASP Top 10, MITRE ATT&CK, CVEs, and best practices.

## Getting Started

### Backend Setup
1. Navigate to the backend directory: `cd pentest_backend`
2. Create a virtual environment: `python -m venv .venv`
3. Activate the virtual environment: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the FastAPI server: `uvicorn app.main:app --reload --port 8000`
*(Note: The application will automatically initialize and seed the SQLite database `pentest.db` with realistic test data on startup.)*

### Frontend Setup
1. Navigate to the frontend directory: `cd "Ai-agentic-/sentinel-ai-x (1)"`
2. Install dependencies: `npm install`
3. Start the Next.js development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Python 3, FastAPI, SQLAlchemy (Async), LangGraph, LangChain, SQLite.
- **Communication**: REST API, Server-Sent Events (SSE) for streaming.
