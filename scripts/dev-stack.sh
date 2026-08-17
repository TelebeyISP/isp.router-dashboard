#!/usr/bin/env bash
# Start MongoDB (if needed), the Open5GS WebUI, and optionally ApiGate.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEBUI="$ROOT/webui"
APIGATE_DIR="${APIGATE_DIR:-$ROOT/../ApiGate}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-9999}"
export DB_URI="${DB_URI:-mongodb://127.0.0.1:27017/open5gs}"
export APIGATE_URL="${APIGATE_URL:-http://127.0.0.1:4000}"

echo "==> Router dashboard + ApiGate dev stack"
echo "    DB_URI=$DB_URI"
echo "    APIGATE_URL=$APIGATE_URL"

if ! command -v mongod >/dev/null 2>&1 && [[ ! -x /opt/mongodb/bin/mongod ]]; then
  echo "mongod not found on PATH. Install MongoDB 6+ or set PATH to include it." >&2
  exit 1
fi

MONGOD_BIN="$(command -v mongod || true)"
[[ -x /opt/mongodb/bin/mongod ]] && MONGOD_BIN=/opt/mongodb/bin/mongod

if ! nc -z 127.0.0.1 27017 >/dev/null 2>&1; then
  echo "==> Starting MongoDB on :27017"
  mkdir -p /tmp/telebey-mongo-data
  "$MONGOD_BIN" --dbpath /tmp/telebey-mongo-data --bind_ip 127.0.0.1 --port 27017 --fork --logpath /tmp/telebey-mongod.log
fi

if [[ -d "$APIGATE_DIR/telebey-platform/apps/api" ]]; then
  echo "==> ApiGate sources found at $APIGATE_DIR"
else
  echo "==> ApiGate not cloned. Dashboard will still run; clone https://github.com/TelebeyISP/ApiGate.git to enable the gateway."
fi

cd "$WEBUI"
if [[ ! -d node_modules ]]; then
  npm install
fi

exec npm run dev
