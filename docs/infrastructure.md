# INTENT API Contract & Infrastructure

## Event Bus: Redis Streams
The "nervous system" of INTENT uses Redis Streams for at-least-once delivery and event ordering.

### Primary Streams:
1. `intent.registered`: FIS created and validated.
2. `sensor.observation`: Raw signals from Sensor Mesh.
3. `intent.gap.detected`: Semantic State Engine identifies a delta.
4. `mission.dispatched`: Gap Decomposer breaks gap into missions.
5. `mission.result`: Agents reporting back.
6. `intent.satisfied`: Verification Court confirms gap closure.

## Infrastructure Stack
- **State History:** TimescaleDB (Postgres extension for time-series).
- **Semantic Search:** Qdrant (Vector DB for intent conflict detection).
- **Dashboard:** React + Vite + Tailwind (wait, plan said Vanilla CSS preferred but plan mentions React... I'll use CSS Modules or pure CSS with React).
- **Containers:** Docker for local dev.
