#!/usr/bin/env python3
import sys
import json
import subprocess
import os

# ANSI color codes
CYAN = "\033[1;36m"
GREEN = "\033[1;32m"
YELLOW = "\033[1;33m"
MAGENTA = "\033[1;35m"
RESET = "\033[0m"
BOLD = "\033[1m"

def get_git_branch(cwd):
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=cwd,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except Exception:
        return "no-git"

def shorten_path(path, max_length=35):
    if len(path) <= max_length:
        return path
    
    parts = path.split("/")
    parts = [p for p in parts if p]
    
    if len(parts) <= 2:
        return path
        
    if path.startswith("~"):
        # Skip the "~" part if it's the first element in parts
        start_idx = 1 if parts[0] == "~" else 0
        return f"~/.../{'/'.join(parts[-2:])}"
    else:
        return f".../{'/'.join(parts[-2:])}"

def main():
    try:
        input_data = sys.stdin.read()
        if not input_data.strip():
            state = {}
        else:
            state = json.loads(input_data)
    except Exception:
        state = {}

    cwd = state.get("cwd", os.getcwd())
    
    # Extract model name (could be dict or string)
    model_data = state.get("model", "Gemini")
    if isinstance(model_data, dict):
        model = model_data.get("display_name") or model_data.get("id") or "Gemini"
    else:
        model = str(model_data)
        
    conv_id = state.get("conversation_id") or state.get("conversationId", "")
    if conv_id:
        conv_id_short = conv_id[:8]
    else:
        conv_id_short = "N/A"

    branch = get_git_branch(cwd)
    if len(branch) > 20:
        branch = branch[:17] + "..."
    
    home = os.path.expanduser("~")
    display_cwd = cwd.replace(home, "~")
    short_cwd = shorten_path(display_cwd)
    
    # Format a professional, clean status bar
    status = (
        f"{BOLD}[agy]{RESET} "
        f"🤖 {CYAN}{model}{RESET} | "
        f"🌿 {GREEN}{branch}{RESET} | "
        f"📂 {YELLOW}{short_cwd}{RESET} | "
        f"💬 {MAGENTA}id:{conv_id_short}{RESET}"
    )
    
    print(status)

if __name__ == "__main__":
    main()
