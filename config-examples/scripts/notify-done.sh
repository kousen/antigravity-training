#!/bin/bash
# Stop hook: tell me the turn finished. Swap the notifier for whatever you have
# (terminal-notifier, notify-send, a Pixoo64 on the shelf...). Must print JSON.
cat >/dev/null   # drain stdin
if command -v osascript >/dev/null; then
  osascript -e 'display notification "Antigravity CLI finished" with title "agy"' >/dev/null 2>&1
elif command -v notify-send >/dev/null; then
  notify-send "agy" "Antigravity CLI finished" >/dev/null 2>&1
fi
echo '{}'
