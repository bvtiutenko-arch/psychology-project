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

# GOOGLE_APPLICATION_CREDENTIALS НЕ видаляємо.
# Він може бути потрібен Firebase deploy.

CYCLE=0

while true; do

    CYCLE=$((CYCLE + 1))

    echo ""
    echo "=================================================="
    echo "STARTING AUTONOMOUS CYCLE $CYCLE"
    echo "$(date)"
    echo "=================================================="

    echo "===== CYCLE $CYCLE START =====" >> "$LOG"
    date >> "$LOG"

    # --------------------------------------------------
    # AIDER
    # --------------------------------------------------

    timeout \
        --signal=TERM \
        --kill-after=30m \
        50m \
        "$AIDER" \
        --model "vertex_ai/zai-org/glm-5.2-maas" \
        --no-show-model-warnings \
        --no-browser \
        --yes-always \
        --auto-commits \
        --message-file "$PROJECT/PROMPT.md" \
        --message "
Continue autonomous development from the CURRENT repository state.

First inspect:
- git status
- recent commits
- existing implementation

Do NOT recreate functionality that already exists.

Make real code changes toward a finished production-ready MenteEnCalma application.

The application itself MUST NOT contain AI, chatbot or LLM functionality.

Work autonomously.
Do not ask for confirmation for normal development decisions.

If something fails:
1. diagnose it;
2. try a different technical approach;
3. use a fallback;
4. do not repeat the same failed action indefinitely.

After meaningful changes:
- test;
- run npm run build;
- fix build failures;
- continue to the next useful task.

Do not expose credentials.
Do not add secrets to source code.

Continue until the current cycle reaches a useful stopping point.
"

    AIDER_EXIT=$?

    echo "AIDER EXIT: $AIDER_EXIT"
    echo "AIDER EXIT CODE: $AIDER_EXIT" >> "$LOG"

    # --------------------------------------------------
    # BUILD
    # --------------------------------------------------

    echo ""
    echo "=== BUILDING PROJECT ==="
    echo "===== BUILD =====" >> "$LOG"

    if npm run build >> "$LOG" 2>&1; then

        echo "BUILD SUCCESSFUL"
        echo "BUILD SUCCESSFUL" >> "$LOG"

        # --------------------------------------------------
        # FIREBASE DEPLOY
        # --------------------------------------------------

        echo ""
        echo "=== DEPLOYING TO FIREBASE ==="
        echo "===== FIREBASE DEPLOY =====" >> "$LOG"

        if firebase deploy \
            --only hosting:menteencalma-d1db9 \
            --project mypsichology \
            --non-interactive >> "$LOG" 2>&1; then

            echo "FIREBASE DEPLOY SUCCESSFUL"
            echo "FIREBASE DEPLOY SUCCESSFUL" >> "$LOG"

            # --------------------------------------------------
            # GIT
            # --------------------------------------------------

            echo ""
            echo "=== COMMITTING AND PUSHING ==="

            git add -A

            if git diff --cached --quiet; then
                echo "NO NEW GIT CHANGES"
                echo "NO NEW GIT CHANGES" >> "$LOG"
            else
                git commit \
                    -m "feat/fix: automated agent cycle $CYCLE" \
                    >> "$LOG" 2>&1 || true
            fi

            if git push origin master >> "$LOG" 2>&1; then
                echo "GIT PUSH SUCCESSFUL"
                echo "GIT PUSH SUCCESSFUL" >> "$LOG"
            else
                echo "ERROR: Git push failed."
                echo "ERROR: Git push failed." >> "$LOG"
            fi

        else

            echo "ERROR: Firebase deployment failed."
            echo "ERROR: Firebase deployment failed." >> "$LOG"

        fi

    else

        echo "ERROR: Build failed. Skipping deploy and push."
        echo "ERROR: Build failed. Skipping deploy and push." >> "$LOG"

    fi

    echo ""
    echo "=== CYCLE $CYCLE COMPLETE ==="
    echo "===== CYCLE $CYCLE COMPLETE =====" >> "$LOG"

    sleep 10

done
