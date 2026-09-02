#!/bin/bash

set -u

PROJECT="$HOME/psychology-project"
AIDER="$HOME/miniconda3/envs/agent_env/bin/aider"
LOG="$PROJECT/agent.log"

cd "$PROJECT" || exit 1

export VERTEXAI_PROJECT="mypsichology"
export VERTEXAI_LOCATION="global"

unset OPENROUTER_API_KEY
unset GEMINI_API_KEY
unset GOOGLE_API_KEY
unset GOOGLE_APPLICATION_CREDENTIALS

echo "" >> "$LOG"
echo "==================================================" >> "$LOG"
echo "STABLE GLM 5.2 SUPERVISOR STARTED" >> "$LOG"
echo "$(date)" >> "$LOG"
echo "==================================================" >> "$LOG"

CYCLE=0

while true; do

    CYCLE=$((CYCLE + 1))

    echo "" >> "$LOG"
    echo "==================================================" >> "$LOG"
    echo "CYCLE $CYCLE START — $(date)" >> "$LOG"
    echo "==================================================" >> "$LOG"

    # --------------------------------------------------------
    # Передаємо Aider тільки ТЕКСТОВІ файли проекту.
    # Бінарні assets не потрібні моделі для основної роботи.
    # --------------------------------------------------------

    FILE_ARGS=()

    while IFS= read -r FILE; do
        FILE_ARGS+=(--file "$FILE")
    done < <(
        find "$PROJECT/src" -type f \
          \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \
             -o -name '*.css' -o -name '*.json' -o -name '*.html' \) \
          | sort
    )

    FILE_ARGS+=(--file "$PROJECT/package.json")
    FILE_ARGS+=(--file "$PROJECT/vite.config.ts")
    FILE_ARGS+=(--file "$PROJECT/firebase.json")
    FILE_ARGS+=(--file "$PROJECT/.firebaserc")

    echo "TEXT FILES PROVIDED: ${#FILE_ARGS[@]}" >> "$LOG"

    # --------------------------------------------------------
    # ОДИН AIDER ЦИКЛ
    #
    # Максимум 20 хвилин.
    # Якщо завис — timeout його прибере.
    # --------------------------------------------------------

    timeout --signal=TERM --kill-after=60s 20m \
    "$AIDER" \
        --model "vertex_ai/zai-org/glm-5.2-maas" \
        --no-show-model-warnings \
        --no-browser \
        --yes-always \
        --auto-commits \
        "${FILE_ARGS[@]}" \
        --message-file "$PROJECT/PROMPT.md" \
        --message "
AUTONOMOUS DEVELOPMENT CYCLE $CYCLE

Work on the CURRENT repository state.

You have the real project source files in context.
Do not claim lack of repository access.

FIRST:
Inspect the current implementation and recent git history.
Determine what is already finished.
Do not recreate completed features.

THEN:
Choose the SINGLE highest-value unfinished task and implement it completely.

ANTI-LOOP RULE:
Never spend the whole cycle repeating one failed operation.

If something fails:
- diagnose why;
- try a different technical approach;
- use a fallback/workaround;
- or move to another important task.

Do NOT repeat the same failed command more than twice.

Make real code changes.
Do not only explain or write documentation.

PRIORITY:
1. Runtime/build correctness
2. Public website
3. Google authentication
4. User cabinet
5. Real per-user data
6. Pattern engine
7. Connection map
8. Dashboard
9. Analytics
10. Night Mode
11. Tomorrow Box
12. History
13. Privacy/export/delete
14. Legal/privacy/cookie/terms/contact pages
15. PWA
16. Android APK/AAB if tooling permits
17. UX polish

The application itself MUST NOT contain AI/chatbot/LLM functionality.

Spanish-first.
Peru-first.
Mobile-first.
Privacy-first.
Non-diagnostic.

IMPORTANT:
Do not stop at analysis.
Do not ask for confirmation for normal technical decisions.
Do not invent credentials.
Do not expose credentials.

Before finishing this cycle:
- make real progress;
- test the changed functionality;
- run npm run build;
- fix build errors when possible.

If the selected task becomes blocked, immediately switch to the next highest-value task.

The goal is continuous REAL progress toward a finished production-ready MenteEnCalma.
"

    AIDER_EXIT=$?

    echo "AIDER EXIT CODE: $AIDER_EXIT" >> "$LOG"

    if [ "$AIDER_EXIT" -eq 124 ]; then
        echo "AIDER TIMEOUT: cycle exceeded 20 minutes; moving to next cycle" >> "$LOG"
    fi

    # --------------------------------------------------------
    # BUILD
    # --------------------------------------------------------

    echo "===== BUILD AFTER CYCLE $CYCLE =====" >> "$LOG"

    npm run build >> "$LOG" 2>&1
    BUILD_EXIT=$?

    echo "BUILD EXIT CODE: $BUILD_EXIT" >> "$LOG"

    if [ "$BUILD_EXIT" -eq 0 ]; then
        echo "BUILD SUCCESSFUL" >> "$LOG"
    else
        echo "BUILD FAILED" >> "$LOG"
    fi

    # --------------------------------------------------------
    # GIT STATE
    # --------------------------------------------------------

    echo "===== GIT STATUS =====" >> "$LOG"
    git status --short >> "$LOG" 2>&1 || true

    echo "===== RECENT COMMITS =====" >> "$LOG"
    git log -5 --oneline >> "$LOG" 2>&1 || true

    echo "===== CYCLE $CYCLE COMPLETE =====" >> "$LOG"

    sleep 5

done
