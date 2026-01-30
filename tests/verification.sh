#!/bin/bash
set -e

echo "=== deployment verification ==="
echo "1. Checking Swarm Nodes"
docker node ls

echo "2. Checking Stack Services"
docker stack services schnitter

echo "3. Waiting for services to stabilize (10s)..."
sleep 10

echo "4. Checking Application Endpoints"
echo "   - Web Root (http://localhost:8079)"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8079

echo "   - API Health via Nginx (http://localhost:8079/api/health)"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8079/api/health

echo "=== verification complete ==="
