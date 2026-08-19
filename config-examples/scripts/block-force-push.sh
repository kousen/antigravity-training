#!/bin/bash
# PreToolUse hook: deny `git push --force` / `-f` from the agent.
# stdin: {"toolCall":{"name":"run_command","args":{"CommandLine":"git push --force"}}, ...}
# stdout: {"decision":"allow"|"deny"|"ask"|"force_ask","reason":"..."}
payload=$(cat)
cmd=$(printf '%s' "$payload" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("toolCall",{}).get("args",{}).get("CommandLine",""))' 2>/dev/null)
case "$cmd" in
  *"git push"*--force*|*"git push"*" -f"*|*"git push"*--force-with-lease*)
    echo '{"decision":"deny","reason":"Force pushes are not allowed from the agent. Ask a human."}' ;;
  *)
    echo '{"decision":"allow"}' ;;
esac
