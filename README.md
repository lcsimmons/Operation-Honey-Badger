# Operation-Honey-Badger

**An AI-Powered Dynamic Honeypot for Web Application Threat Intelligence**

---

## Overview

Operation-Honey-Badger is a dynamic honeypot system designed to attract, monitor, and analyze attacker behavior. It uses Flask, PostgreSQL, and Google Gemini to capture attacker interactions, analyze tactics, and automatically generate attacker profile reports for SOC teams.

---

## Installation Instructions

Ensure the following are installed:
- Python 3.10+
- Node.js + npm
- Docker (for optional DB container)
- `make`

To install:
```bash
chmod +x install.sh
./install.sh
```

This script:
- Verifies dependencies
- Loads `.env` configurations
- Builds all backend/frontend services
- Offers to initialize a PostgreSQL container with sample schema

> **Note**: For production deployment, update `.env` URLs and configure components as system services or use Docker Compose/Kubernetes.

---

## Project Structure

```
Operation-Honey-Badger/
├── backend-flask/
│   ├── app.py                # Flask API with Gemini integration
│   ├── postgres_db.py        # PostgreSQL logging logic
│   ├── decoy_database.py     # In-memory SQLite decoy DB
│   └── ...
├── frontend/
├── frontend-admin/
├── docker-compose.yml
├── install.sh
└── .env                     # Sensitive keys (excluded from repo)
```

---

## Running the System

To run locally:
```bash
# Backend
cd backend-flask
flask run

# Frontend
cd frontend
npm install && npm run dev

# Admin Dashboard
cd frontend-admin
npm install && npm run dev
```

---

## API Specification

### Key Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/login` | POST | Simulates login page, logs attacker payload |
| `/api/admin/reimbursement` | GET | Decoy reimbursement DB |
| `/api/admin/employees` | GET | Decoy employee directory |
| `/api/generate_narrative_report` | GET | Generates Gemini narrative report for given `attacker_id` |

---

## AI Integration

Google Gemini is used to:
- Analyze attacker payloads
- Detect OWASP Top-10 techniques
- Generate SOC-friendly attacker summaries

Responses are stored in the `soc_dashboard` PostgreSQL table.

---

## Design Highlights

- Modular Flask backend with memory + persistent DB
- Gemini-powered real-time attack analysis
- SOC Dashboard for viewing attacker reports
- Accessibility-first UI (TTS, font-size, translations)

---

## Contribution Guide

### How to Contribute

1. Clone the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push and create a PR

### Coding Standards

- Use descriptive commit messages
- Write docstrings for new functions
- Frontend: Follow TailwindCSS and React hooks conventions
- Backend: Use Flask RESTful patterns and `@app.route`

---

## Authors

- Abhinav Nallam
- Adrien Shipou
- Connor Fergus
- Geoff Bosenbark
- Lane Simmons
- Quinn Gleadell

---
