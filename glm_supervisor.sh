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
echo "GLM 5.2 SUPERVISOR STARTED" >> "$LOG"
echo "$(date)" >> "$LOG"
echo "==================================================" >> "$LOG"

CYCLE=0

while true; do

    CYCLE=$((CYCLE + 1))

    echo "" >> "$LOG"
    echo "##################################################" >> "$LOG"
    echo "CYCLE $CYCLE START: $(date)" >> "$LOG"
    echo "##################################################" >> "$LOG"

    # --------------------------------------------------------
    # Актуальний список файлів.
    # ENV-файли навмисно НЕ додаємо.
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

    echo "Files passed to Aider: $(( ${#FILE_ARGS[@]} / 2 ))" >> "$LOG"

    # --------------------------------------------------------
    # AIDER
    #
    # timeout = захист від нескінченного зависання одного циклу
    # Після завершення/timeout supervisor запустить новий цикл.
    # --------------------------------------------------------

    timeout --signal=TERM --kill-after=30m 50m \
    "$AIDER" \
        --model "vertex_ai/zai-org/glm-5.2-maas" \
        --no-show-model-warnings \
        --no-browser \
        --yes-always \
        --auto-commits \
        "${FILE_ARGS[@]}" \
        --message-file "$PROJECT/PROMPT.md" \
        --message "
AUTONOMOUS CONTINUATION DIRECTIVE

You are the active coding agent for the CURRENT MenteEnCalma repository.

The repository files have been explicitly provided to you with --file.
You have actual source code available.
DO NOT claim that you lack repository access.

FIRST:
- inspect the current implementation;
- inspect git status;
- inspect recent commits;
- determine what is already completed;
- continue from the current state.

DO NOT rebuild completed functionality unnecessarily.

MAIN GOAL:
Turn MenteEnCalma into the most complete working product possible.

Required product:
- polished Spanish / Peru-first public website
- complete landing page
- Google Firebase authentication
- registered-user personal cabinet
- real user-specific data
- dashboard
- event capture
- pattern engine
- connection map
- relationship analysis
- sleep/night mode
- tomorrow box
- daily/weekly/monthly analysis
- useful graphs
- behavioral experiments
- privacy controls
- export
- delete all data
- responsive mobile UX
- complete PWA
- legal/privacy/cookie/terms/contact pages
- Android APK/AAB if the environment supports it

The application itself MUST NOT contain AI, chatbot or LLM functionality.

CRITICAL ANTI-LOOP RULE:

NEVER repeatedly perform the same failed action.

When an approach fails:
1. diagnose the failure;
2. change the technical approach;
3. try a fallback;
4. if objectively blocked, document it;
5. immediately continue with another high-value task.

Do not spend the entire cycle discussing problems.
Make real code changes.

If a feature already exists:
verify it instead of recreating it.

After meaningful changes:
- test;
- run npm run build;
- fix failures;
- continue.

Do NOT ask for confirmation for normal development decisions.

Do NOT expose credentials.
Do NOT invent credentials.
Do NOT put secrets in source code.

At the end of this cycle:
leave the repository with real progress toward a finished production-ready product.

If one task is blocked, move to the next task.
Do not get stuck.
"

    AIDER_EXIT=$?

    echo "AIDER EXIT CODE: $AIDER_EXIT" >> "$LOG"

    # --------------------------------------------------------
    # BUILD AFTER EVERY AIDER CYCLE
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
    # STATE / COMMITS
    # --------------------------------------------------------

    echo "===== GIT STATUS =====" >> "$LOG"
    git status --short >> "$LOG" 2>&1 || true

    echo "===== RECENT COMMITS =====" >> "$LOG"
    git log -5 --oneline >> "$LOG" 2>&1 || true

    echo "===== CYCLE $CYCLE COMPLETE =====" >> "$LOG"

    # Маленька пауза перед наступним циклом
    sleep 10

done
