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

# Build a safe list of project files for Aider.
# Secrets / environment files are intentionally excluded.
FILES=()

while IFS= read -r f; do
    FILES+=("$f")
done < <(
    find src -type f \
      ! -name '*.map' \
      ! -path '*/node_modules/*' \
      | sort
)

# Important project configuration files that the agent may need to modify.
FILES+=(
    package.json
    vite.config.ts
    firebase.json
    .firebaserc
)

echo "========================================" >> "$LOG"
echo "MenteEnCalma GLM 5.2 autonomous runner" >> "$LOG"
echo "Started: $(date)" >> "$LOG"
echo "Files supplied to Aider: ${#FILES[@]}" >> "$LOG"
echo "========================================" >> "$LOG"

CYCLE=0

while true; do
    CYCLE=$((CYCLE + 1))

    echo "" >> "$LOG"
    echo "==================================================" >> "$LOG"
    echo "GLM 5.2 CYCLE $CYCLE — $(date)" >> "$LOG"
    echo "==================================================" >> "$LOG"

    # Current repository state
    echo "--- GIT STATUS BEFORE CYCLE ---" >> "$LOG"
    git status --short >> "$LOG" 2>&1 || true

    echo "--- RECENT COMMITS ---" >> "$LOG"
    git log -5 --oneline >> "$LOG" 2>&1 || true

    # Run Aider with actual source files added to its context.
    "$AIDER" \
        --model "vertex_ai/zai-org/glm-5.2-maas" \
        --no-show-model-warnings \
        --no-browser \
        --disable-playwright \
        --yes-always \
        --auto-commits \
        --message-file PROMPT.md \
        --message "
You are working on the ACTUAL repository.

The source files have been explicitly added to your Aider context.
Do NOT claim that you lack repository access.

Use the files in the current Aider context and make real code changes.

Before changing anything:
- inspect the existing implementation;
- inspect recent git history;
- identify what is already complete;
- do not recreate completed functionality.

Continue MenteEnCalma from its CURRENT state.

CRITICAL ANTI-LOOP RULE:
Never repeat the same failed approach indefinitely.
If an approach fails:
1. diagnose the exact reason;
2. try a different implementation;
3. use a fallback/workaround if appropriate;
4. if a blocker is objectively impossible, document it and continue with the next highest-value feature.

Do not spend the whole cycle discussing what should be done.
Make actual repository changes.

Priority:
1. Fix broken runtime/build functionality.
2. Finish the public website.
3. Finish Google Firebase authentication.
4. Finish authenticated user cabinet.
5. Finish real user data persistence and isolation.
6. Finish pattern engine.
7. Finish connection map.
8. Finish dashboard and analytics.
9. Finish night mode and tomorrow box.
10. Finish privacy/export/delete.
11. Finish responsive mobile UX.
12. Finish PWA metadata/installability.
13. Finish legal/public pages.
14. Build Android APK/AAB if Android tooling exists.
15. Test everything and fix errors.

The application itself MUST NOT contain AI/chatbot/LLM functionality.

Spanish-first.
Peru-first.
Android-first.
Privacy-first.
Non-diagnostic.

Do not expose credentials.
Do not invent credentials.
Do not delete working functionality unnecessarily.

When a feature is already implemented:
verify it and improve it only if needed.

At the end of this cycle:
- make real progress;
- run relevant tests;
- run npm run build;
- fix build failures where possible;
- leave the repository in a better, working state.

Do not stop simply because you completed one feature.
Continue until the project is genuinely close to production-ready.
" \
        "${FILES[@]}" \
        >> "$LOG" 2>&1

    AIDER_EXIT=$?

    echo "--- AIDER EXIT CODE: $AIDER_EXIT ---" >> "$LOG"

    echo "--- STATUS AFTER AIDER ---" >> "$LOG"
    git status --short >> "$LOG" 2>&1 || true

    echo "--- COMMITS AFTER AIDER ---" >> "$LOG"
    git log -5 --oneline >> "$LOG" 2>&1 || true

    echo "--- BUILD ---" >> "$LOG"

    npm run build >> "$LOG" 2>&1
    BUILD_EXIT=$?

    echo "--- BUILD EXIT CODE: $BUILD_EXIT ---" >> "$LOG"

    if [ "$BUILD_EXIT" -eq 0 ]; then
        echo "BUILD SUCCESSFUL" >> "$LOG"
    else
        echo "BUILD FAILED — NEXT CYCLE MUST FIX THE BUILD" >> "$LOG"
    fi

    # Rebuild the file list in case the agent created new source files.
    FILES=()

    while IFS= read -r f; do
        FILES+=("$f")
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

    echo "--- END CYCLE $CYCLE ---" >> "$LOG"

    sleep 5
done
