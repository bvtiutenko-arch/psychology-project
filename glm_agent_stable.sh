#!/bin/bash

set -u

PROJECT="$HOME/psychology-project"
AIDER="$HOME/miniconda3/envs/agent_env/bin/aider"
LOG="$PROJECT/agent.log"

cd "$PROJECT" || exit 1

export VERTEXAI_PROJECT="mypsichology"
export VERTEXAI_LOCATION="global"

# НЕ передаємо credentials Aider
CREDENTIALS_PATH="${GOOGLE_APPLICATION_CREDENTIALS:-}"
unset GOOGLE_APPLICATION_CREDENTIALS

unset OPENROUTER_API_KEY
unset GEMINI_API_KEY
unset GOOGLE_API_KEY
unset ANTHROPIC_API_KEY

CYCLE=0

echo "" >> "$LOG"
echo "==================================================" >> "$LOG"
echo "GLM 5.2 AUTONOMOUS SUPERVISOR STARTED" >> "$LOG"
echo "$(date)" >> "$LOG"
echo "==================================================" >> "$LOG"

while true; do

    CYCLE=$((CYCLE + 1))

    echo "" >> "$LOG"
    echo "==================================================" >> "$LOG"
    echo "CYCLE $CYCLE START — $(date)" >> "$LOG"
    echo "==================================================" >> "$LOG"

    # --------------------------------------------------------
    # БЕЗПЕЧНИЙ WHITELIST
    #
    # Ніякого git ls-files.
    # Ніяких .env, .firebase, logs, generated files.
    # --------------------------------------------------------

    FILE_ARGS=()

    add_file() {
        local file="$1"

        if [ -f "$PROJECT/$file" ]; then
            FILE_ARGS+=(--file "$PROJECT/$file")
        fi
    }

    while IFS= read -r -d '' FILE; do
        REL="${FILE#$PROJECT/}"
        FILE_ARGS+=(--file "$FILE")
    done < <(
        find "$PROJECT/src" -type f \
            \( -name '*.ts' -o \
               -name '*.tsx' -o \
               -name '*.js' -o \
               -name '*.jsx' -o \
               -name '*.css' -o \
               -name '*.html' \) \
            -print0 | sort -z
    )

    add_file "package.json"
    add_file "vite.config.ts"
    add_file "firebase.json"
    add_file "firestore.rules"
    add_file "tailwind.config.js"
    add_file "postcss.config.js"
    add_file "tsconfig.json"
    add_file "tsconfig.app.json"
    add_file "tsconfig.node.json"
    add_file "PROMPT.md"
    add_file "README.md"

    echo "AIDER FILE COUNT: $(( ${#FILE_ARGS[@]} / 2 ))" >> "$LOG"

    # --------------------------------------------------------
    # GLM 5.2
    # --------------------------------------------------------

    timeout --signal=TERM --kill-after=60s 25m \
    "$AIDER" \
        --model "vertex_ai/zai-org/glm-5.2-maas" \
        --no-show-model-warnings \
        --no-browser \
        --yes-always \
        --auto-commits \
        --auto-lint \
        "${FILE_ARGS[@]}" \
        --message-file "$PROJECT/PROMPT.md" \
        --message "

AUTONOMOUS DEVELOPMENT CYCLE $CYCLE

You are the primary autonomous engineering agent for MenteEnCalma.

Operate autonomously inside the project.

Do not ask for confirmation for normal engineering decisions.

You may inspect and modify the project, run shell commands,
run tests, build the application, diagnose failures and improve
the implementation.

NEVER access, print, expose, copy or commit credentials,
private keys, API keys, service-account JSON files,
tokens or secrets.

FIRST:
- inspect current implementation;
- inspect git status;
- inspect recent history;
- understand what already exists;
- choose the single highest-value unfinished task.

Do NOT recreate completed functionality.

MAIN OBJECTIVE:
Continue turning MenteEnCalma into a complete production-ready
Spanish-first, Peru-first, mobile-first, privacy-first product.

Important functionality:
- landing page
- Firebase authentication
- user cabinet
- real user-specific data
- dashboard
- event capture
- pattern engine
- connection map
- relationship analysis
- sleep/night mode
- Tomorrow Box
- history
- daily/weekly/monthly analysis
- charts
- behavioral experiments
- privacy controls
- export
- delete all data
- responsive UX
- PWA
- legal/privacy/cookie/terms/contact
- Android APK/AAB if tooling permits

The application itself MUST NOT contain AI/chatbot/LLM functionality.

PRIORITY:
1. runtime correctness
2. build correctness
3. broken functionality
4. authentication
5. user data
6. analytics
7. core product features
8. privacy
9. PWA
10. Android
11. UX polish

ANTI-LOOP:
Never repeat the same failed operation indefinitely.

When something fails:
1. diagnose it;
2. try a different approach;
3. use a fallback;
4. otherwise move to the next valuable task.

Do not repeat the same failed command more than twice.

TEST:
After meaningful changes:
- run relevant tests;
- run TypeScript checks when useful;
- run lint when useful;
- run npm run build;
- fix failures whenever possible.

Do not merely explain.
Make real code changes.

Before finishing:
leave the repository in a better working state.
"

    AIDER_EXIT=$?

    echo "AIDER EXIT CODE: $AIDER_EXIT" >> "$LOG"

    # --------------------------------------------------------
    # BUILD
    # --------------------------------------------------------

    echo "===== BUILD =====" >> "$LOG"

    npm run build >> "$LOG" 2>&1
    BUILD_EXIT=$?

    echo "BUILD EXIT CODE: $BUILD_EXIT" >> "$LOG"

    # --------------------------------------------------------
    # FIREBASE DEPLOY
    # --------------------------------------------------------

    if [ "$BUILD_EXIT" -eq 0 ]; then

        echo "===== FIREBASE DEPLOY =====" >> "$LOG"

        # Credentials exist only during deployment.
        if [ -n "$CREDENTIALS_PATH" ] && [ -f "$CREDENTIALS_PATH" ]; then
            export GOOGLE_APPLICATION_CREDENTIALS="$CREDENTIALS_PATH"
        else
            unset GOOGLE_APPLICATION_CREDENTIALS
        fi

        firebase deploy \
            --only hosting:menteencalma-d1db9 \
            --project mypsichology \
            --non-interactive \
            >> "$LOG" 2>&1

        DEPLOY_EXIT=$?

        unset GOOGLE_APPLICATION_CREDENTIALS

        echo "FIREBASE DEPLOY EXIT CODE: $DEPLOY_EXIT" >> "$LOG"

        # ----------------------------------------------------
        # PUSH ONLY AFTER SUCCESSFUL BUILD + DEPLOY
        # ----------------------------------------------------

        if [ "$DEPLOY_EXIT" -eq 0 ]; then

            git add -A

            if ! git diff --cached --quiet; then
                git commit \
                    -m "feat: autonomous GLM 5.2 cycle $CYCLE" \
                    >> "$LOG" 2>&1 || true
            fi

            git push origin master >> "$LOG" 2>&1
            PUSH_EXIT=$?

            echo "GIT PUSH EXIT CODE: $PUSH_EXIT" >> "$LOG"

        else
            echo "DEPLOY FAILED — PUSH SKIPPED" >> "$LOG"
        fi

    else
        echo "BUILD FAILED — DEPLOY AND PUSH SKIPPED" >> "$LOG"
    fi

    echo "===== RECENT COMMITS =====" >> "$LOG"
    git log -5 --oneline >> "$LOG" 2>&1 || true

    echo "===== CYCLE $CYCLE COMPLETE =====" >> "$LOG"

    sleep 5

done
