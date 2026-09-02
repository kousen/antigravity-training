#!/usr/bin/env bash
#
# verify-setup.sh - Pre-flight environment check for Antigravity CLI Course
# Run this before class to ensure your environment has everything required.
#

set -u

GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
BLUE="\033[1;34m"
RESET="\033[0m"

echo -e "${BLUE}======================================================${RESET}"
echo -e "${BLUE}    Antigravity CLI Course — Pre-Flight Environment Check${RESET}"
echo -e "${BLUE}======================================================${RESET}"
echo ""

HAS_ERRORS=0
HAS_WARNINGS=0

# 1. Antigravity CLI (agy)
echo -n "Checking Antigravity CLI (agy)... "
if command -v agy &> /dev/null; then
    AGY_VER=$(agy --version 2>/dev/null || echo "installed")
    echo -e "${GREEN}OK${RESET} ($AGY_VER)"
else
    echo -e "${RED}FAILED${RESET}"
    echo -e "   ${YELLOW}→ agy is not in your PATH.${RESET}"
    echo -e "   Install via: curl -fsSL https://antigravity.google/cli/install.sh | bash"
    echo -e "   Ensure ~/.local/bin is added to your PATH in ~/.bashrc or ~/.zshrc:"
    echo -e "     export PATH=\"\$HOME/.local/bin:\$PATH\""
    HAS_ERRORS=$((HAS_ERRORS + 1))
fi

# 2. Git
echo -n "Checking Git... "
if command -v git &> /dev/null; then
    GIT_VER=$(git --version)
    echo -e "${GREEN}OK${RESET} ($GIT_VER)"
else
    echo -e "${RED}FAILED${RESET}"
    echo -e "   ${YELLOW}→ git is required for session safety and lab exercises.${RESET}"
    HAS_ERRORS=$((HAS_ERRORS + 1))
fi

# 3. Node.js (18+ recommended)
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VER=$(node --version)
    echo -e "${GREEN}OK${RESET} ($NODE_VER)"
else
    echo -e "${YELLOW}WARNING${RESET}"
    echo -e "   ${YELLOW}→ node is not installed. Needed to run Slidev slides and JS labs.${RESET}"
    echo -e "   Download from https://nodejs.org (Node.js 18+ LTS recommended)."
    HAS_WARNINGS=$((HAS_WARNINGS + 1))
fi

# 4. Python 3 (3.10+)
echo -n "Checking Python 3... "
if command -v python3 &> /dev/null; then
    PY_VER=$(python3 --version)
    echo -e "${GREEN}OK${RESET} ($PY_VER)"
else
    echo -e "${YELLOW}WARNING${RESET}"
    echo -e "   ${YELLOW}→ python3 is not installed. Needed if you choose the Python lab.${RESET}"
    HAS_WARNINGS=$((HAS_WARNINGS + 1))
fi

# 5. Java (21+)
echo -n "Checking Java... "
if command -v java &> /dev/null; then
    JAVA_LINE=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}OK${RESET} ($JAVA_LINE)"
else
    echo -e "${YELLOW}WARNING${RESET}"
    echo -e "   ${YELLOW}→ java is not installed. Needed if you choose the Java Spring Boot lab.${RESET}"
    HAS_WARNINGS=$((HAS_WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}------------------------------------------------------${RESET}"

if [ "$HAS_ERRORS" -eq 0 ] && [ "$HAS_WARNINGS" -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! You are completely ready for class.${RESET}"
    exit 0
elif [ "$HAS_ERRORS" -eq 0 ]; then
    echo -e "${YELLOW}⚠️ Setup ready with warnings. Check that languages for your chosen labs are available.${RESET}"
    exit 0
else
    echo -e "${RED}❌ Some required tools are missing. Please review the instructions above.${RESET}"
    exit 1
fi
