#!/bin/bash

set -u

cd "$HOME/psychology-project" || exit 1

export VERTEXAI_PROJECT="mypsichology"
export VERTEXAI_LOCATION="global"

unset OPENROUTER_API_KEY
unset GEMINI_API_KEY
unset GOOGLE_API_KEY
unset GOOGLE_APPLICATION_CREDENTIALS

AIDER="$HOME/miniconda3/envs/agent_env/bin/aider"
LOG="$HOME/psychology-project/agent.log"

echo "========================================" >> "$LOG"
echo "MenteEnCalma autonomous agent started" >> "$LOG"
echo "Started: $(date)" >> "$LOG"
echo "========================================" >> "$LOG"

while true; do

  echo "" >> "$LOG"
  echo "===== NEW AIDER CYCLE $(date) =====" >> "$LOG"

  "$AIDER" \
    --model "vertex_ai/zai-org/glm-5.2-maas" \
    --no-show-model-warnings \
    --no-browser \
    --yes-always \
    --auto-commits \
    --message-file PROMPT.md \
    --message "Continue autonomous development of MenteEnCalma from the CURRENT repository state. Do not repeat work that is already complete. First inspect git status, existing implementation and recent commits. Then identify the highest-value unfinished work from PROMPT.md and implement it directly. Work iteratively: inspect, implement, test, fix, build, verify. Run npm run build after meaningful changes and fix all errors. Continue from the current state rather than restarting the project conceptually. Do not ask for normal confirmation. Do not add AI/chatbot/LLM functionality inside the product. Do not expose credentials. If a feature is already implemented, verify it instead of recreating it. Your goal is a genuinely finished, polished, production-ready MenteEnCalma website/PWA/application, including public website, legal pages, Google authentication, user cabinet, real data, pattern engine, analytics, privacy, mobile UX and Android build where the environment permits. Before ending this cycle, make real progress or verify the project is already complete." \
    >> "$LOG" 2>&1

  EXIT_CODE=$?

  echo "===== AIDER EXIT CODE: $EXIT_CODE =====" >> "$LOG"

  echo "Checking repository state..." >> "$LOG"
  git status --short >> "$LOG" 2>&1 || true

  echo "Recent commits:" >> "$LOG"
  git log -3 --oneline >> "$LOG" 2>&1 || true

  echo "Checking build..." >> "$LOG"
  npm run build >> "$LOG" 2>&1
  BUILD_CODE=$?

  echo "===== BUILD EXIT CODE: $BUILD_CODE =====" >> "$LOG"

  if [ "$BUILD_CODE" -eq 0 ]; then
    echo "BUILD SUCCESSFUL" >> "$LOG"
  else
    echo "BUILD FAILED - next Aider cycle will fix it" >> "$LOG"
  fi

  sleep 5

done
