🛡️ Danix — AI-Powered Enterprise VAPT Platform
<p align="center"> <img src="docs/logo.png" width="180"> </p> <p align="center"> <strong>Enterprise-Grade AI-Powered Vulnerability Assessment & Penetration Testing Platform</strong> </p> <p align="center">



</p>
🚀 Overview

Danix is an AI-powered enterprise Vulnerability Assessment and Penetration Testing (VAPT) platform designed to automate reconnaissance, vulnerability assessment, security analysis, reporting, and AI-assisted decision making.

Unlike traditional security tools that operate independently, Danix orchestrates multiple industry-standard security tools into a unified multi-stage pipeline, correlates findings using AI, and generates executive and technical reports in real time.

The platform is built for Security Analysts, Penetration Testers, Red Teams, MSSPs, SOC Teams, and Enterprise Security Operations.

✨ Key Features
🤖 AI-Powered Security Analysis
Multi-Agent AI Architecture
AI Scan Planning
AI Vulnerability Correlation
AI Risk Prioritization
AI Executive Summaries
AI Remediation Suggestions
AI Attack Path Analysis
🔍 Automated Reconnaissance
Asset Discovery
Subdomain Enumeration
DNS Enumeration
HTTP Fingerprinting
Web Crawling
Technology Detection
SSL/TLS Analysis
WHOIS Lookup
🌐 Integrated Security Tools
Nmap
Naabu
Httpx
Katana
WhatWeb
FFUF
Subfinder
Nuclei
DNSPython
Python WHOIS
📊 Enterprise Dashboard
Live Scan Monitoring
Scan Timeline
Real-Time Progress Tracking
Project Management
Asset Inventory
Finding Management
Executive Dashboard
Historical Scan Results
🛡️ Enterprise Security
JWT Authentication
Refresh Tokens
RBAC
Multi-Tenant Organizations
API Keys
Audit Logging
Security Headers
Rate Limiting
Input Validation
📄 Professional Reporting

Generate:

Executive PDF Reports
Technical PDF Reports
HTML Reports
JSON Reports
CSV Reports

Including:

CVSS Scores
CWE Mapping
CVE References
MITRE ATT&CK Mapping
Risk Ratings
AI Recommendations
Evidence
Remediation Steps
🏗️ Architecture
                        User
                         │
                         ▼
                  Next.js Dashboard
                         │
                         ▼
                   FastAPI Backend
                         │
     ┌───────────────────┼────────────────────┐
     │                   │                    │
     ▼                   ▼                    ▼
 Authentication     Scan Engine         AI Engine
     │                   │                    │
     ▼                   ▼                    ▼
 PostgreSQL      Plugin Framework      LangGraph
     │                   │                    │
     ▼                   ▼                    ▼
 Asset DB       Security Tools         Ollama LLM
                         │
      ┌──────────────────┼─────────────────────┐
      │                  │                     │
      ▼                  ▼                     ▼
    Nmap              Nuclei               Httpx
      │                  │                     │
      ▼                  ▼                     ▼
    Katana            FFUF               Subfinder
⚡ Technology Stack
Backend
Python
FastAPI
SQLAlchemy 2.0
Pydantic
Alembic
AsyncIO
Frontend
Next.js 16
React 19
TypeScript
Tailwind CSS
Recharts
React Flow
AI
Ollama
LangGraph
Multi-Agent Architecture
Database
PostgreSQL
SQLite (Development)
Security
JWT
RBAC
API Keys
Audit Logs
📁 Project Structure
Danix/

├── frontend/
├── pentest_backend/
│   ├── app/
│   ├── agents/
│   ├── plugins/
│   ├── graph/
│   ├── tools/
│   ├── database/
│   ├── models/
│   ├── services/
│   └── api/
│
├── docs/
├── reports/
└── tests/
🔄 Scan Workflow
Target
   │
   ▼
AI Planning
   │
   ▼
Reconnaissance
   │
   ▼
Network Analysis
   │
   ▼
Web Application Analysis
   │
   ▼
AI Correlation
   │
   ▼
Report Generation
📈 Current Capabilities
Enterprise Multi-Tenant Architecture
AI Multi-Agent Security Workflow
Plugin-Based Scan Engine
Modular Tool Integration
Background Task Processing
Live Scan Monitoring
Executive Report Generation
RESTful API
Interactive Swagger Documentation
Role-Based Access Control
Audit Logging
Enterprise Security Middleware
🎯 Target Users
Penetration Testers
Security Engineers
SOC Analysts
Red Teams
Blue Teams
MSSPs
Security Consultants
Enterprise Security Teams
🚀 Roadmap
Distributed Workers
AI Attack Path Generation
RAG-Based Security Knowledge
Cloud Deployment
Kubernetes Support
SIEM Integration
Jira Integration
Slack Integration
Microsoft Teams Integration
WebSocket Live Monitoring
📚 API Documentation
http://localhost:8000/docs
http://localhost:8000/redoc
🤝 Contributing

Contributions are welcome! Feel free to fork the repository, open issues, and submit pull requests to improve Danix.

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Sahil Danish

Cybersecurity • AI • Offensive Security • Security Engineering
