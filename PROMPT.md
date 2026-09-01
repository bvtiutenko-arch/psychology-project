# STRICT ENGINEERING PIPELINE: MenteEnCalma (PWA for Peru)

## CORE ARCHITECTURE RULES
- **NO AI INSIDE:** Zero LLMs, chat-bots, or AI therapists. Pure deterministic logic, rules, scoring, and graph correlations.
- **MARKET/UX:** Peru-first, Spanish-first, Mobile/Android-first, offline-ready (IndexedDB), privacy-first.
- **STACK:** Vite, React, TypeScript, Tailwind CSS, Lucide Icons, Firebase Hosting.

## MANDATORY STEP-BY-STEP PIPELINE
You must strictly follow this iterative engineering loop. Do NOT skip steps:
1. **inspect:** Check existing files, repository state, and structure.
2. **design:** Plan components, ontology types (`src/types/`), and pattern engine (`src/services/`).
3. **implement:** Write clean, production-ready React/TypeScript code.
4. **test:** Run `npm run build` to catch type or syntax errors.
5. **fix:** Resolve any compilation or build errors immediately.
6. **build:** Ensure a clean, warning-free production build.
7. **deploy:** Initialize Git, commit changes, create GitHub repository, and push to Firebase Hosting.
8. **verify:** Check that the deployment URL is active, live, and fully functional.
9. **DEPLOYED_OK:** ONLY create an empty file named `DEPLOYED_OK` in the root directory *after* the deployment has been successfully verified. Never create this file prematurely.

---
ОБОВ'ЯЗКОВА ВКАЗІВКА: Коли ти повністю завершиш розробку PWA, створиш GitHub репозиторій та успішно виконаєш деплой у Firebase Hosting, обов'язково створи порожній файл з назвою 'DEPLOYED_OK' у корені проєкту, щоб завершити роботу агента.

---
ОБОВ'ЯЗКОВА ВКАЗІВКА: Суворо дотримуйся пайплайну: inspect -> design -> implement -> test -> fix -> build -> deploy -> verify. Створюй файл 'DEPLOYED_OK' виключно після того, як деплой на Firebase Hosting реально перевірений і працює.


# *SEARCH/REPLACE block* Rules:

Every *SEARCH/REPLACE block* must use this format:
1. The opening fence and code language, eg: ```python
2. The *FULL* file path alone on a line, verbatim. No bold asterisks, no quotes around it, no escaping of characters, etc.
3. The start of search block: <<<<<<< SEARCH
4. A contiguous chunk of lines to search for in the existing source code
5. The dividing line: =======
6. The lines to replace into the source code
7. The end of the replace block: >>>>>>> REPLACE
8. The closing fence: ```

Use the *FULL* file path, as shown to you by the user.

Every *SEARCH* section must *EXACTLY MATCH* the existing file content, character for character, including all comments, docstrings, etc.
If the file contains code or other data wrapped/escaped in json/xml/quotes or other containers, you need to propose edits to the literal contents of the file, including the container markup.

*SEARCH/REPLACE* blocks will *only* replace the first match occurrence.
Including multiple unique *SEARCH/REPLACE* blocks if needed.
Include enough lines in each SEARCH section to uniquely match each set of lines that need to change.

Keep *SEARCH/REPLACE* blocks concise.
Break large *SEARCH/REPLACE* blocks into a series of smaller blocks that each change a small portion of the file.
Include just the changing lines, and a few surrounding lines if needed for uniqueness.
Do not include long runs of unchanging lines in *SEARCH/REPLACE* blocks.

Only create *SEARCH/REPLACE* blocks for files that the user has added to the chat!

To move code within a file, use 2 *SEARCH/REPLACE* blocks: 1 to delete it from its current location, 1 to insert it in the new location.

Pay attention to which filenames the user wants you to edit, especially if they are asking you to create a new file.

If you want to put code in a new file, use a *SEARCH/REPLACE block* with:
- A new file path, including dir name if needed
- An empty `SEARCH` section
- The new file's contents in the `REPLACE` section

To rename files which have been added to the chat, use shell commands at the end of your response.

If the user just says something like "ok" or "go ahead" or "do that" they probably want you to make SEARCH/REPLACE blocks for the code changes you just proposed.
The user will say when they've applied your edits. If they haven't explicitly confirmed the edits have been applied, they probably want proper SEARCH/REPLACE blocks.

Pay careful attention to the scope of the user's request.
Do what they ask, but no more.
Do not improve, comment, fix or modify unrelated parts of the code in any way!


Reply in English.

ONLY EVER RETURN CODE IN A *SEARCH/REPLACE BLOCK*!

Examples of when to suggest shell commands:

- If you changed a self-contained html file, suggest an OS-appropriate command to open a browser to view it to see the updated content.
- If you changed a CLI program, suggest the command to run it to see the new behavior.
- If you added a test, suggest how to run it with the testing tool used by the project.
- Suggest OS-appropriate commands to delete or rename files/directories, or other file system operations.
- If your code changes add new dependencies, suggest the command to install them.
- Etc.
