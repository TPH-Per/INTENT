import React, { useState, useEffect } from 'react';
import './App.css';

function useWebSocket(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };
    return () => ws.close();
  }, [url]);

  return data;
}

function App() {
  const [intents, setIntents] = useState([
    { id: '1', name: 'Zero P1 Bugs', status: 'WARN', gap: 0.15 },
    { id: '2', name: 'API p99 < 200ms', status: 'OK', gap: 0.0 }
  ]);
  const [logs, setLogs] = useState([]);

  // In production, connect to SSE or WebSocket server
  const liveUpdate = useWebSocket('ws://localhost:8001/streams');

  useEffect(() => {
    if (liveUpdate) {
      // Update local state with live event data
      console.log('Live update received:', liveUpdate);
    }
  }, [liveUpdate]);

  return (
    <div className="dashboard">
      <header>
        <h1>INTENT — Universal Control Plane</h1>
      </header>
      
      <main>
        <section className="intent-grid">
          <h2>Active Intents</h2>
          <div className="grid">
            {intents.map(intent => (
              <div key={intent.id} className={`card ${intent.status.toLowerCase()}`}>
                <h3>{intent.name}</h3>
                <div className="status">Gap: {intent.gap}</div>
                <div className="last-checked">Last checked: 1 min ago</div>
              </div>
            ))}
          </div>
        </section>

        <section className="activity-timeline">
          <h2>Activity Timeline</h2>
          <div className="log-entry">
            <span className="timestamp">12:45:01</span> - 
            <span className="agent-tag">CodeAgent</span>: Opened PR #1
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
