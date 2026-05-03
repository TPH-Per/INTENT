Write-Host "🚀 Starting INTENT local infrastructure..."
docker compose -f infra/local/docker-compose.yml up -d
Write-Host "⏳ Waiting for services..."
Start-Sleep -Seconds 5
Write-Host "✅ INTENT local dev ready!"
Write-Host "   Redis:    redis://localhost:6379"
Write-Host "   Postgres: postgresql://intent:password@localhost:5432/intent_db"
