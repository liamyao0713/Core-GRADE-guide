#!/bin/bash

# CoreGradeWebsite local preview server
# Usage: ./start_server.sh [port]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$SCRIPT_DIR/.server.pid"
PORT_FILE="$SCRIPT_DIR/.server.port"
LOG_FILE="$SCRIPT_DIR/server.log"
LAUNCH_LABEL="com.coregradewebsite.local"
PORT="${1:-8000}"

cd "$SCRIPT_DIR"

if command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="$(command -v python3)"
elif command -v python >/dev/null 2>&1; then
    PYTHON_BIN="$(command -v python)"
else
    echo "Python is required to start the local server."
    exit 1
fi

if [ -f "$PID_FILE" ]; then
    OLD_PID="$(cat "$PID_FILE")"
    if kill -0 "$OLD_PID" >/dev/null 2>&1; then
        RUNNING_PORT="$PORT"
        if [ -f "$PORT_FILE" ]; then
            RUNNING_PORT="$(cat "$PORT_FILE")"
        fi
        echo "CoreGradeWebsite is already running."
        echo "Local URL: http://localhost:$RUNNING_PORT/"
        echo "To stop:   ./stop_server.sh"
        exit 0
    fi
    rm -f "$PID_FILE"
    rm -f "$PORT_FILE"
fi

while lsof -PiTCP:"$PORT" -sTCP:LISTEN -t >/dev/null 2>&1; do
    PORT=$((PORT + 1))
done

echo "============================================"
echo "  CoreGradeWebsite Local Server"
echo "============================================"

SERVER_PID=""

if [ "$(uname -s)" = "Darwin" ] && command -v launchctl >/dev/null 2>&1; then
    launchctl remove "$LAUNCH_LABEL" >/dev/null 2>&1 || true
    if launchctl submit -l "$LAUNCH_LABEL" -o "$LOG_FILE" -e "$LOG_FILE" -- "$PYTHON_BIN" -m http.server --bind 127.0.0.1 --directory "$SCRIPT_DIR" "$PORT"; then
        sleep 1
        SERVER_PID="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN | head -n 1)"
    fi
fi

if [ -z "$SERVER_PID" ]; then
    nohup "$PYTHON_BIN" -m http.server --bind 127.0.0.1 --directory "$SCRIPT_DIR" "$PORT" > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!
    sleep 1
fi

echo "$SERVER_PID" > "$PID_FILE"
echo "$PORT" > "$PORT_FILE"

if [ -z "$SERVER_PID" ] || ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    echo "Failed to start server. See: $LOG_FILE"
    rm -f "$PID_FILE"
    rm -f "$PORT_FILE"
    exit 1
fi

echo ""
echo "  Local URL: http://localhost:$PORT/"
echo "  Folder:    $SCRIPT_DIR"
echo "  Log:       $LOG_FILE"
echo "  PID:       $SERVER_PID"
echo ""
echo "Server is running locally. You can close this terminal."
echo "To stop: ./stop_server.sh"
echo "============================================"
