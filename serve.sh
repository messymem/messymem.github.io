#!/usr/bin/env bash
# Serve the project page locally at http://localhost:8000
# Usage: ./serve.sh [port]
set -euo pipefail
PORT="${1:-8000}"
cd "$(dirname "$0")"
echo "Serving $(pwd) at http://localhost:${PORT}  (Ctrl+C to stop)"
# Open the browser once the server is up (macOS).
( sleep 1; command -v open >/dev/null && open "http://localhost:${PORT}" ) &
exec python3 -m http.server "$PORT"
