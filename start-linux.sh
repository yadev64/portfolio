#!/bin/bash
# Start Portfolio — Linux
# Double-click this file or run: ./start-linux.sh

DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "🚀 Starting Yadev Portfolio..."
echo "================================"
echo ""

# Start CMS backend server
echo "📡 Starting CMS Server (port 4000)..."
cd "$DIR/local-admin/server" && node index.js &
CMS_PID=$!

# Wait for server to be ready
sleep 2

# Start Admin UI
echo "🛠  Starting Admin UI (port 5000)..."
cd "$DIR/local-admin/ui" && npm run dev &
ADMIN_PID=$!

# Start Frontend
echo "🌐 Starting Frontend (port 5173)..."
cd "$DIR/frontend" && npm run dev &
FRONTEND_PID=$!

sleep 3
echo ""
echo "================================"
echo "✅ All services running!"
echo ""
echo "  🌐 Portfolio:  http://localhost:5173"
echo "  🛠  Admin CMS:  http://localhost:5000"
echo "  📡 API Server: http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop all services."
echo "================================"

# Open browser (try common Linux browsers)
xdg-open http://localhost:5173 2>/dev/null || sensible-browser http://localhost:5173 2>/dev/null || echo "Open http://localhost:5173 in your browser"

# Wait and cleanup on exit
trap "kill $CMS_PID $ADMIN_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
