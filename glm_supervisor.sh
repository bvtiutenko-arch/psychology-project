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
# GOOGLE_APPLICATION_CREDENTIALS is intentionally preserved for deployment.

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
    # TWO BUILD METHODS + FALLBACK
    # --------------------------------------------------------

    echo "===== BUILD AFTER CYCLE $CYCLE =====" >> "$LOG"

    BUILD_EXIT=1

    # ========================================================
    # BUILD METHOD 1: npm run build
    # ========================================================

    echo "===== BUILD METHOD 1: npm run build =====" >> "$LOG"

    npm run build >> "$LOG" 2>&1
    BUILD_EXIT=$?

    echo "BUILD METHOD 1 EXIT CODE: $BUILD_EXIT" >> "$LOG"

    if [ "$BUILD_EXIT" -eq 0 ]; then

        echo "BUILD METHOD 1 SUCCESSFUL" >> "$LOG"

    else

        echo "BUILD METHOD 1 FAILED" >> "$LOG"

        # ====================================================
        # BUILD METHOD 2: direct TypeScript + Vite build
        # ====================================================

        echo "===== BUILD METHOD 2: npx tsc && npx vite build =====" >> "$LOG"

        npx tsc && npx vite build >> "$LOG" 2>&1
        BUILD_EXIT=$?

        echo "BUILD METHOD 2 EXIT CODE: $BUILD_EXIT" >> "$LOG"

        if [ "$BUILD_EXIT" -eq 0 ]; then
            echo "BUILD METHOD 2 SUCCESSFUL" >> "$LOG"
        else
            echo "BUILD METHOD 2 FAILED" >> "$LOG"
        fi

    fi

    # ========================================================
    # FINAL BUILD RESULT
    # ========================================================

    if [ "$BUILD_EXIT" -eq 0 ]; then
        echo "===== FINAL BUILD STATUS: SUCCESS =====" >> "$LOG"

        # --------------------------------------------------------
        # FIREBASE DEPLOY
        # --------------------------------------------------------

        echo "===== FIREBASE DEPLOY AFTER SUCCESSFUL BUILD =====" >> "$LOG"

        npm run deploy >> "$LOG" 2>&1
        DEPLOY_EXIT=$?

        echo "DEPLOY EXIT CODE: $DEPLOY_EXIT" >> "$LOG"

        if [ "$DEPLOY_EXIT" -eq 0 ]; then
            echo "===== FIREBASE DEPLOY STATUS: SUCCESS =====" >> "$LOG"

            # ----------------------------------------------------
            # GIT COMMIT
            # ----------------------------------------------------

            echo "===== GIT COMMIT =====" >> "$LOG"

            git add -A >> "$LOG" 2>&1

            if git diff --cached --quiet; then
                echo "NO NEW GIT CHANGES TO COMMIT" >> "$LOG"
            else
                git commit -m "chore: autonomous development cycle $CYCLE" >> "$LOG" 2>&1
                COMMIT_EXIT=$?

                echo "COMMIT EXIT CODE: $COMMIT_EXIT" >> "$LOG"

                if [ "$COMMIT_EXIT" -eq 0 ]; then
                    echo "GIT COMMIT SUCCESSFUL" >> "$LOG"
                else
                    echo "GIT COMMIT FAILED" >> "$LOG"
                fi
            fi

            # ----------------------------------------------------
            # GIT PUSH
            # ----------------------------------------------------

            echo "===== GIT PUSH =====" >> "$LOG"

            git push origin master >> "$LOG" 2>&1
            PUSH_EXIT=$?

            echo "PUSH EXIT CODE: $PUSH_EXIT" >> "$LOG"

            if [ "$PUSH_EXIT" -eq 0 ]; then
                echo "GIT PUSH SUCCESSFUL" >> "$LOG"
            else
                echo "GIT PUSH FAILED" >> "$LOG"
            fi

        else
            echo "===== FIREBASE DEPLOY STATUS: FAILED =====" >> "$LOG"
            echo "Skipping git push because deployment failed." >> "$LOG"
        fi

    else
        echo "===== FINAL BUILD STATUS: FAILED =====" >> "$LOG"
        echo "Skipping Firebase deployment because build failed." >> "$LOG"
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
