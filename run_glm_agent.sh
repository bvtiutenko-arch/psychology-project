#!/bin/bash

cd "$HOME/psychology-project" || exit 1

export VERTEXAI_PROJECT="mypsichology"
export VERTEXAI_LOCATION="global"

unset OPENROUTER_API_KEY
unset GEMINI_API_KEY
unset GOOGLE_API_KEY
unset GOOGLE_APPLICATION_CREDENTIALS

AIDER="$HOME/miniconda3/envs/agent_env/bin/aider"
LOG="$HOME/psychology-project/agent.log"

echo "============================================" >> "$LOG"
echo "GLM 5.2 AUTONOMOUS AGENT STARTED" >> "$LOG"
echo "$(date)" >> "$LOG"
echo "============================================" >> "$LOG"

while true
do
    echo "" >> "$LOG"
    echo "========== NEW CYCLE ==========" >> "$LOG"
    date >> "$LOG"

    # Формуємо актуальний список файлів КОЖНОГО циклу
    FILES=()

    while IFS= read -r file
    do
        FILES+=("$file")
    done < <(
        find src -type f \
            ! -name '*.map' \
            ! -path '*/node_modules/*' \
            | sort
    )

    FILES+=(
        package.json
        vite.config.ts
        firebase.json
        .firebaserc
    )

    echo "Files in context: ${#FILES[@]}" >> "$LOG"

    "$AIDER" \
        --model "vertex_ai/zai-org/glm-5.2-maas" \
        --no-show-model-warnings \
        --no-browser \
        --yes-always \
        --auto-commits \
        --message-file "$HOME/psychology-project/PROMPT.md" \
        --message "Continue development from the CURRENT repository state.

You have the real project files explicitly provided to you.
Do NOT claim that you lack repository access.

First inspect the existing implementation and recent git commits.
Do NOT recreate functionality that is already complete.

Your task is to make REAL code changes toward a finished MenteEnCalma product.

Work autonomously.

CRITICAL ANTI-LOOP RULE:
Never repeat the same failed approach indefinitely.
If something fails, diagnose it and use another approach.
Use fallback/workaround/alternative architecture when appropriate.
If a blocker cannot be solved, document it and move to the next highest-value task.

PRIORITY:
1. Fix runtime/build errors.
2. Finish public website.
3. Finish Google authentication.
4. Finish authenticated personal cabinet.
5. Finish real user data persistence and isolation.
6. Finish pattern engine.
7. Finish connection map.
8. Finish dashboard and analytics.
9. Finish night mode and tomorrow box.
10. Finish privacy/export/delete.
11. Finish responsive mobile UX.
12. Finish PWA.
13. Finish privacy/cookie/terms/legal/contact pages.
14. Build Android APK/AAB when environment permits.
15. Test and fix everything.

The application itself MUST NOT contain AI, chatbot or LLM functionality.

Use Spanish, Peru-first UX.
Keep the product non-diagnostic and privacy-first.

Do not expose credentials.
Do not invent credentials.
Do not destroy working functionality.

Make actual edits.
Do not merely describe what should be done.

Before finishing this cycle:
- test your changes
- run npm run build
- fix build errors if possible
- leave the repository in a better state
" \
        "${FILES[@]}" \
        >> "$LOG" 2>&1

    EXIT_CODE=$?

    echo "AIDER EXIT CODE: $EXIT_CODE" >> "$LOG"

    echo "===== GIT STATUS =====" >> "$LOG"
    git status --short >> "$LOG" 2>&1

    echo "===== RECENT COMMITS =====" >> "$LOG"
    git log -5 --oneline >> "$LOG" 2>&1

    echo "===== BUILD =====" >> "$LOG"
    npm run build >> "$LOG" 2>&1

    BUILD_CODE=$?
    echo "BUILD EXIT CODE: $BUILD_CODE" >> "$LOG"

    if [ "$BUILD_CODE" -eq 0 ]
    then
        echo "BUILD SUCCESSFUL" >> "$LOG"
    else
        echo "BUILD FAILED - NEXT CYCLE MUST FIX IT" >> "$LOG"
    fi

    sleep 10
done
