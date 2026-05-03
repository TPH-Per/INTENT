# INTENT — Continuous Outcome Orchestration

> You declare outcomes. Agents maintain them. Forever.

INTENT is an autonomous management system that translates high-level human intentions into machine-executable specifications (FIS), monitors real-world signals via a Sensor Mesh, detects gaps between intent and reality, and dispatches specialized agents to autonomously close those gaps.

## 🚀 Quick Start (5 minutes)

### 1. Clone and Install Dependencies
```bash
git clone https://github.com/TPH-Per/INTENT
cd INTENT
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and other necessary keys
```

### 3. Start Local Infrastructure
```bash
# Starts Redis, TimescaleDB (Postgres), and Qdrant via Docker
npm run dev:infra
```

### 4. Run E2E Simulation
```bash
# Verifies the entire pipeline: Intent -> Gap -> Dispatch -> Agent -> Verification
npm run simulate
```

### 5. Start Dashboard
```bash
cd dashboard
npm run dev
# Open http://localhost:3000
```

## 🧠 Core Concepts

- **FIS (Formal Intent Specification):** A measurable, machine-readable contract derived from Natural Language.
- **Sensor Mesh:** A collection of connectors (GitHub, Prometheus, Jira) that pipe live data into the system.
- **Semantic State Engine:** Matches observations to intents and calculates the "Gap Score".
- **Gap Decomposer:** Breaks down complex deviations into a Directed Acyclic Graph (DAG) of micro-missions.
- **Verification Court:** An independent agent that validates if the actions taken actually satisfied the original intent.

## 📐 Architecture

The system operates as a closed-loop control plane.
1. **Declare:** Human uses CLI/Dashboard to state intent.
2. **Formalize:** IFE Builder transforms NL into a measurable FIS.
3. **Monitor:** Sensor Mesh constantly updates the State Graph.
4. **Detect:** State Engine identifies gaps when reality deviates from intent.
5. **Act:** Dispatcher assigns specialized agents to execute micro-missions.
6. **Verify:** Verification Court confirms the gap is closed.

## 🤝 Contributing

We welcome contributions! Please ensure:
- All code is strictly typed with TypeScript.
- Every new feature includes an integration test in `core/tests/integration`.
- Changes are surgical and follow Clean Code principles.

## 📄 License

MIT © 2026 INTENT Orchestration Framework.

## 🛠 Project Structure

- `core/`: Shared types, event bus, and core logic (Brain, Nervous System).
- `agents/`: Specialized agents (Code, Doc, Ops, Comms).
- `sensors/`: Connectors for external data sources.
- `dashboard/`: React-based real-time control plane.
- `registry/`: Persistence layer for intents and audit logs.

## 🔒 Security & Reliability

- **Immutable Audit Log:** Tamper-evident logging using hash-chaining.
- **Human Approval Gate:** Mandatory checkpoints for high-risk operations.
- **Circuit Breaker:** Prevents cascading agent failures.
- **Code Sandboxing:** Isolated execution of tests and patches.

---
© 2026 INTENT Orchestration Framework.
