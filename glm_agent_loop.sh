#!/bin/bash

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
echo "GLM 5.2 AGENT LOOP STARTED" >> "$LOG"
echo "$(date)" >> "$LOG"
echo "==================================================" >> "$LOG"

CYCLE=0

while true; do

    CYCLE=$((CYCLE + 1))

    echo "" >> "$LOG"
    echo "==================================================" >> "$LOG"
    echo "CYCLE $CYCLE START $(date)" >> "$LOG"
    echo "==================================================" >> "$LOG"

    # --------------------------------------------------------
    # Формуємо актуальний список вихідних файлів
    # --------------------------------------------------------

    FILE_ARGS=()

    while IFS= read -r FILE; do
        FILE_ARGS+=(--file "$FILE")
    done < <(
        find "$PROJECT/src" -type f \
            ! -name '*.map' \
            ! -path '*/node_modules/*' \
            | sort
    )

    FILE_ARGS+=(--file "$PROJECT/package.json")
    FILE_ARGS+=(--file "$PROJECT/vite.config.ts")
    FILE_ARGS+=(--file "$PROJECT/firebase.json")
    FILE_ARGS+=(--file "$PROJECT/.firebaserc")

    echo "Aider files: ${#FILE_ARGS[@]}" >> "$LOG"

    # --------------------------------------------------------
    # Один автономний Aider cycle
    # --------------------------------------------------------

    "$AIDER" \
        --model "vertex_ai/zai-org/glm-5.2-maas" \
        --no-show-model-warnings \
        --no-browser \
        --yes-always \
        --auto-commits \
        "${FILE_ARGS[@]}" \
        --message-file "$PROJECT/PROMPT.md" \
        --message "
CONTINUE WORKING ON THE CURRENT REAL REPOSITORY.

You have the actual project files in your Aider context.
Do NOT claim that you lack repository access.

Inspect the current implementation and git history first.
Do not recreate features that are already implemented.

Make REAL code changes.

PRIMARY GOAL:
Finish MenteEnCalma as a complete, polished, production-ready product.

Required:
- Spanish / Peru-first
- responsive public website
- complete landing page
- privacy page
- cookie policy
- terms
- legal notice
- contact
- FAQ
- Google Firebase authentication
- protected authenticated user cabinet
- real per-user data
- dashboard
- event capture
- deterministic pattern engine
- connection map
- analytics
- night mode
- tomorrow box
- history
- privacy
- export
- delete all
- PWA
- Android APK/AAB if the environment supports it

The application itself MUST NOT contain AI/chatbot/LLM functionality.

CRITICAL ANTI-LOOP RULE:

Never repeat the same failed approach indefinitely.

When something fails:
1. diagnose the exact failure;
2. try another implementation;
3. use a workaround/fallback;
4. if objectively blocked, document it and continue with another important task.

Do not spend the entire cycle explaining what should be done.
Make actual edits.

Preserve existing working functionality.

Run tests where available.
Run npm run build.
Fix build failures.
Continue making real progress.

Do not ask for confirmation for normal technical decisions.
Do not invent credentials.
Do not expose credentials.

Before this cycle ends, either implement a useful feature, fix a real problem, or verify an important part of the product.
"

    EXIT_CODE=$?

    echo "AIDER EXIT CODE: $EXIT_CODE" >> "$LOG"

    # --------------------------------------------------------
    # Перевірка build
    # --------------------------------------------------------

    echo "===== BUILD AFTER CYCLE $CYCLE =====" >> "$LOG"

    npm run build >> "$LOG" 2>&1
    BUILD_CODE=$?

    echo "BUILD EXIT CODE: $BUILD_CODE" >> "$LOG"

    if [ "$BUILD_CODE" -eq 0 ]; then
        echo "BUILD SUCCESSFUL" >> "$LOG"
    else
        echo "BUILD FAILED - NEXT CYCLE MUST FIX IT" >> "$LOG"
    fi

    # --------------------------------------------------------
    # Зберігаємо стан
    # --------------------------------------------------------

    echo "===== GIT STATUS =====" >> "$LOG"
    git status --short >> "$LOG" 2>&1 || true

    echo "===== LAST COMMITS =====" >> "$LOG"
    git log -5 --oneline >> "$LOG" 2>&1 || true

    echo "===== CYCLE $CYCLE END =====" >> "$LOG"

    sleep 10

done
