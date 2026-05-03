#!/bash
echo "🚀 Starting INTENT local infrastructure..."
docker compose -f infra/local/docker-compose.yml up -d
echo "⏳ Waiting for services..."
sleep 5
echo "✅ INTENT local dev ready!"
echo "   Redis:    redis://localhost:6379"
echo "   Postgres: postgresql://intent:password@localhost:5432/intent_db"
