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
