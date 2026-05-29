#!/bin/bash

# CoreGradeWebsite local server stop script

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$SCRIPT_DIR/.server.pid"
PORT_FILE="$SCRIPT_DIR/.server.port"
LAUNCH_LABEL="com.coregradewebsite.local"

if [ ! -f "$PID_FILE" ]; then
    SERVER_PID=""
else
    SERVER_PID="$(cat "$PID_FILE")"
fi

STOPPED=0

if [ "$(uname -s)" = "Darwin" ] && command -v launchctl >/dev/null 2>&1; then
    if launchctl remove "$LAUNCH_LABEL" >/dev/null 2>&1; then
        STOPPED=1
    fi
fi

if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID"
    STOPPED=1
fi

if [ "$STOPPED" -eq 0 ] && [ -f "$PORT_FILE" ]; then
    PORT="$(cat "$PORT_FILE")"
    SERVER_PID="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN | head -n 1)"
    if [ -n "$SERVER_PID" ]; then
        kill "$SERVER_PID"
        STOPPED=1
    fi
fi

rm -f "$PID_FILE"
rm -f "$PORT_FILE"

if [ "$STOPPED" -eq 1 ]; then
    echo "CoreGradeWebsite local server stopped."
else
    echo "CoreGradeWebsite local server is not running."
fi
